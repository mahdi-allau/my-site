import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';
import { SiteContentService } from '../../core/site-content.service';

/**
 * Telefono e WhatsApp, presi dalle impostazioni dell'area riservata.
 *
 * Non compaiono finché non sono compilati: un pulsante «chiama» che apre
 * un numero vuoto è peggio di nessun pulsante. Servono perché i clienti
 * di questo sito — ristoratori, piccole attività — scrivono su WhatsApp
 * o telefonano; la mail la leggono a mezzanotte, se la leggono.
 */
@Component({
  selector: 'app-quick-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './quick-contact.html',
  styleUrl: './quick-contact.css',
})
export class QuickContact {
  private readonly site = inject(SiteContentService);
  protected readonly i18n = inject(I18nService);

  /** `inline` per piè di pagina e contatti, `floating` per il tasto su telefono. */
  readonly variant = input<'inline' | 'floating'>('inline');

  protected readonly phone = computed(() => this.site.settings().phone.trim());
  protected readonly whatsapp = computed(() => this.site.settings().whatsapp.trim());

  protected readonly hasAny = computed(() => !!this.phone() || !!this.whatsapp());

  /** `tel:` non tollera spazi e parentesi. */
  protected readonly telHref = computed(() => `tel:${this.phone().replace(/[^\d+]/g, '')}`);

  /** wa.me vuole il numero senza + e senza separatori. */
  protected readonly waHref = computed(() => {
    const number = this.whatsapp().replace(/[^\d]/g, '');
    const text = encodeURIComponent(this.i18n.t('contact.whatsappText'));
    return `https://wa.me/${number}?text=${text}`;
  });
}
