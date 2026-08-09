import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ServiceIcon } from '../../core/models';

/**
 * Mini-scena animata per ogni servizio, mostrata in cima alla scheda.
 *
 * Ognuna racconta la cosa che quel servizio fa davvero, non un'icona
 * generica: il layout che si adatta al telefono, il menù che cambia da
 * solo, le righe di un gestionale che si filtrano, il grafico che cresce.
 *
 * Dentro non c'è testo, solo forme: così le scene valgono in italiano e in
 * inglese senza tradurre niente, e restano leggibili anche piccole. Sono
 * decorative — quello che dicono è scritto nel titolo e nella descrizione
 * della scheda — quindi sono nascoste ai lettori di schermo.
 */
@Component({
  selector: 'app-service-motion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './service-motion.html',
  styleUrl: './service-motion.css',
})
export class ServiceMotion {
  readonly name = input.required<ServiceIcon>();
}
