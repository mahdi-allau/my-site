import { Injectable, computed, inject, signal } from '@angular/core';
import type { Session, User } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

/** Fattore di secondo livello registrato sull'account. */
export interface MfaFactor {
  id: string;
  friendlyName: string;
  status: 'verified' | 'unverified';
}

/** Dati per completare l'attivazione: QR da inquadrare e codice da copiare. */
export interface MfaEnrollment {
  factorId: string;
  qrSvg: string;
  secret: string;
  uri: string;
}

/**
 * Livello di garanzia della sessione.
 * `aal1` = solo password. `aal2` = password più codice.
 */
export type AssuranceLevel = 'aal1' | 'aal2';

/** Stato di autenticazione dell'area amministrativa (Supabase Auth). */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase = inject(SupabaseService);

  private readonly sessionSignal = signal<Session | null>(null);
  private restoring: Promise<void> | null = null;

  readonly session = this.sessionSignal.asReadonly();
  readonly user = computed<User | null>(() => this.sessionSignal()?.user ?? null);
  readonly isAuthenticated = computed(() => this.sessionSignal() !== null);
  readonly isConfigured = this.supabase.isConfigured;

  /**
   * Recupera la sessione salvata dal browser. Idempotente: le chiamate
   * successive riusano la stessa promise, così la guard può attenderla senza
   * far ripartire il giro di rete a ogni navigazione.
   */
  ensureReady(): Promise<void> {
    if (!this.supabase.isConfigured) {
      return Promise.resolve();
    }

    this.restoring ??= (async () => {
      const client = await this.supabase.getClient();
      const { data } = await client.auth.getSession();
      this.sessionSignal.set(data.session);

      client.auth.onAuthStateChange((_event, session) => {
        this.sessionSignal.set(session);
      });
    })();

    return this.restoring;
  }

  /**
   * Esito dell'accesso: `done` quando basta la password, `mfa` quando
   * l'account ha un secondo fattore e serve ancora il codice.
   */
  async signIn(email: string, password: string): Promise<'done' | 'mfa'> {
    const client = await this.supabase.getClient();
    const { data, error } = await client.auth.signInWithPassword({ email, password });

    if (error) {
      throw error;
    }

    this.sessionSignal.set(data.session);
    return (await this.needsSecondFactor()) ? 'mfa' : 'done';
  }

  async signOut(): Promise<void> {
    const client = await this.supabase.getClient();
    await client.auth.signOut();
    this.sessionSignal.set(null);
  }

  // ------------------------------------------------------------------
  // Recupero password
  // ------------------------------------------------------------------

  /**
   * Invia il link di recupero.
   *
   * Non restituisce mai un errore "indirizzo inesistente": chi prova a
   * indovinare l'email dell'amministratore non deve poterla scoprire
   * confrontando le risposte. Chi ha davvero quell'indirizzo riceve la
   * mail, chi non ce l'ha vede lo stesso messaggio e basta.
   */
  async sendPasswordReset(email: string): Promise<void> {
    const client = await this.supabase.getClient();
    await client.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${location.origin}/admin/nuova-password`,
    });
  }

  /** Imposta la nuova password sulla sessione aperta dal link di recupero. */
  async updatePassword(password: string): Promise<void> {
    const client = await this.supabase.getClient();
    const { error } = await client.auth.updateUser({ password });
    if (error) {
      throw error;
    }
  }

  // ------------------------------------------------------------------
  // Secondo fattore
  // ------------------------------------------------------------------

  /** Livello raggiunto e livello richiesto dall'account. */
  async assurance(): Promise<{ current: AssuranceLevel; next: AssuranceLevel } | null> {
    const client = await this.supabase.getClient();
    const { data } = await client.auth.mfa.getAuthenticatorAssuranceLevel();
    if (!data) {
      return null;
    }
    return {
      current: (data.currentLevel as AssuranceLevel) ?? 'aal1',
      next: (data.nextLevel as AssuranceLevel) ?? 'aal1',
    };
  }

  /**
   * Vero quando l'account ha un secondo fattore ma la sessione non l'ha
   * ancora superato. È la condizione su cui si regge la guard.
   */
  async needsSecondFactor(): Promise<boolean> {
    const level = await this.assurance();
    return !!level && level.next === 'aal2' && level.current !== 'aal2';
  }

  async listFactors(): Promise<MfaFactor[]> {
    const client = await this.supabase.getClient();
    const { data, error } = await client.auth.mfa.listFactors();

    if (error || !data) {
      return [];
    }

    return (data.all ?? []).map((f) => ({
      id: f.id,
      friendlyName: f.friendly_name ?? 'Authenticator',
      status: f.status as 'verified' | 'unverified',
    }));
  }

  /** Primo passo dell'attivazione: crea il fattore e restituisce il QR. */
  async startEnroll(friendlyName: string): Promise<MfaEnrollment> {
    const client = await this.supabase.getClient();

    // Un tentativo lasciato a metà blocca i successivi: prima di crearne
    // uno nuovo si ripulisce quello eventualmente rimasto da verificare.
    await this.removeUnverified();

    const { data, error } = await client.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName,
    });

    if (error || !data) {
      throw error ?? new Error('Attivazione non riuscita');
    }

    return {
      factorId: data.id,
      qrSvg: data.totp.qr_code,
      secret: data.totp.secret,
      uri: data.totp.uri,
    };
  }

  /** Secondo passo: conferma con il codice mostrato dall'app. */
  async confirmEnroll(factorId: string, code: string): Promise<void> {
    const client = await this.supabase.getClient();
    const challenge = await client.auth.mfa.challenge({ factorId });

    if (challenge.error || !challenge.data) {
      throw challenge.error ?? new Error('Verifica non riuscita');
    }

    const { error } = await client.auth.mfa.verify({
      factorId,
      challengeId: challenge.data.id,
      code: code.trim(),
    });

    if (error) {
      throw error;
    }

    await this.refreshSession();
  }

  /** Codice richiesto al momento dell'accesso. */
  async verifyLoginCode(code: string): Promise<void> {
    const client = await this.supabase.getClient();
    const factors = await this.listFactors();
    const factor = factors.find((f) => f.status === 'verified');

    if (!factor) {
      throw new Error('Nessun secondo fattore attivo su questo account.');
    }

    const challenge = await client.auth.mfa.challenge({ factorId: factor.id });
    if (challenge.error || !challenge.data) {
      throw challenge.error ?? new Error('Verifica non riuscita');
    }

    const { error } = await client.auth.mfa.verify({
      factorId: factor.id,
      challengeId: challenge.data.id,
      code: code.trim(),
    });

    if (error) {
      throw error;
    }

    await this.refreshSession();
  }

  async removeFactor(factorId: string): Promise<void> {
    const client = await this.supabase.getClient();
    const { error } = await client.auth.mfa.unenroll({ factorId });
    if (error) {
      throw error;
    }
    await this.refreshSession();
  }

  /** Ripulisce i tentativi di attivazione mai confermati. */
  private async removeUnverified(): Promise<void> {
    const client = await this.supabase.getClient();
    for (const factor of await this.listFactors()) {
      if (factor.status !== 'verified') {
        await client.auth.mfa.unenroll({ factorId: factor.id });
      }
    }
  }

  /** Dopo una verifica il token cambia livello: va riletto. */
  private async refreshSession(): Promise<void> {
    const client = await this.supabase.getClient();
    const { data } = await client.auth.getSession();
    this.sessionSignal.set(data.session);
  }
}
