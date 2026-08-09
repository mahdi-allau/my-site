import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';

/**
 * I quattro impegni, con il segno di spunta che si disegna uno dopo l'altro.
 *
 * Ha preso il posto dell'elenco di linguaggi e strumenti: quello invecchia
 * a ogni cambio di stack, e a un ristoratore non dice niente. Questi
 * impegni valgono qualunque tecnologia si usi.
 *
 * Nessuna promessa nuova: sono le stesse gia dichiarate nei prezzi e nelle
 * domande frequenti, raccolte in un punto solo.
 */
@Component({
  selector: 'app-promise-seals',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './promise-seals.html',
  styleUrl: './promise-seals.css',
})
export class PromiseSeals {
  protected readonly i18n = inject(I18nService);
  protected readonly seals = [1, 2, 3, 4];
}
