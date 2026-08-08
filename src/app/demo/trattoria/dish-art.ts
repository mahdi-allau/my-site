import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type DishArt = 'pasta' | 'wine' | 'bread' | 'fish' | 'oven' | 'herbs';

/**
 * Illustrazioni a linee al posto delle fotografie.
 *
 * Un sito di ristorante vive di foto vere, che qui non ho: usare immagini
 * di repertorio avrebbe reso il demo indistinguibile da un template. Queste
 * illustrazioni sono dichiaratamente disegnate, restano nitide a ogni
 * risoluzione e pesano quasi nulla.
 *
 * Per sostituirle con foto vere basta rimpiazzare `<app-dish-art>` con un
 * `<img>`: i contenitori hanno già proporzioni e ritaglio impostati.
 */
@Component({
  selector: 'app-dish-art',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      class="h-full w-full"
    >
      @switch (name()) {
        @case ('pasta') {
          <circle cx="100" cy="100" r="62" opacity=".45" />
          <circle cx="100" cy="100" r="50" />
          <path d="M74 96c8-9 16 4 24-4s14 5 24-3" />
          <path d="M72 106c9-8 17 5 25-3s15 6 25-2" />
          <path d="M76 116c8-7 15 4 22-3s13 5 21-1" />
          <circle cx="92" cy="88" r="4.5" />
          <circle cx="116" cy="98" r="3.5" />
        }
        @case ('wine') {
          <path d="M76 44h48l-4 34a20 20 0 0 1-40 0z" />
          <path d="M100 98v42" />
          <path d="M78 152h44" />
          <path d="M100 140c-9 0-18 5-22 12h44c-4-7-13-12-22-12z" />
          <path d="M84 62h32" opacity=".5" />
        }
        @case ('bread') {
          <ellipse cx="100" cy="108" rx="58" ry="38" />
          <path d="M62 96c10-8 22-12 38-12s28 4 38 12" opacity=".5" />
          <path d="M78 88l10 16M100 84l10 18M122 88l9 15" />
        }
        @case ('fish') {
          <path d="M42 100c22-26 62-34 92-20 12 6 20 13 24 20-4 7-12 14-24 20-30 14-70 6-92-20z" />
          <path d="M42 100l-16-16v32z" />
          <circle cx="138" cy="94" r="4" />
          <path d="M96 80c6 12 6 28 0 40" opacity=".5" />
          <path d="M118 84c5 10 5 22 0 32" opacity=".35" />
        }
        @case ('oven') {
          <path d="M36 132h128" />
          <path d="M46 132V90a54 54 0 0 1 108 0v42" />
          <path d="M74 132V98a26 26 0 0 1 52 0v34" />
          <path d="M64 148h72" opacity=".5" />
          <path d="M92 74c4-6 2-12-2-16M108 76c4-6 2-12-2-16" opacity=".6" />
        }
        @default {
          <path d="M100 156V72" />
          <path d="M100 96c-14-2-24-12-26-26 14 2 24 12 26 26z" />
          <path d="M100 96c14-2 24-12 26-26-14 2-24 12-26 26z" />
          <path d="M100 126c-12-2-21-10-23-22 12 2 21 10 23 22z" />
          <path d="M100 126c12-2 21-10 23-22-12 2-21 10-23 22z" />
          <path d="M86 156h28" />
        }
      }
    </svg>
  `,
})
export class DishArtComponent {
  readonly name = input.required<DishArt>();
}
