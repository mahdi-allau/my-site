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
 * Attrazione magnetica: l'elemento si sposta leggermente verso il puntatore
 * quando questo entra nel suo raggio d'azione. Usato sui pulsanti principali.
 *
 * L'ascolto avviene sulla finestra, non sull'elemento, altrimenti l'effetto
 * partirebbe solo una volta arrivati sopra al bottone — e si perderebbe
 * proprio l'attrazione.
 */
@Directive({
  selector: '[appMagnetic]',
})
export class MagneticDirective implements OnInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);

  /** Distanza, in pixel oltre i bordi, entro cui l'effetto si attiva. */
  readonly magneticRadius = input(90);

  /** Quanto l'elemento segue il puntatore, da 0 a 1. */
  readonly magneticPull = input(0.32);

  private frame = 0;
  private enabled = false;

  private readonly onMove = (event: PointerEvent): void => {
    if (this.frame) {
      cancelAnimationFrame(this.frame);
    }

    this.frame = requestAnimationFrame(() => {
      const element = this.host.nativeElement;
      const rect = element.getBoundingClientRect();
      if (!rect.width) {
        return;
      }

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;

      const radius = this.magneticRadius();
      const withinReach =
        Math.abs(dx) < rect.width / 2 + radius && Math.abs(dy) < rect.height / 2 + radius;

      if (!withinReach) {
        element.style.transform = '';
        return;
      }

      const pull = this.magneticPull();
      element.style.transform = `translate3d(${dx * pull}px, ${dy * pull}px, 0)`;
    });
  };

  ngOnInit(): void {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!finePointer || reducedMotion) {
      return;
    }

    this.enabled = true;
    this.zone.runOutsideAngular(() => {
      window.addEventListener('pointermove', this.onMove, { passive: true });
    });
  }

  ngOnDestroy(): void {
    if (!this.enabled) {
      return;
    }

    if (this.frame) {
      cancelAnimationFrame(this.frame);
    }

    window.removeEventListener('pointermove', this.onMove);
    this.host.nativeElement.style.transform = '';
  }
}
