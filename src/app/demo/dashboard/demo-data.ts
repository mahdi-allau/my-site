/**
 * Dati simulati del cruscotto.
 *
 * Generati da un seme fisso invece che a caso: ricaricando la pagina i
 * numeri restano gli stessi. Un demo che cambia cifre a ogni visita
 * sembra rotto, e non si potrebbe nemmeno verificarlo automaticamente.
 *
 * L'andamento non è piatto: i fine settimana rendono di più, il lunedì è
 * chiuso, e c'è una crescita lenta di fondo. Serve perché i grafici
 * abbiano una forma leggibile, come quelli di un locale vero.
 */

export interface DayRecord {
  /** Mezzanotte del giorno, ora locale. */
  date: Date;
  revenue: number;
  covers: number;
  orders: number;
}

/** Generatore pseudo-casuale deterministico (mulberry32). */
function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Peso del giorno della settimana: 0 = domenica. Il lunedì è chiuso. */
const WEEKDAY_WEIGHT = [1.15, 0, 0.72, 0.78, 0.9, 1.25, 1.4];

/**
 * Genera gli ultimi `days` giorni fino a ieri incluso.
 * Il giorno di oggi resta fuori: un incasso a metà giornata falserebbe
 * il confronto con i periodi precedenti.
 */
export function generateDays(days: number, seed = 20260809): DayRecord[] {
  const random = seeded(seed);
  const out: DayRecord[] = [];

  const end = new Date();
  end.setHours(0, 0, 0, 0);
  end.setDate(end.getDate() - 1);

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(end);
    date.setDate(end.getDate() - i);

    const weight = WEEKDAY_WEIGHT[date.getDay()];
    if (weight === 0) {
      out.push({ date, revenue: 0, covers: 0, orders: 0 });
      continue;
    }

    // Crescita lenta lungo il periodo, più una variazione contenuta
    const growth = 1 + ((days - i) / days) * 0.18;
    const noise = 0.86 + random() * 0.28;

    const covers = Math.round(46 * weight * growth * noise);
    const averageTicket = 27 + random() * 9;

    out.push({
      date,
      covers,
      revenue: Math.round(covers * averageTicket),
      orders: Math.max(1, Math.round(covers / (1.9 + random() * 0.5))),
    });
  }

  return out;
}

export interface DishRow {
  name: string;
  nameEn: string;
  share: number;
}

/**
 * Classifica dei piatti. Le quote dipendono dal periodo scelto, così
 * cambiando filtro cambia anche questa tabella e non solo i numeri in alto.
 */
export function topDishes(periodDays: number): DishRow[] {
  const random = seeded(1000 + periodDays);
  const base = [
    { name: 'Casoncelli alla bergamasca', nameEn: 'Casoncelli, Bergamo style', weight: 100 },
    { name: 'Tagliatelle al ragù bianco', nameEn: 'Tagliatelle with white ragù', weight: 82 },
    { name: 'Guancia di manzo brasata', nameEn: 'Braised beef cheek', weight: 68 },
    { name: 'Polenta e funghi', nameEn: 'Polenta with mushrooms', weight: 54 },
    { name: 'Torta di rose', nameEn: 'Torta di rose', weight: 41 },
  ];

  const weighted = base.map((dish) => ({
    ...dish,
    weight: dish.weight * (0.85 + random() * 0.3),
  }));

  const total = weighted.reduce((sum, dish) => sum + dish.weight, 0);

  return weighted
    .map((dish) => ({
      name: dish.name,
      nameEn: dish.nameEn,
      share: dish.weight / total,
    }))
    .sort((a, b) => b.share - a.share);
}
