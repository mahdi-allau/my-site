import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Marchio SARAH.
 *
 * I file sono ritagliati dal logo originale con lo sfondo reso trasparente,
 * in due versioni di colore: verde per i fondi chiari, crema per le fasce
 * verdi. Il colore non si può ottenere via CSS perché sono immagini, non
 * SVG — da qui l'input `tone`.
 *
 * Il nome resta anche come testo per i lettori di schermo e per la ricerca:
 * un logo che è solo un'immagine sparisce da entrambi.
 */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="inline-flex items-center" [class.gap-3]="showWordmark()">
      <img
        [src]="markSrc()"
        [style.height.px]="markHeight()"
        width="259"
        height="294"
        alt=""
        aria-hidden="true"
        class="w-auto shrink-0"
        [class.mark-hover]="interactive()"
      />

      @if (showWordmark()) {
        <img
          [src]="wordSrc()"
          [style.height.px]="wordHeight()"
          width="791"
          height="95"
          [alt]="alt()"
          class="w-auto shrink-0"
        />
      } @else {
        <span class="sr-only">{{ alt() }}</span>
      }
    </span>
  `,
  styles: `
    :host {
      display: inline-flex;
    }

    img {
      /* Il marchio è un tratto sottile: senza questo su schermi a bassa
         densità i bordi diagonali si sgranano. */
      image-rendering: -webkit-optimize-contrast;
    }

    .mark-hover {
      transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    a:hover .mark-hover {
      transform: scale(1.07);
    }

    @media (prefers-reduced-motion: reduce) {
      .mark-hover {
        transition: none;
      }
    }
  `,
})
export class Logo {
  /** `dark` sulle fasce verdi, `light` sui fondi chiari. */
  readonly tone = input<'light' | 'dark'>('light');

  /** Altezza del monogramma in pixel; la scritta si dimensiona di conseguenza. */
  readonly markHeight = input(38);

  /** Con `false` resta il solo monogramma (barre strette, favicon, sipario). */
  readonly showWordmark = input(true);

  readonly interactive = input(false);

  readonly alt = input('SARAH — sviluppo web su misura');

  protected readonly markSrc = computed(() =>
    this.tone() === 'dark' ? 'logo-mark-light.png' : 'logo-mark.png',
  );

  protected readonly wordSrc = computed(() =>
    this.tone() === 'dark' ? 'logo-word-light.png' : 'logo-word.png',
  );

  /** Proporzione presa dal logo originale, così il blocco resta bilanciato. */
  protected readonly wordHeight = computed(() => Math.round(this.markHeight() * 0.42));
}
