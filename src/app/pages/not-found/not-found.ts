import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MagneticDirective } from '../../shared/motion/magnetic.directive';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, MagneticDirective],
  template: `
    <section class="container-page flex min-h-[80vh] flex-col items-center justify-center py-24 text-center">
      <span class="eyebrow">Errore 404</span>
      <h1 class="display mt-7 text-[3rem] sm:text-7xl lg:text-8xl">
        <span class="word" style="--i: 0">Questa</span>
        <span class="word" style="--i: 1">pagina</span>
        <span class="word headline-accent" style="--i: 2">non esiste.</span>
      </h1>
      <p class="mt-8 max-w-md text-[1.0625rem] leading-relaxed text-body">
        Forse il link è vecchio o c’è un refuso nell’indirizzo. Da qui puoi tornare
        alla home o guardare i progetti.
      </p>
      <div class="mt-11 flex flex-wrap justify-center gap-4">
        <a routerLink="/" appMagnetic class="btn btn-primary">Torna alla home</a>
        <a routerLink="/projects" appMagnetic class="btn btn-ghost">Vedi i progetti</a>
      </div>
    </section>
  `,
})
export class NotFound {}
