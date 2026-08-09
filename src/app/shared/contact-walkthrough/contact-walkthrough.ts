import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';

/**
 * Guida animata: cosa succede dopo aver scritto.
 *
 * È una finta registrazione dello schermo, non un video: quattro schermate
 * che si alternano dentro una finestra stilizzata, con i passi che si
 * illuminano a lato. Un vero filmato peserebbe qualche megabyte, andrebbe
 * rigirato a ogni cambio di testo e non si tradurrebbe; qui sono qualche
 * riga di CSS che parlano le due lingue del sito.
 *
 * Tutto è temporizzato con un unico ciclo: ogni schermata dura `--dur` e
 * riceve un ritardo pari alla sua posizione. Nessun timer JavaScript da
 * mantenere allineato.
 */
@Component({
  selector: 'app-contact-walkthrough',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact-walkthrough.html',
  styleUrl: './contact-walkthrough.css',
})
export class ContactWalkthrough {
  protected readonly i18n = inject(I18nService);
  protected readonly steps = [1, 2, 3, 4];
}
