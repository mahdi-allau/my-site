import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/content.service';
import { ServiceOffer } from '../../core/models';
import { PricingService, PricingView, formatPrice } from '../../core/pricing.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { accentWords } from '../../core/i18n/accent-words';
import { ServiceIconComponent } from '../../shared/service-icon/service-icon';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { TiltDirective } from '../../shared/motion/tilt.directive';
import { MagneticDirective } from '../../shared/motion/magnetic.directive';

@Component({
  selector: 'app-services',
  imports: [RouterLink, ServiceIconComponent, RevealDirective, TiltDirective, MagneticDirective],
  templateUrl: './services.html',
})
export class Services {
  private readonly content = inject(ContentService);
  private readonly pricing = inject(PricingService);
  protected readonly i18n = inject(I18nService);

  protected readonly services = signal<ServiceOffer[]>([]);
  protected readonly loading = signal(true);
  protected readonly faq = [1, 2, 3, 4];

  /**
   * Pacchetti dal database. Se non arrivano — database non collegato o
   * tabella vuota — si ricade su quelli scritti nelle traduzioni, così la
   * sezione prezzi non sparisce mai dalla pagina.
   */
  protected readonly packages = computed<PricingView[]>(() => {
    const fromDb = this.pricing.view();
    return fromDb.length ? fromDb : this.fallbackPackages();
  });

  protected readonly headline = computed(() =>
    accentWords(this.i18n.t('services.title'), this.i18n.t('services.accent')),
  );

  protected readonly pricingHeadline = computed(() =>
    accentWords(this.i18n.t('pricing.title'), this.i18n.t('pricing.accent')),
  );

  constructor() {
    effect(() => {
      this.i18n.lang();
      void this.load();
    });
  }

  private async load(): Promise<void> {
    await Promise.all([
      this.content.listServices().then((list) => this.services.set(list)),
      this.pricing.load(),
    ]);
    this.loading.set(false);
  }

  /** I tre pacchetti scritti nelle traduzioni, usati solo come rete. */
  private fallbackPackages(): PricingView[] {
    const lang = this.i18n.lang();
    return [
      { id: '1', features: [1, 2, 3, 4], highlight: false },
      { id: '2', features: [1, 2, 3, 4, 5], highlight: true },
      { id: '3', features: [1, 2, 3, 4], highlight: false },
    ].map((p) => ({
      id: p.id,
      slug: `pacchetto-${p.id}`,
      name: this.i18n.t(`pricing.${p.id}.name`),
      audience: this.i18n.t(`pricing.${p.id}.for`),
      duration: this.i18n.t(`pricing.${p.id}.time`),
      features: p.features.map((f) => this.i18n.t(`pricing.${p.id}.f${f}`)),
      highlight: p.highlight,
      fullPrice: '',
      price: formatPrice(Number(this.i18n.t(`pricing.${p.id}.price`).replace(/[.,]/g, '')) || 0, lang),
      discountLabel: '',
      hasDiscount: false,
    }));
  }
}
