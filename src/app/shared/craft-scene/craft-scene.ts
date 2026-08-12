import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';

/**
 * Scena animata: si scrive una riga, e quella riga diventa una parte del
 * sito. Poi la si rifinisce.
 *
 * Ha preso il posto della scheda "In sintesi", che elencava lo stack e il
 * nome del fondatore: due cose che al cliente non servono e che non
 * vogliamo dichiarare. Qui si mostra il modo di lavorare senza nominare
 * un solo strumento.
 *
 * Il codice a sinistra è finto ma non casuale: sono forme, non parole,
 * così la scena vale in italiano e in inglese e non invecchia con le
 * tecnologie.
 */
@Component({
  selector: 'app-craft-scene',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './craft-scene.html',
  styleUrl: './craft-scene.css',
})
export class CraftScene {
  protected readonly i18n = inject(I18nService);

  /** Righe di "codice": la larghezza dei segmenti dà il ritmo. */
  protected readonly righe = [
    [22, 46],
    [34, 30, 18],
    [16, 52],
    [40, 24],
    [26, 38, 14],
  ];
}
