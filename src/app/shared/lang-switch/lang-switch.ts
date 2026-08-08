import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { I18nService, LANGUAGES, Lang } from '../../core/i18n/i18n.service';

/**
 * Selettore di lingua: due bandiere con sigla accanto.
 *
 * Le bandiere sono SVG scritte a mano, senza `clipPath`: gli id sarebbero
 * duplicati quando il componente compare due volte nella stessa pagina
 * (barra desktop e menù mobile). Le diagonali della Union Jack escono dal
 * riquadro e vengono tagliate dal bordo dell'SVG, che è quanto basta a
 * quella dimensione.
 *
 * La sigla resta sempre visibile: la bandiera da sola è ambigua — l'inglese
 * non è la lingua di un solo paese.
 */
@Component({
  selector: 'app-lang-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="inline-flex items-center gap-0.5 rounded-full border border-line p-1"
      role="group"
      [attr.aria-label]="i18n.t('lang.switch')"
    >
      @for (item of languages; track item.code) {
        <button
          type="button"
          (click)="i18n.setLang(item.code)"
          [attr.aria-pressed]="i18n.lang() === item.code"
          [attr.title]="i18n.t('lang.' + item.code)"
          [class]="buttonClass(item.code)"
        >
          <svg viewBox="0 0 24 16" class="h-3.5 w-5 shrink-0 rounded-[2px]" aria-hidden="true">
            @if (item.code === 'it') {
              <rect width="8" height="16" fill="#009246" />
              <rect x="8" width="8" height="16" fill="#F1F2F1" />
              <rect x="16" width="8" height="16" fill="#CE2B37" />
            } @else {
              <rect width="24" height="16" fill="#012169" />
              <path d="M0 0 L24 16 M24 0 L0 16" stroke="#FFF" stroke-width="3.4" />
              <path d="M0 0 L24 16 M24 0 L0 16" stroke="#C8102E" stroke-width="1.8" />
              <path d="M12 0 V16 M0 8 H24" stroke="#FFF" stroke-width="5.4" />
              <path d="M12 0 V16 M0 8 H24" stroke="#C8102E" stroke-width="3.2" />
            }
          </svg>
          <span>{{ item.label }}</span>
          <span class="sr-only">{{ i18n.t('lang.' + item.code) }}</span>
        </button>
      }
    </div>
  `,
})
export class LangSwitch {
  protected readonly i18n = inject(I18nService);
  protected readonly languages = LANGUAGES;

  /** Su fondo verde il pulsante attivo va invertito. */
  readonly onDark = input(false);

  protected buttonClass(code: Lang): string {
    const base =
      'inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wider transition-colors duration-300';

    if (this.i18n.lang() !== code) {
      return `${base} text-muted hover:text-heading`;
    }

    return this.onDark()
      ? `${base} bg-sand-100 text-forest-950`
      : `${base} bg-forest-800 text-sand-100`;
  }
}
