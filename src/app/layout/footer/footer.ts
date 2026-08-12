import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Logo } from '../../shared/logo/logo';
import { I18nService } from '../../core/i18n/i18n.service';
import { SiteContentService } from '../../core/site-content.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, Logo],
  templateUrl: './footer.html',
})
export class Footer {
  protected readonly i18n = inject(I18nService);
  private readonly site = inject(SiteContentService);

  protected readonly year = new Date().getFullYear();

  /**
   * Contatti e nome presi dalle impostazioni salvate nell'area riservata.
   *
   * Prima arrivavano da `environment`, cioè da una costante fissata al
   * momento della build: cambiare l'email nell'admin non aveva alcun
   * effetto sul sito, perché quel valore era già cotto dentro il pacchetto.
   */
  protected readonly email = computed(() => this.site.settings().email);
  protected readonly companyName = computed(() => this.site.settings().companyName);
  protected readonly addressLine = this.site.addressLine;
  /** Al posto della riga sugli strumenti usati: se c'è, la partita IVA. */
  protected readonly vat = computed(() => this.site.settings().vat.trim());

  protected readonly siteLinks = [
    { key: 'nav.home', path: '/' },
    { key: 'nav.about', path: '/about' },
    { key: 'nav.projects', path: '/projects' },
    { key: 'nav.services', path: '/services' },
    { key: 'nav.contact', path: '/contact' },
  ];
}
