import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
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

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    // Se una sessione è già attiva, si salta il login.
    void this.auth.ensureReady().then(() => {
      if (this.auth.isAuthenticated()) {
        void this.router.navigateByUrl(this.redirectTarget());
      }
    });
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid || this.busy()) {
      this.form.markAllAsTouched();
      return;
    }

    this.busy.set(true);
    this.error.set('');

    const { email, password } = this.form.getRawValue();

    try {
      await this.auth.signIn(email, password);
      await this.router.navigateByUrl(this.redirectTarget());
    } catch (err) {
      this.error.set(translate(err));
    } finally {
      this.busy.set(false);
    }
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
  if (/rate limit|too many/i.test(message)) {
    return 'Troppi tentativi. Riprova fra qualche minuto.';
  }
  if (/fetch|network/i.test(message)) {
    return 'Impossibile raggiungere il server. Controlla la connessione.';
  }
  return message;
}
