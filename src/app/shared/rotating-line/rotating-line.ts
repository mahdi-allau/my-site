import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Riga con una voce che cambia da sola, in ciclo.
 *
 * Interamente in CSS: le voci sono impilate una sopra l'altra e ognuna
 * riceve un ritardo pari alla sua posizione nel giro. Nessun timer, nessun
 * ciclo di change detection ogni due secondi, e l'animazione non si
 * disallinea se la scheda passa in secondo piano.
 *
 * La parte animata è nascosta ai lettori di schermo: un testo che cambia
 * da solo verrebbe riletto in continuazione. Al suo posto leggono l'elenco
 * completo, statico.
 */
@Component({
  selector: 'app-rotating-line',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="text-[0.6875rem] uppercase tracking-[0.22em] text-muted">{{ prefix() }}</p>

    <div class="rot" aria-hidden="true" [style.--n]="items().length">
      @for (item of items(); track item; let i = $index) {
        <span class="rot-item" [style.--i]="i">{{ item }}</span>
      }
    </div>

    <span class="sr-only">{{ prefix() }}: {{ items().join(', ') }}.</span>
  `,
  styles: `
    :host {
      display: block;
    }

    .rot {
      position: relative;
      margin-top: 0.6rem;
      /* Altezza fissa: le voci sono fuori flusso, senza questa il blocco
         collasserebbe e la pagina sotto ballerebbe a ogni cambio. */
      min-height: 2.6rem;
    }

    .rot-item {
      position: absolute;
      inset: 0 auto auto 0;
      font-family: var(--font-display);
      font-size: clamp(1.5rem, 3.4vw, 2.1rem);
      line-height: 1.2;
      color: var(--accent);
      white-space: nowrap;
      opacity: 0;
      animation: rot-cycle calc(var(--n) * 2.6s) linear infinite;
      animation-delay: calc(var(--i) * 2.6s);
      will-change: opacity, transform;
    }

    /* Ogni voce occupa una fetta del giro: entra, resta, esce. */
    @keyframes rot-cycle {
      0% {
        opacity: 0;
        transform: translateY(0.45em);
        filter: blur(7px);
      }
      3%,
      13% {
        opacity: 1;
        transform: none;
        filter: blur(0);
      }
      17%,
      100% {
        opacity: 0;
        transform: translateY(-0.45em);
        filter: blur(7px);
      }
    }

    /* Filo dorato che scorre sotto, a segnare il ritmo del ciclo */
    .rot::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: -0.5rem;
      height: 1px;
      width: 5.5rem;
      background: linear-gradient(90deg, var(--accent), transparent);
      animation: rot-rule calc(var(--n) * 2.6s) linear infinite;
    }

    @keyframes rot-rule {
      0%,
      100% {
        transform: scaleX(0.35);
        opacity: 0.5;
      }
      50% {
        transform: scaleX(1);
        opacity: 1;
      }
    }

    .rot::after {
      transform-origin: left;
    }

    /* Senza movimento resta la prima voce, ferma e leggibile. */
    @media (prefers-reduced-motion: reduce) {
      .rot-item {
        animation: none;
        opacity: 0;
      }

      .rot-item:first-child {
        opacity: 1;
      }

      .rot::after {
        animation: none;
        transform: scaleX(1);
      }
    }
  `,
})
export class RotatingLine {
  readonly prefix = input.required<string>();
  readonly items = input.required<string[]>();
}
