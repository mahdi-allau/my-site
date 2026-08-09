import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { I18nService } from '../../core/i18n/i18n.service';
import { DemoShell } from '../shell/demo-shell';

export type Status = 'nuovo' | 'corso' | 'servito' | 'pagato';

export interface Booking {
  id: number;
  customer: string;
  phone: string;
  covers: number;
  day: string;
  time: string;
  status: Status;
  note: string;
}

type SortKey = 'customer' | 'covers' | 'day' | 'status';

const STATUSES: Status[] = ['nuovo', 'corso', 'servito', 'pagato'];

/** Righe di partenza. Fisse, così il demo si presenta sempre uguale. */
function initialRows(): Booking[] {
  const base = [
    ['Famiglia Rota', '035 111 2201', 4, '19:30', 'nuovo', 'Tavolo vicino alla finestra'],
    ['Bianchi', '035 111 2202', 2, '20:00', 'corso', ''],
    ['Compleanno Locatelli', '035 111 2203', 12, '20:30', 'nuovo', 'Torta a fine cena'],
    ['Studio Perani', '035 111 2204', 6, '13:00', 'servito', 'Fattura richiesta'],
    ['Gruppo ciclisti', '035 111 2205', 8, '12:30', 'pagato', ''],
    ['Sig.ra Invernizzi', '035 111 2206', 3, '19:00', 'corso', 'Un celiaco'],
    ['Zanotti', '035 111 2207', 2, '21:00', 'nuovo', ''],
    ['Pranzo aziendale Meta', '035 111 2208', 14, '12:45', 'servito', 'Menù fisso'],
  ] as const;

  const today = new Date();
  return base.map((row, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + (i % 3));
    return {
      id: i + 1,
      customer: row[0],
      phone: row[1],
      covers: row[2],
      day: date.toISOString().slice(0, 10),
      time: row[3],
      status: row[4] as Status,
      note: row[5],
    };
  });
}

@Component({
  selector: 'app-demo-gestionale',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DemoShell, ReactiveFormsModule],
  templateUrl: './demo-gestionale.html',
  styleUrl: './demo-gestionale.css',
})
export class DemoGestionale {
  protected readonly i18n = inject(I18nService);
  private readonly fb = inject(FormBuilder);

  protected readonly statuses = STATUSES;

  protected readonly rows = signal<Booking[]>(initialRows());
  protected readonly query = signal('');
  protected readonly statusFilter = signal<Status | 'tutti'>('tutti');
  protected readonly sortKey = signal<SortKey>('day');
  protected readonly sortAsc = signal(true);

  /** `null` quando il pannello è chiuso, 0 per un inserimento nuovo. */
  protected readonly editing = signal<number | null>(null);
  protected readonly toast = signal('');

  private nextId = initialRows().length + 1;

  protected readonly form = this.fb.nonNullable.group({
    customer: ['', [Validators.required, Validators.minLength(2)]],
    phone: [''],
    covers: [2, [Validators.required, Validators.min(1), Validators.max(60)]],
    day: [new Date().toISOString().slice(0, 10), Validators.required],
    time: ['20:00', Validators.required],
    status: ['nuovo' as Status, Validators.required],
    note: [''],
  });

  // ------------------------------------------------------------------
  // Elenco filtrato e ordinato
  // ------------------------------------------------------------------

  protected readonly visible = computed(() => {
    const text = this.query().trim().toLowerCase();
    const status = this.statusFilter();
    const key = this.sortKey();
    const direction = this.sortAsc() ? 1 : -1;

    const filtered = this.rows().filter((row) => {
      const matchesText =
        !text ||
        row.customer.toLowerCase().includes(text) ||
        row.phone.toLowerCase().includes(text) ||
        row.note.toLowerCase().includes(text);
      const matchesStatus = status === 'tutti' || row.status === status;
      return matchesText && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      if (key === 'covers') {
        return (a.covers - b.covers) * direction;
      }
      if (key === 'status') {
        return (STATUSES.indexOf(a.status) - STATUSES.indexOf(b.status)) * direction;
      }
      if (key === 'day') {
        return (`${a.day}${a.time}` < `${b.day}${b.time}` ? -1 : 1) * direction;
      }
      return a.customer.localeCompare(b.customer) * direction;
    });
  });

  protected readonly counts = computed(() => {
    const rows = this.rows();
    return {
      total: rows.length,
      covers: rows.reduce((sum, r) => sum + r.covers, 0),
      open: rows.filter((r) => r.status === 'nuovo' || r.status === 'corso').length,
      shown: this.visible().length,
    };
  });

  // ------------------------------------------------------------------
  // Ordinamento
  // ------------------------------------------------------------------

  protected sort(key: SortKey): void {
    if (this.sortKey() === key) {
      this.sortAsc.update((v) => !v);
      return;
    }
    this.sortKey.set(key);
    this.sortAsc.set(true);
  }

  protected sortIcon(key: SortKey): string {
    if (this.sortKey() !== key) {
      return '';
    }
    return this.sortAsc() ? '↑' : '↓';
  }

  // ------------------------------------------------------------------
  // Inserimento e modifica
  // ------------------------------------------------------------------

  protected create(): void {
    this.form.reset({
      customer: '',
      phone: '',
      covers: 2,
      day: new Date().toISOString().slice(0, 10),
      time: '20:00',
      status: 'nuovo',
      note: '',
    });
    this.editing.set(0);
  }

  protected edit(row: Booking): void {
    this.form.setValue({
      customer: row.customer,
      phone: row.phone,
      covers: row.covers,
      day: row.day,
      time: row.time,
      status: row.status,
      note: row.note,
    });
    this.editing.set(row.id);
  }

  protected close(): void {
    this.editing.set(null);
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const id = this.editing();

    if (id === 0) {
      this.rows.update((rows) => [...rows, { id: this.nextId++, ...value }]);
      this.flash(this.i18n.t('demo.crm.added'));
    } else {
      this.rows.update((rows) => rows.map((r) => (r.id === id ? { ...r, ...value } : r)));
      this.flash(this.i18n.t('demo.crm.saved'));
    }

    this.editing.set(null);
  }

  protected remove(row: Booking): void {
    if (!confirm(this.i18n.t('demo.crm.confirmDelete').replace('{name}', row.customer))) {
      return;
    }
    this.rows.update((rows) => rows.filter((r) => r.id !== row.id));
    this.flash(this.i18n.t('demo.crm.deleted'));
  }

  /** Avanza lo stato al successivo: è il gesto più frequente in sala. */
  protected advance(row: Booking): void {
    const next = STATUSES[Math.min(STATUSES.indexOf(row.status) + 1, STATUSES.length - 1)];
    this.rows.update((rows) => rows.map((r) => (r.id === row.id ? { ...r, status: next } : r)));
  }

  protected reset(): void {
    this.rows.set(initialRows());
    this.nextId = initialRows().length + 1;
    this.query.set('');
    this.statusFilter.set('tutti');
    this.flash(this.i18n.t('demo.crm.reset'));
  }

  protected invalid(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  private flash(message: string): void {
    this.toast.set(message);
    setTimeout(() => this.toast.set(''), 2200);
  }

  // ------------------------------------------------------------------

  protected onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected setStatusFilter(value: Status | 'tutti'): void {
    this.statusFilter.set(value);
  }

  protected formatDay(day: string): string {
    const locale = this.i18n.lang() === 'en' ? 'en-GB' : 'it-IT';
    return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(
      new Date(day + 'T00:00:00'),
    );
  }
}
