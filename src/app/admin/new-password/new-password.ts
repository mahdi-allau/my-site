import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { Logo } from '../../shared/logo/logo';

/**
 * Nuova password, aperta dal link ricevuto via email.
 *
 * Il link porta con sé un token che Supabase trasforma in una sessione
 * temporanea appena la pagina si carica: da lì `updateUser` può cambiare
 * la password. Se qualcuno arriva qui senza aver cliccato il link non
 * c'è nessuna sessione, e la pagina lo dice invece di mostrare un modulo
 * che fallirebbe al salvataggio.
 */
@Component({
  selector: 'app-new-password',
  imports: [ReactiveFormsModule, RouterLink, Logo],
  templateUrl: './new-password.html',
})
export class NewPassword {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly checking = signal(true);
  protected readonly hasSession = signal(false);
  protected readonly busy = signal(false);
  protected readonly done = signal(false);
  protected readonly error = signal('');

  protected readonly form = this.fb.nonNullable.group(
    {
      password: ['', [Validators.required, Validators.minLength(10)]],
      confirm: ['', Validators.required],
    },
    { validators: matchPasswords },
  );

  constructor() {
    void this.auth.ensureReady().then(() => {
      this.hasSession.set(this.auth.isAuthenticated());
      this.checking.set(false);
    });
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid || this.busy()) {
      this.form.markAllAsTouched();
      return;
    }

    this.busy.set(true);
    this.error.set('');

    try {
      await this.auth.updatePassword(this.form.getRawValue().password);
      this.done.set(true);

      // Si esce dalla sessione aperta dal link: la password nuova va
      // provata subito, così ci si accorge ora se non è stata memorizzata.
      await this.auth.signOut();
    } catch (err) {
      this.error.set(translate(err));
    } finally {
      this.busy.set(false);
    }
  }

  protected async goToLogin(): Promise<void> {
    await this.router.navigateByUrl('/admin/login');
  }

  protected invalid(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  protected get mismatch(): boolean {
    return this.form.hasError('mismatch') && this.form.controls.confirm.touched;
  }
}

function matchPasswords(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirm')?.value;
  return password && confirm && password !== confirm ? { mismatch: true } : null;
}

function translate(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);

  if (/should be different|same as the old/i.test(message)) {
    return 'La nuova password deve essere diversa dalla precedente.';
  }
  if (/weak|pwned|breach/i.test(message)) {
    return 'Questa password è troppo comune: scegline un’altra.';
  }
  if (/expired|invalid|token/i.test(message)) {
    return 'Il link è scaduto. Chiedine uno nuovo dalla pagina di accesso.';
  }
  return message;
}
