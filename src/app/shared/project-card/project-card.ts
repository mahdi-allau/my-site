import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Project } from '../../core/models';
import { I18nService } from '../../core/i18n/i18n.service';
import { TiltDirective } from '../motion/tilt.directive';

@Component({
  selector: 'app-project-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TiltDirective],
  templateUrl: './project-card.html',
})
export class ProjectCard {
  protected readonly i18n = inject(I18nService);

  readonly project = input.required<Project>();

  /** In versione estesa vengono mostrati anche descrizione e punti chiave. */
  readonly detailed = input(false);
}
