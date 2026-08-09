import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { Logo } from '../../shared/logo/logo';

/** `password` chiede le credenziali, `code` il secondo fattore, `reset` il recupero. */
type Step = 'password' | 'code' | 'reset' | 'resetSent';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, Logo],
  templateUrl: './login.html',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly isConfigured = this.auth.isConfigured;
  protected readonly busy = signal(false);
  protected readonly error = signal('');
  protected readonly step = signal<Step>('password');

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected readonly codeForm = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  protected readonly resetForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor() {
    void this.auth.ensureReady().then(async () => {
      if (!this.auth.isAuthenticated()) {
        return;
      }
      // Una sessione con la sola password su un account protetto va
      // completata, non saltata: si riprende dal codice.
      if (await this.auth.needsSecondFactor()) {
        this.step.set('code');
        return;
      }
      void this.router.navigateByUrl(this.redirectTarget());
    });
  }

  // ------------------------------------------------------------------

  protected async submit(): Promise<void> {
    if (this.form.invalid || this.busy()) {
      this.form.markAllAsTouched();
      return;
    }

    this.busy.set(true);
    this.error.set('');

    const { email, password } = this.form.getRawValue();

    try {
      const outcome = await this.auth.signIn(email, password);

      if (outcome === 'mfa') {
        this.step.set('code');
        return;
      }
      await this.router.navigateByUrl(this.redirectTarget());
    } catch (err) {
      this.error.set(translate(err));
    } finally {
      this.busy.set(false);
    }
  }

  protected async submitCode(): Promise<void> {
    if (this.codeForm.invalid || this.busy()) {
      this.codeForm.markAllAsTouched();
      return;
    }

    this.busy.set(true);
    this.error.set('');

    try {
      await this.auth.verifyLoginCode(this.codeForm.getRawValue().code);
      await this.router.navigateByUrl(this.redirectTarget());
    } catch (err) {
      this.error.set(translate(err));
    } finally {
      this.busy.set(false);
    }
  }

  protected async submitReset(): Promise<void> {
    if (this.resetForm.invalid || this.busy()) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.busy.set(true);
    this.error.set('');

    try {
      await this.auth.sendPasswordReset(this.resetForm.getRawValue().email);
      // Stesso esito comunque: vedi la nota in `sendPasswordReset`.
      this.step.set('resetSent');
    } catch (err) {
      this.error.set(translate(err));
    } finally {
      this.busy.set(false);
    }
  }

  // ------------------------------------------------------------------

  protected goToReset(): void {
    this.resetForm.patchValue({ email: this.form.getRawValue().email });
    this.error.set('');
    this.step.set('reset');
  }

  protected backToPassword(): void {
    this.error.set('');
    this.step.set('password');
  }

  /** Esce dalla sessione a metà, per poter accedere con un altro account. */
  protected async abandon(): Promise<void> {
    await this.auth.signOut();
    this.codeForm.reset();
    this.backToPassword();
  }

  protected invalidCode(): boolean {
    const control = this.codeForm.controls.code;
    return control.invalid && (control.touched || control.dirty);
  }

  private redirectTarget(): string {
    return this.route.snapshot.queryParamMap.get('redirect') ?? '/admin';
  }
}

/** I messaggi di Supabase Auth arrivano in inglese: li rendo leggibili. */
function translate(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);

  if (/invalid login credentials/i.test(message)) {
    return 'Email o password non corretti.';
  }
  if (/email not confirmed/i.test(message)) {
    return 'L’indirizzo email non è ancora stato confermato.';
  }
  if (/invalid totp|invalid code|verification failed/i.test(message)) {
    return 'Codice non valido. Controlla che sull’app sia quello del momento.';
  }
  if (/rate limit|too many|over_email_send_rate/i.test(message)) {
    return 'Troppi tentativi. Riprova fra qualche minuto.';
  }
  if (/fetch|network/i.test(message)) {
    return 'Impossibile raggiungere il server. Controlla la connessione.';
  }
  return message;
}
