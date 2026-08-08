import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { DishArt, DishArtComponent } from './dish-art';

interface Dish {
  name: string;
  description: string;
  price: string;
}

interface MenuSection {
  title: string;
  dishes: Dish[];
}

/**
 * Sito dimostrativo di un ristorante.
 *
 * Serve a colmare il buco più grosso del portfolio: la home promette siti
 * per ristoranti, ma i progetti mostrati erano una dashboard, una centralina
 * IoT e un gestionale. Chi deve spendere qualche migliaio di euro vuole
 * vedere una cosa sola, cioè un sito come quello che vorrebbe, funzionante.
 *
 * Il locale è inventato e la cosa è dichiarata in cima alla pagina, sempre
 * visibile. I contenuti restano in italiano anche con il sito in inglese:
 * un'osteria di paese il sito ce l'ha in italiano, e fingere il contrario
 * renderebbe il demo meno credibile.
 *
 * L'identità visiva è volutamente diversa da quella del portfolio — vino e
 * crema invece di verde e beige — perché un demo che somiglia al sito di chi
 * l'ha fatto non dimostra di saper vestire il marchio di un altro.
 */
@Component({
  selector: 'app-trattoria',
  imports: [RouterLink, RevealDirective, DishArtComponent],
  templateUrl: './trattoria.html',
  styleUrl: './trattoria.css',
})
export class Trattoria {
  protected readonly i18n = inject(I18nService);

  protected readonly menuOpen = signal(false);
  protected readonly booked = signal(false);

  protected readonly navLinks = [
    { label: 'La storia', href: '#storia' },
    { label: 'Il menù', href: '#menu' },
    { label: 'Le sale', href: '#sale' },
    { label: 'Dove siamo', href: '#dove' },
  ];

  protected readonly menu: MenuSection[] = [
    {
      title: 'Antipasti',
      dishes: [
        {
          name: 'Tagliere del Tiglio',
          description: 'Salumi e formaggi dei produttori della valle, mostarda di stagione',
          price: '14',
        },
        {
          name: 'Polenta e funghi',
          description: 'Polenta taragna, porcini trifolati, burro di malga',
          price: '11',
        },
        {
          name: 'Battuta di manzo',
          description: 'Coltello, olio nuovo, scaglie di grana e nocciole tostate',
          price: '16',
        },
      ],
    },
    {
      title: 'Primi',
      dishes: [
        {
          name: 'Casoncelli alla bergamasca',
          description: 'Tirati a mano ogni mattina, burro fuso, pancetta e salvia',
          price: '13',
        },
        {
          name: 'Tagliatelle al ragù bianco',
          description: 'Ragù di vitello cotto otto ore, timo, pepe lungo',
          price: '14',
        },
        {
          name: 'Risotto allo Scalvino',
          description: 'Formaggio d’alpeggio, riduzione di Valcalepio, mandorle',
          price: '15',
        },
      ],
    },
    {
      title: 'Secondi',
      dishes: [
        {
          name: 'Coniglio alle erbe',
          description: 'Cotto in casseruola con rosmarino e vino bianco, patate al forno',
          price: '19',
        },
        {
          name: 'Guancia di manzo brasata',
          description: 'Brasata lentamente nel rosso, purè di patate della Val Seriana',
          price: '21',
        },
        {
          name: 'Trota della valle',
          description: 'In crosta di erbe, verdure dell’orto, salsa al burro acido',
          price: '18',
        },
      ],
    },
    {
      title: 'Dolci',
      dishes: [
        {
          name: 'Torta di rose',
          description: 'La ricetta della nonna, servita tiepida con crema al mascarpone',
          price: '7',
        },
        {
          name: 'Sbrisolona e zabaione',
          description: 'Alle mandorle, con zabaione al Moscato',
          price: '8',
        },
      ],
    },
  ];

  protected readonly gallery: { art: DishArt; caption: string }[] = [
    { art: 'pasta', caption: 'La pasta, tirata a mano ogni mattina' },
    { art: 'wine', caption: 'Ottanta etichette, quasi tutte del territorio' },
    { art: 'bread', caption: 'Il pane esce dal forno alle sette' },
    { art: 'oven', caption: 'Il forno a legna del 1908, ancora acceso' },
    { art: 'fish', caption: 'La trota arriva dai vivai della valle' },
    { art: 'herbs', caption: 'Le erbe vengono dall’orto dietro la cucina' },
  ];

  protected readonly hours = [
    { days: 'Martedì — Giovedì', time: '12:00 — 14:30 · 19:00 — 22:30' },
    { days: 'Venerdì — Sabato', time: '12:00 — 14:30 · 19:00 — 23:30' },
    { days: 'Domenica', time: '12:00 — 15:00' },
    { days: 'Lunedì', time: 'Giorno di riposo' },
  ];

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  /** Il modulo non invia nulla: è una dimostrazione, non un locale vero. */
  protected fakeSubmit(event: Event): void {
    event.preventDefault();
    this.booked.set(true);
  }
}
