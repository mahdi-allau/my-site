import { Component, inject, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, MfaEnrollment, MfaFactor } from '../../core/auth.service';

/**
 * Sicurezza dell'account: secondo fattore e cambio password.
 *
 * Il QR arriva già disegnato da Supabase come SVG, quindi non serve
 * nessuna libreria per generarlo. Va però marcato come sicuro prima di
 * inserirlo nella pagina: Angular altrimenti lo spoglia, ed è giusto
 * così — qui la fonte è il nostro stesso backend.
 */
@Component({
  selector: 'app-security-editor',
  imports: [ReactiveFormsModule],
  templateUrl: './security-editor.html',
  styleUrl: './security-editor.css',
})
export class SecurityEditor {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly factors = signal<MfaFactor[]>([]);
  protected readonly loading = signal(true);
  protected readonly busy = signal(false);
  protected readonly error = signal('');
  protected readonly toast = signal('');

  /** Attivazione in corso: QR e codice da copiare a mano. */
  protected readonly enrollment = signal<MfaEnrollment | null>(null);
  protected readonly qr = signal<SafeHtml | null>(null);
  protected readonly showSecret = signal(false);

  protected readonly email = this.auth.user()?.email ?? '';

  protected readonly codeForm = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  constructor() {
    void this.load();
  }

  protected async load(): Promise<void> {
    this.loading.set(true);
    try {
      this.factors.set(await this.auth.listFactors());
    } catch (err) {
      this.error.set(message(err));
    } finally {
      this.loading.set(false);
    }
  }

  protected get active(): MfaFactor | undefined {
    return this.factors().find((f) => f.status === 'verified');
  }

  // ------------------------------------------------------------------

  protected async startEnroll(): Promise<void> {
    this.busy.set(true);
    this.error.set('');

    try {
      const enrollment = await this.auth.startEnroll('Telefono');
      this.enrollment.set(enrollment);
      // L'SVG viene dal nostro backend, non dall'utente.
      this.qr.set(this.sanitizer.bypassSecurityTrustHtml(toInlineSvg(enrollment.qrSvg)));
      this.codeForm.reset();
      this.showSecret.set(false);
    } catch (err) {
      this.error.set(message(err));
    } finally {
      this.busy.set(false);
    }
  }

  protected async confirm(): Promise<void> {
    const enrollment = this.enrollment();
    if (!enrollment || this.codeForm.invalid || this.busy()) {
      this.codeForm.markAllAsTouched();
      return;
    }

    this.busy.set(true);
    this.error.set('');

    try {
      await this.auth.confirmEnroll(enrollment.factorId, this.codeForm.getRawValue().code);
      this.enrollment.set(null);
      this.qr.set(null);
      await this.load();
      this.flash('Verifica in due passaggi attiva');
    } catch (err) {
      this.error.set(message(err));
    } finally {
      this.busy.set(false);
    }
  }

  protected async cancelEnroll(): Promise<void> {
    const enrollment = this.enrollment();
    this.enrollment.set(null);
    this.qr.set(null);

    if (enrollment) {
      try {
        await this.auth.removeFactor(enrollment.factorId);
      } catch {
        // Resta un fattore non verificato: la prossima attivazione lo ripulisce.
      }
    }
    await this.load();
  }

  protected async disable(factor: MfaFactor): Promise<void> {
    const sure = confirm(
      'Disattivare la verifica in due passaggi?\n\n' +
        'Da quel momento per entrare basterà la password.',
    );
    if (!sure) {
      return;
    }

    this.busy.set(true);
    try {
      await this.auth.removeFactor(factor.id);
      await this.load();
      this.flash('Verifica in due passaggi disattivata');
    } catch (err) {
      this.error.set(message(err));
    } finally {
      this.busy.set(false);
    }
  }

  protected async copySecret(): Promise<void> {
    const enrollment = this.enrollment();
    if (!enrollment) {
      return;
    }
    try {
      await navigator.clipboard.writeText(enrollment.secret);
      this.flash('Codice copiato');
    } catch {
      this.showSecret.set(true);
    }
  }

  protected invalidCode(): boolean {
    const control = this.codeForm.controls.code;
    return control.invalid && (control.touched || control.dirty);
  }

  private flash(text: string): void {
    this.toast.set(text);
    setTimeout(() => this.toast.set(''), 2400);
  }
}

function message(err: unknown): string {
  const text = err instanceof Error ? err.message : String(err);
  if (/invalid totp|invalid code|verification failed/i.test(text)) {
    return 'Codice non valido. Sull’app cambia ogni trenta secondi: riprova con quello nuovo.';
  }
  if (/rate limit|too many/i.test(text)) {
    return 'Troppi tentativi. Aspetta un minuto e riprova.';
  }
  return text;
}

/**
 * Supabase restituisce il QR come `data:image/svg+xml;utf-8,<svg…>`.
 * Inserendolo direttamente nella pagina resta nitido a ogni dimensione,
 * invece di essere ridimensionato come un'immagine.
 */
function toInlineSvg(dataUrl: string): string {
  const marker = 'svg+xml;utf-8,';
  const index = dataUrl.indexOf(marker);
  if (index === -1) {
    return `<img src="${dataUrl}" alt="" />`;
  }
  return decodeURIComponent(dataUrl.slice(index + marker.length));
}
