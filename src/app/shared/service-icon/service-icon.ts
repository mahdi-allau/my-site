import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ServiceIcon as ServiceIconName } from '../../core/models';

/** Piccola libreria di icone inline: nessuna dipendenza esterna da caricare. */
@Component({
  selector: 'app-service-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      [attr.class]="iconClass()"
    >
      @switch (name()) {
        @case ('globe') {
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
        }
        @case ('restaurant') {
          <path d="M6 3v8a2 2 0 0 0 4 0V3M8 11v10" />
          <path d="M17 3c-1.7 1.2-2.5 3-2.5 5.5S15.3 12 17 12v9" />
        }
        @case ('app') {
          <rect x="3" y="4" width="18" height="16" rx="2.5" />
          <path d="M3 9h18M7 6.5h.01M9.5 6.5h.01" />
        }
        @case ('chart') {
          <path d="M4 20h16" />
          <path d="M7 20v-6M12 20V7M17 20v-9" />
        }
        @default {
          <path d="M12 3l1.9 5.3L19 10l-5.1 1.7L12 17l-1.9-5.3L5 10l5.1-1.7z" />
          <path d="M18 15.5l.7 1.9 1.8.6-1.8.6-.7 1.9-.7-1.9-1.8-.6 1.8-.6z" />
        }
      }
    </svg>
  `,
})
export class ServiceIconComponent {
  readonly name = input.required<ServiceIconName>();
  readonly iconClass = input('h-6 w-6');
}
