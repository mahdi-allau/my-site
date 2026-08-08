import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Project } from '../../core/models';
import { TiltDirective } from '../motion/tilt.directive';

@Component({
  selector: 'app-project-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TiltDirective],
  templateUrl: './project-card.html',
})
export class ProjectCard {
  readonly project = input.required<Project>();

  /** In versione estesa vengono mostrati anche descrizione e punti chiave. */
  readonly detailed = input(false);
}
