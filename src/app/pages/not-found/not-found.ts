import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <section class="container-page flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <span class="eyebrow">Errore 404</span>
      <h1 class="display mt-5 text-6xl sm:text-7xl">Questa pagina non esiste.</h1>
      <p class="mt-6 max-w-md text-[1.0625rem] leading-relaxed text-muted">
        Forse il link è vecchio o c’è un refuso nell’indirizzo. Da qui puoi tornare
        alla home o guardare i progetti.
      </p>
      <div class="mt-10 flex flex-wrap justify-center gap-3">
        <a routerLink="/" class="btn btn-primary">Torna alla home</a>
        <a routerLink="/projects" class="btn btn-ghost">Vedi i progetti</a>
      </div>
    </section>
  `,
})
export class NotFound {}
