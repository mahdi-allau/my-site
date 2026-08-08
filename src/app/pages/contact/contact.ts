import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ContentService } from '../../core/content.service';

type FormState = 'idle' | 'sending' | 'sent' | 'mailto' | 'error';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
})
export class Contact {
  private readonly fb = inject(FormBuilder);
  private readonly content = inject(ContentService);

  protected readonly email = environment.contactEmail;
  protected readonly state = signal<FormState>('idle');
  protected readonly errorMessage = signal('');

  protected readonly budgets = [
    'Non lo so ancora',
    'Meno di 1.000 €',
    '1.000 – 2.500 €',
    '2.500 – 5.000 €',
    'Oltre 5.000 €',
  ];

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    company: [''],
    budget: [''],
    message: ['', [Validators.required, Validators.minLength(20)]],
    // Campo trappola: invisibile agli utenti, spesso compilato dai bot.
    website: [''],
  });

  protected invalid(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    // Il bot ha compilato la trappola: fingiamo il successo e non salviamo nulla.
    if (value.website.trim().length > 0) {
      this.state.set('sent');
      return;
    }

    this.state.set('sending');
    this.errorMessage.set('');

    const result = await this.content.sendContactMessage({
      name: value.name,
      email: value.email,
      company: value.company,
      budget: value.budget,
      message: value.message,
    });

    if (!result.ok) {
      this.errorMessage.set(result.error);
      this.state.set('error');
      return;
    }

    if (result.mode === 'mailto') {
      // Database non ancora collegato: apriamo il client di posta.
      window.location.href = result.href;
      this.state.set('mailto');
      return;
    }

    this.form.reset();
    this.state.set('sent');
  }

  protected reset(): void {
    this.state.set('idle');
    this.errorMessage.set('');
  }
}
