import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/content.service';
import { SiteContentService } from '../../core/site-content.service';
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
  private readonly site = inject(SiteContentService);
  protected readonly i18n = inject(I18nService);

  /** Dalle impostazioni salvate, non da una costante di build. */
  protected readonly email = computed(() => this.site.settings().email);
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
      this.goToFirstError();
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

  /**
   * Porta il cursore sul primo campo sbagliato.
   *
   * Senza questo il modulo sembrava rotto: gli errori comparivano sopra
   * il bottone e su telefono restavano fuori dallo schermo, così premere
   * "Invia" non produceva niente di visibile. Il campo va anche messo a
   * fuoco, non solo portato in vista: è ciò che dice a chi usa un lettore
   * di schermo dove si trova il problema.
   */
  private goToFirstError(): void {
    const ordine = ['name', 'email', 'message'];
    const primo = ordine.find((campo) => this.form.get(campo)?.invalid);
    if (!primo) {
      return;
    }

    const elemento = document.getElementById(primo);
    if (!elemento) {
      return;
    }

    elemento.scrollIntoView({ block: 'center', behavior: 'smooth' });
    // Il fuoco dopo lo scorrimento, altrimenti il browser salta di suo.
    setTimeout(() => elemento.focus({ preventScroll: true }), 250);
  }

  protected reset(): void {
    this.state.set('idle');
    this.errorMessage.set('');
  }
}
