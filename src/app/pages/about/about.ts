import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';
import { accentWords } from '../../core/i18n/accent-words';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { TiltDirective } from '../../shared/motion/tilt.directive';
import { MagneticDirective } from '../../shared/motion/magnetic.directive';
import { CraftFlow } from '../../shared/craft-flow/craft-flow';
import { CraftScene } from '../../shared/craft-scene/craft-scene';
import { PromiseSeals } from '../../shared/promise-seals/promise-seals';

@Component({
  selector: 'app-about',
  imports: [
    RouterLink,
    RevealDirective,
    TiltDirective,
    MagneticDirective,
    CraftFlow,
    CraftScene,
    PromiseSeals,
  ],
  templateUrl: './about.html',
})
export class About {
  protected readonly i18n = inject(I18nService);

  protected readonly areas = [1, 2, 3];
  protected readonly principles = [1, 2, 3, 4];

  protected readonly headline = computed(() =>
    accentWords(this.i18n.t('about.title'), this.i18n.t('about.accent')),
  );

}
