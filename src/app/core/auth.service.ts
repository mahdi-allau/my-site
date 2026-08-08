import { Injectable, computed, inject, signal } from '@angular/core';
import type { Session, User } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

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

  async signIn(email: string, password: string): Promise<void> {
    const client = await this.supabase.getClient();
    const { data, error } = await client.auth.signInWithPassword({ email, password });

    if (error) {
      throw error;
    }

    this.sessionSignal.set(data.session);
  }

  async signOut(): Promise<void> {
    const client = await this.supabase.getClient();
    await client.auth.signOut();
    this.sessionSignal.set(null);
  }
}
