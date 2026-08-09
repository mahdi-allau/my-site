import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';

/**
 * La convergenza dei tre ambiti in un progetto solo.
 *
 * La sezione in cui vive si intitola "Tre ambiti, un modo di ragionare":
 * questo diagramma lo mostra invece di lasciarlo scritto. Le tre linee si
 * disegnano una dopo l'altra, un puntino le percorre, e il nodo di destra
 * si riempie quando sono arrivate tutte.
 *
 * Le etichette sono HTML e non testo dentro l'SVG: così si traducono, si
 * ridimensionano col resto della pagina e restano leggibili sul telefono,
 * dove un testo dentro un SVG scalato diventa illeggibile.
 */
@Component({
  selector: 'app-craft-flow',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './craft-flow.html',
  styleUrl: './craft-flow.css',
})
export class CraftFlow {
  protected readonly i18n = inject(I18nService);
  protected readonly sources = [1, 2, 3];
}
