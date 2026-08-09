import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ContentService } from '../../core/content.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { accentWords } from '../../core/i18n/accent-words';
import { QuickContact } from '../../shared/quick-contact/quick-contact';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { TiltDirective } from '../../shared/motion/tilt.directive';
import { MagneticDirective } from '../../shared/motion/magnetic.directive';
import { ContactWalkthrough } from '../../shared/contact-walkthrough/contact-walkthrough';

type FormState = 'idle' | 'sending' | 'sent' | 'mailto' | 'error';

@Component({
  selector: 'app-contact',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    RevealDirective,
    TiltDirective,
    MagneticDirective,
    ContactWalkthrough,
    QuickContact,
  ],
  templateUrl: './contact.html',
})
export class Contact {
  private readonly fb = inject(FormBuilder);
  private readonly content = inject(ContentService);
  protected readonly i18n = inject(I18nService);

  protected readonly email = environment.contactEmail;
  protected readonly state = signal<FormState>('idle');
  protected readonly errorMessage = signal('');

  protected readonly headline = computed(() =>
    accentWords(this.i18n.t('contact.title'), this.i18n.t('contact.accent')),
  );

  protected readonly walkHeadline = computed(() =>
    accentWords(this.i18n.t('contact.walk.title'), this.i18n.t('contact.walk.accent')),
  );

  /** Le fasce di budget sono etichette tradotte; il valore salvato è la chiave. */
  protected readonly budgets = ['contact.budget1', 'contact.budget2', 'contact.budget3', 'contact.budget4', 'contact.budget5'];

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
      // Nel messaggio finisce l'etichetta leggibile, non la chiave.
      budget: value.budget ? this.i18n.t(value.budget) : '',
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
