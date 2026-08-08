import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/content.service';
import { ServiceOffer } from '../../core/models';
import { ServiceIconComponent } from '../../shared/service-icon/service-icon';

@Component({
  selector: 'app-services',
  imports: [RouterLink, ServiceIconComponent],
  templateUrl: './services.html',
})
export class Services {
  private readonly content = inject(ContentService);

  protected readonly services = signal<ServiceOffer[]>([]);
  protected readonly loading = signal(true);

  protected readonly faq = [
    {
      question: 'Quanto costa un sito?',
      answer:
        'Dipende da quante pagine servono e da cosa deve fare il sito. Dopo una prima chiacchierata invio un preventivo scritto con voce per voce, così sai esattamente cosa stai comprando.',
    },
    {
      question: 'Posso aggiornare i contenuti da solo?',
      answer:
        'Sì, è il punto. Ogni progetto include un pannello di amministrazione riservato dove modificare testi, foto e — per i ristoranti — il menù, senza toccare il codice.',
    },
    {
      question: 'Vi occupate anche del dominio e dell’hosting?',
      answer:
        'Sì. Posso registrare il dominio, configurare la pubblicazione e le caselle email, e lasciare tutto intestato a te: gli accessi restano tuoi.',
    },
    {
      question: 'Quanto tempo serve?',
      answer:
        'Un sito vetrina ben fatto richiede in genere qualche settimana, una web application di più. I tempi precisi finiscono nel preventivo, non li scopri strada facendo.',
    },
  ];

  constructor() {
    void this.load();
  }

  private async load(): Promise<void> {
    this.services.set(await this.content.listServices());
    this.loading.set(false);
  }
}
