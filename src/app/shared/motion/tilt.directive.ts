import {
  Directive,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  inject,
  input,
} from '@angular/core';

/**
 * Inclinazione 3D che segue il puntatore, più le due variabili CSS
 * `--px`/`--py` che alimentano l'alone della classe `.card-glow`.
 *
 * Gira interamente fuori da Angular e si aggiorna dentro un
 * requestAnimationFrame: nessun ciclo di change detection per ogni pixel
 * di movimento del mouse.
 */
@Directive({
  selector: '[appTilt]',
})
export class TiltDirective implements OnInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);

  /** Rotazione massima in gradi. */
  readonly tiltStrength = input(5);

  private frame = 0;
  private enabled = false;

  private readonly onMove = (event: PointerEvent): void => {
    if (this.frame) {
      cancelAnimationFrame(this.frame);
    }

    this.frame = requestAnimationFrame(() => {
      const element = this.host.nativeElement;
      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        return;
      }

      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const strength = this.tiltStrength();

      element.style.setProperty('--px', `${x * 100}%`);
      element.style.setProperty('--py', `${y * 100}%`);
      element.style.transform =
        `perspective(1100px) ` +
        `rotateX(${(0.5 - y) * strength}deg) ` +
        `rotateY(${(x - 0.5) * strength}deg) ` +
        `translateY(-4px)`;
    });
  };

  private readonly onLeave = (): void => {
    if (this.frame) {
      cancelAnimationFrame(this.frame);
      this.frame = 0;
    }
    this.host.nativeElement.style.transform = '';
  };

  ngOnInit(): void {
    // Niente inclinazione su touch (non c'è un puntatore che passa sopra)
    // né per chi ha chiesto meno movimento.
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!finePointer || reducedMotion) {
      return;
    }

    this.enabled = true;
    this.host.nativeElement.classList.add('card-glow');

    this.zone.runOutsideAngular(() => {
      const element = this.host.nativeElement;
      element.addEventListener('pointermove', this.onMove, { passive: true });
      element.addEventListener('pointerleave', this.onLeave, { passive: true });
    });
  }

  ngOnDestroy(): void {
    if (!this.enabled) {
      return;
    }

    if (this.frame) {
      cancelAnimationFrame(this.frame);
    }

    const element = this.host.nativeElement;
    element.removeEventListener('pointermove', this.onMove);
    element.removeEventListener('pointerleave', this.onLeave);
  }
}
