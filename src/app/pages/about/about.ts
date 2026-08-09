import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SKILL_GROUPS } from '../../core/seed-content';
import { I18nService } from '../../core/i18n/i18n.service';
import { accentWords } from '../../core/i18n/accent-words';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { TiltDirective } from '../../shared/motion/tilt.directive';
import { MagneticDirective } from '../../shared/motion/magnetic.directive';
import { CraftFlow } from '../../shared/craft-flow/craft-flow';

@Component({
  selector: 'app-about',
  imports: [RouterLink, RevealDirective, TiltDirective, MagneticDirective, CraftFlow],
  templateUrl: './about.html',
})
export class About {
  protected readonly i18n = inject(I18nService);

  protected readonly skillGroups = SKILL_GROUPS;
  protected readonly areas = [1, 2, 3];
  protected readonly principles = [1, 2, 3, 4];

  protected readonly headline = computed(() =>
    accentWords(this.i18n.t('about.title'), this.i18n.t('about.accent')),
  );

  /** Gli stack delle tre aree sono nomi propri: identici nelle due lingue. */
  protected readonly areaStacks: Record<number, string[]> = {
    1: ['Angular', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL'],
    2: ['Python', 'SQL', 'PostgreSQL', 'Power BI'],
    3: ['Arduino', 'ESP32', 'C', 'C++', 'MATLAB'],
  };
}
