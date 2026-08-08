import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';
import { MagneticDirective } from '../../shared/motion/magnetic.directive';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, MagneticDirective],
  template: `
    <section class="container-page flex min-h-[80vh] flex-col items-center justify-center py-24 text-center">
      <span class="eyebrow">{{ i18n.t('notfound.eyebrow') }}</span>
      <h1 class="display mt-7 text-[3rem] sm:text-7xl lg:text-8xl">
        <span class="word" style="--i: 0">{{ i18n.t('notfound.titleA') }}</span>
        <span class="word headline-accent" style="--i: 1">{{ i18n.t('notfound.titleAccent') }}</span>
      </h1>
      <p class="mt-8 max-w-md text-[1.0625rem] leading-relaxed text-body">
        {{ i18n.t('notfound.body') }}
      </p>
      <div class="mt-11 flex flex-wrap justify-center gap-4">
        <a routerLink="/" appMagnetic class="btn btn-primary">{{ i18n.t('notfound.home') }}</a>
        <a routerLink="/projects" appMagnetic class="btn btn-ghost">{{ i18n.t('notfound.projects') }}</a>
      </div>
    </section>
  `,
})
export class NotFound {
  protected readonly i18n = inject(I18nService);
}
