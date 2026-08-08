import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { I18nService } from '../../core/i18n/i18n.service';
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
  protected readonly email = environment.contactEmail;
  protected readonly sections = [1, 2, 3, 4, 5, 6];

  /** Data dell'ultima revisione del testo, non della build. */
  protected readonly updated = new Date('2026-08-08');

  protected readonly headline = computed(() =>
    accentWords(this.i18n.t('privacy.title'), this.i18n.t('privacy.accent')),
  );
}
