import {
  Directive,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  inject,
  input,
} from '@angular/core';

export type RevealMode = 'up' | 'left' | 'right' | 'scale';

/**
 * Fa comparire l'elemento quando entra nel viewport.
 *
 * Lo stato di partenza è definito in `styles.css` sull'attributo
 * `[data-reveal]`: qui ci limitiamo ad aggiungere `is-visible` al momento
 * giusto. L'osservatore si disconnette dopo il primo passaggio, così
 * scorrendo all'indietro gli elementi non si rianimano di continuo.
 */
@Directive({
  selector: '[appReveal]',
})
export class RevealDirective implements OnInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);

  /** Direzione di ingresso. Il valore vuoto equivale a `up`. */
  readonly appReveal = input<RevealMode | ''>('');

  /** Ritardo in millisecondi, per creare una sequenza fra elementi vicini. */
  readonly revealDelay = input(0);

  private observer?: IntersectionObserver;
  private safetyNet?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    const element = this.host.nativeElement;
    element.setAttribute('data-reveal', this.appReveal() || 'up');

    const delay = this.revealDelay();
    if (delay > 0) {
      element.style.setProperty('--reveal-delay', `${delay}ms`);
    }

    // Senza IntersectionObserver mostriamo tutto subito: meglio un sito
    // statico di un sito invisibile.
    if (typeof IntersectionObserver === 'undefined') {
      element.classList.add('is-visible');
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) {
              continue;
            }
            this.show();
          }
        },
        // Si attiva poco prima che l'elemento tocchi il bordo inferiore.
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
      );

      this.observer.observe(element);

      // Rete di sicurezza: un contenuto invisibile è un guasto, non un
      // effetto. Se per qualsiasi motivo l'osservatore non è ancora
      // scattato — scheda in secondo piano, dispositivo lento, elemento
      // dentro un contenitore che non scorre — lo mostriamo comunque.
      this.safetyNet = setTimeout(() => this.show(), 2600);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    clearTimeout(this.safetyNet);
  }

  private show(): void {
    this.host.nativeElement.classList.add('is-visible');
    this.observer?.disconnect();
    clearTimeout(this.safetyNet);
  }
}
