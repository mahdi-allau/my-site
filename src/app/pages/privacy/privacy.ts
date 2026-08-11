import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';
import { SiteContentService } from '../../core/site-content.service';
import { accentWords } from '../../core/i18n/accent-words';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { TiltDirective } from '../../shared/motion/tilt.directive';

@Component({
  selector: 'app-privacy',
  imports: [RouterLink, DatePipe, RevealDirective, TiltDirective],
  templateUrl: './privacy.html',
})
export class Privacy {
  protected readonly i18n = inject(I18nService);
  private readonly site = inject(SiteContentService);

  /** L'informativa deve riportare l'indirizzo a cui si scrive davvero. */
  protected readonly email = computed(() => this.site.settings().email);
  protected readonly sections = [1, 2, 3, 4, 5, 6];

  /** Data dell'ultima revisione del testo, non della build. */
  protected readonly updated = new Date('2026-08-08');

  protected readonly headline = computed(() =>
    accentWords(this.i18n.t('privacy.title'), this.i18n.t('privacy.accent')),
  );
}
