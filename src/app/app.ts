import { Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { Navbar } from './layout/navbar/navbar';
import { Footer } from './layout/footer/footer';
import { Ambience } from './layout/ambience/ambience';
import { I18nService } from './core/i18n/i18n.service';
import { SeoService } from './core/seo/seo.service';
import { SiteContentService } from './core/site-content.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, Ambience],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly router = inject(Router);
  protected readonly i18n = inject(I18nService);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  /**
   * Pagine che si presentano da sole, senza il guscio del portfolio:
   * l'area amministrativa ha una sua intestazione, e i siti dimostrativi
   * devono sembrare il sito di quel locale, non una pagina di questo sito.
   */
  protected readonly isBareLayout = computed(() => {
    const url = this.currentUrl();
    return url.startsWith('/admin') || url.startsWith('/demo');
  });

  constructor() {
    // Va agganciato dopo `currentUrl`, così il primo NavigationEnd trova
    // entrambi gli ascoltatori già in ascolto.
    inject(SeoService).init();

    // Testi riscritti e dati aziendali. Non si attende: la pagina parte
    // con i valori del codice e si aggiorna quando arrivano.
    void inject(SiteContentService).load();
  }
}
