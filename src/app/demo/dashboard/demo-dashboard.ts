import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';
import { DemoShell } from '../shell/demo-shell';
import { DayRecord, generateDays, topDishes } from './demo-data';

/** Il cruscotto copre al massimo 90 giorni; i filtri ne mostrano una fetta. */
const HISTORY = 90;

interface Kpi {
  labelKey: string;
  value: string;
  delta: number | null;
  hint?: string;
}

@Component({
  selector: 'app-demo-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DemoShell],
  templateUrl: './demo-dashboard.html',
  styleUrl: './demo-dashboard.css',
})
export class DemoDashboard {
  protected readonly i18n = inject(I18nService);

  /** Serie completa, generata una volta sola. */
  private readonly all = generateDays(HISTORY);

  protected readonly periods = [7, 30, 90] as const;
  protected readonly period = signal<number>(30);

  protected select(days: number): void {
    this.period.set(days);
  }

  // ------------------------------------------------------------------
  // Fette di periodo
  // ------------------------------------------------------------------

  private readonly current = computed(() => this.all.slice(-this.period()));

  /** Periodo precedente di pari lunghezza, per il confronto. */
  private readonly previous = computed(() => {
    const days = this.period();
    return this.all.slice(-days * 2, -days);
  });

  // ------------------------------------------------------------------
  // Indicatori
  // ------------------------------------------------------------------

  protected readonly kpis = computed<Kpi[]>(() => {
    const now = totals(this.current());
    const before = totals(this.previous());

    return [
      {
        labelKey: 'demo.dash.kpi.revenue',
        value: this.money(now.revenue),
        delta: change(now.revenue, before.revenue),
      },
      {
        labelKey: 'demo.dash.kpi.covers',
        value: this.number(now.covers),
        delta: change(now.covers, before.covers),
      },
      {
        labelKey: 'demo.dash.kpi.ticket',
        value: this.money(now.covers ? now.revenue / now.covers : 0, true),
        delta: change(
          now.covers ? now.revenue / now.covers : 0,
          before.covers ? before.revenue / before.covers : 0,
        ),
      },
      {
        labelKey: 'demo.dash.kpi.best',
        value: this.bestDay(),
        delta: null,
        hint: this.money(Math.max(...this.current().map((d) => d.revenue))),
      },
    ];
  });

  private bestDay(): string {
    const best = this.current().reduce((a, b) => (b.revenue > a.revenue ? b : a));
    return new Intl.DateTimeFormat(this.locale(), { day: 'numeric', month: 'short' }).format(
      best.date,
    );
  }

  // ------------------------------------------------------------------
  // Grafico dell'andamento
  // ------------------------------------------------------------------

  private readonly W = 720;
  private readonly H = 200;

  /** Punti del grafico, in coordinate del viewBox. */
  private readonly points = computed(() => {
    const days = this.current();
    const max = Math.max(...days.map((d) => d.revenue), 1);
    const step = days.length > 1 ? this.W / (days.length - 1) : 0;

    return days.map((day, i) => ({
      x: i * step,
      y: this.H - (day.revenue / max) * (this.H - 12) - 6,
      day,
    }));
  });

  protected readonly linePath = computed(() =>
    this.points()
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(' '),
  );

  protected readonly areaPath = computed(() => {
    const pts = this.points();
    if (!pts.length) {
      return '';
    }
    return `${this.linePath()} L${this.W},${this.H} L0,${this.H} Z`;
  });

  protected readonly axisLabels = computed(() => {
    const days = this.current();
    const fmt = new Intl.DateTimeFormat(this.locale(), { day: 'numeric', month: 'short' });
    const at = (i: number) => fmt.format(days[i].date);
    return [at(0), at(Math.floor(days.length / 2)), at(days.length - 1)];
  });

  // ------------------------------------------------------------------
  // Media per giorno della settimana
  // ------------------------------------------------------------------

  protected readonly weekdays = computed(() => {
    const fmt = new Intl.DateTimeFormat(this.locale(), { weekday: 'short' });
    const sums = new Map<number, { total: number; count: number }>();

    for (const day of this.current()) {
      const key = day.date.getDay();
      const entry = sums.get(key) ?? { total: 0, count: 0 };
      entry.total += day.revenue;
      entry.count += 1;
      sums.set(key, entry);
    }

    // Lunedì -> domenica, come si legge un calendario in Italia
    const order = [1, 2, 3, 4, 5, 6, 0];
    const rows = order.map((key) => {
      const entry = sums.get(key) ?? { total: 0, count: 0 };
      const average = entry.count ? entry.total / entry.count : 0;
      const sample = new Date(2026, 5, 1 + ((key + 6) % 7));
      return { label: fmt.format(sample), average, closed: average === 0 };
    });

    const max = Math.max(...rows.map((r) => r.average), 1);
    return rows.map((row) => ({ ...row, height: (row.average / max) * 100 }));
  });

  // ------------------------------------------------------------------
  // Classifica dei piatti
  // ------------------------------------------------------------------

  protected readonly dishes = computed(() => {
    const english = this.i18n.lang() === 'en';
    return topDishes(this.period()).map((dish) => ({
      name: english ? dish.nameEn : dish.name,
      share: dish.share,
      percent: `${(dish.share * 100).toFixed(1)}%`,
    }));
  });

  // ------------------------------------------------------------------
  // Formattazione
  // ------------------------------------------------------------------

  private locale(): string {
    return this.i18n.lang() === 'en' ? 'en-GB' : 'it-IT';
  }

  protected money(value: number, decimals = false): string {
    return new Intl.NumberFormat(this.locale(), {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: decimals ? 2 : 0,
      maximumFractionDigits: decimals ? 2 : 0,
    }).format(value);
  }

  protected number(value: number): string {
    return new Intl.NumberFormat(this.locale()).format(Math.round(value));
  }

  protected deltaLabel(delta: number): string {
    const sign = delta > 0 ? '+' : '';
    return `${sign}${delta.toFixed(1)}%`;
  }
}

function totals(days: DayRecord[]): { revenue: number; covers: number } {
  return days.reduce(
    (acc, day) => ({ revenue: acc.revenue + day.revenue, covers: acc.covers + day.covers }),
    { revenue: 0, covers: 0 },
  );
}

/** Variazione percentuale, `null` quando non c'è un termine di paragone. */
function change(now: number, before: number): number | null {
  if (!before) {
    return null;
  }
  return ((now - before) / before) * 100;
}
