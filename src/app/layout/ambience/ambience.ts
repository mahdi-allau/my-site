import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Atmosfera di fondo, fissa dietro a tutto il sito.
 *
 * Sul beige l'obiettivo è opposto a quello di un tema scuro: non aggiungere
 * luce, ma togliere la piattezza dello schermo. La grana lavora in
 * `multiply`, così si comporta come la fibra di una carta stampata; sopra
 * scorrono due velature verdi appena percettibili.
 */
@Component({
  selector: 'app-ambience',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ambience" aria-hidden="true">
      <div class="wash aurora-a"></div>
      <div class="wash wash-b aurora-b"></div>
      <div class="rules"></div>
      <div class="grain"></div>
    </div>
  `,
  styles: `
    .ambience {
      position: fixed;
      inset: 0;
      z-index: -1;
      overflow: hidden;
      pointer-events: none;
      background: #f4eee1;
    }

    .wash {
      position: absolute;
      top: -25vh;
      left: -16vw;
      width: 66vw;
      height: 66vw;
      max-width: 980px;
      max-height: 980px;
      border-radius: 9999px;
      filter: blur(130px);
      background: radial-gradient(
        circle at 50% 50%,
        rgba(44, 107, 79, 0.14),
        rgba(44, 107, 79, 0.05) 46%,
        transparent 70%
      );
      will-change: transform;
    }

    .wash-b {
      top: auto;
      left: auto;
      right: -20vw;
      bottom: -28vh;
      background: radial-gradient(
        circle at 50% 50%,
        rgba(184, 146, 78, 0.13),
        rgba(184, 146, 78, 0.04) 48%,
        transparent 72%
      );
    }

    /* Righe orizzontali finissime, come la rigatura di una carta da lettere */
    .rules {
      position: absolute;
      inset: 0;
      background-image: repeating-linear-gradient(
        to bottom,
        rgba(16, 31, 24, 0.032) 0px,
        rgba(16, 31, 24, 0.032) 1px,
        transparent 1px,
        transparent 34px
      );
      mask-image: radial-gradient(ellipse 92% 58% at 50% 0%, #000 30%, transparent 76%);
      -webkit-mask-image: radial-gradient(ellipse 92% 58% at 50% 0%, #000 30%, transparent 76%);
    }

    /* Fibra della carta */
    .grain {
      position: absolute;
      inset: -50%;
      opacity: 0.5;
      mix-blend-mode: multiply;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.42'/%3E%3C/svg%3E");
      animation: grain-shift 7s steps(6) infinite;
    }

    @keyframes grain-shift {
      0%   { transform: translate(0, 0); }
      20%  { transform: translate(-3%, 2%); }
      40%  { transform: translate(2%, -3%); }
      60%  { transform: translate(-2%, -2%); }
      80%  { transform: translate(3%, 1%); }
      100% { transform: translate(0, 0); }
    }

    @media (prefers-reduced-motion: reduce) {
      .grain { animation: none; }
    }
  `,
})
export class Ambience {}
