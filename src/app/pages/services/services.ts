import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/content.service';
import { ServiceOffer } from '../../core/models';
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
  protected readonly i18n = inject(I18nService);

  protected readonly services = signal<ServiceOffer[]>([]);
  protected readonly loading = signal(true);
  protected readonly faq = [1, 2, 3, 4];

  /** Pacchetti: chiavi in `translations.ts`, il secondo è quello evidenziato. */
  protected readonly packages = [
    { id: 1, features: [1, 2, 3, 4], highlight: false },
    { id: 2, features: [1, 2, 3, 4, 5], highlight: true },
    { id: 3, features: [1, 2, 3, 4], highlight: false },
  ];

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
    this.services.set(await this.content.listServices());
    this.loading.set(false);
  }
}
