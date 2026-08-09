import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';

/**
 * Guscio condiviso dai demo di strumenti interni.
 *
 * Dà ai tre demo l'aspetto di un applicativo — fondo neutro, pannelli
 * bianchi, dati fitti — invece di quello editoriale del portfolio: un
 * gestionale che somiglia a un sito vetrina non convince nessuno.
 *
 * I token stanno su `:host` e non in una classe globale: le proprietà
 * personalizzate si ereditano attraverso il DOM, quindi arrivano anche al
 * contenuto proiettato senza sporcare gli stili del resto del sito.
 */
@Component({
  selector: 'app-demo-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <aside class="banner">
      <div class="banner-inner">
        <span>{{ i18n.t('demo.tool.banner') }}</span>
        <a routerLink="/projects">{{ i18n.t('demo.back') }}</a>
      </div>
    </aside>

    <header class="topbar">
      <div class="topbar-inner">
        <div class="brand">
          <img src="logo-mark.png" width="259" height="294" alt="" aria-hidden="true" />
          <div>
            <p class="title">{{ title() }}</p>
            <p class="subtitle">{{ subtitle() }}</p>
          </div>
        </div>

        <a routerLink="/projects" class="back">{{ i18n.t('demo.back') }}</a>
      </div>
    </header>

    <main class="body">
      <div class="body-inner">
        <ng-content />
      </div>
    </main>
  `,
  styleUrl: './demo-shell.css',
})
export class DemoShell {
  protected readonly i18n = inject(I18nService);

  readonly title = input.required<string>();
  readonly subtitle = input('');
}
