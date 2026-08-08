import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';

/**
 * Finestra di browser che monta da sola una pagina, in ciclo continuo.
 *
 * Tutti gli elementi condividono lo stesso periodo di 9 secondi e si
 * differenziano solo per il ritardo: così restano sincronizzati per sempre
 * senza un solo timer JavaScript. È decorativa, quindi `aria-hidden`: il
 * senso della sezione sta nel testo accanto.
 */
@Component({
  selector: 'app-site-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './site-preview.html',
  styleUrl: './site-preview.css',
})
export class SitePreview {
  protected readonly i18n = inject(I18nService);
}
