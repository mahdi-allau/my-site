import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Announcement,
  AnnouncementsService,
  withinWindow,
} from '../../core/announcements.service';

@Component({
  selector: 'app-announcements-editor',
  imports: [ReactiveFormsModule],
  templateUrl: './announcements-editor.html',
  styleUrl: './announcements-editor.css',
})
export class AnnouncementsEditor {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(AnnouncementsService);

  protected readonly rows = signal<Announcement[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly error = signal('');
  protected readonly toast = signal('');

  /** `null` chiuso, stringa vuota per un annuncio nuovo. */
  protected readonly editing = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    messageIt: ['', [Validators.required, Validators.minLength(4)]],
    messageEn: [''],
    linkUrl: [''],
    linkLabelIt: [''],
    linkLabelEn: [''],
    kind: ['promo' as 'info' | 'promo'],
    active: [false],
    startsAt: [''],
    endsAt: [''],
  });

  constructor() {
    void this.load();
  }

  protected async load(): Promise<void> {
    this.loading.set(true);
    try {
      this.rows.set(await this.service.list());
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : String(err));
    } finally {
      this.loading.set(false);
    }
  }

  // ------------------------------------------------------------------

  protected create(): void {
    this.form.reset({
      messageIt: '',
      messageEn: '',
      linkUrl: '',
      linkLabelIt: '',
      linkLabelEn: '',
      kind: 'promo',
      active: false,
      startsAt: '',
      endsAt: '',
    });
    this.editing.set('');
  }

  protected edit(row: Announcement): void {
    this.form.setValue({
      messageIt: row.messageIt,
      messageEn: row.messageEn,
      linkUrl: row.linkUrl,
      linkLabelIt: row.linkLabelIt,
      linkLabelEn: row.linkLabelEn,
      kind: row.kind,
      active: row.active,
      startsAt: toInput(row.startsAt),
      endsAt: toInput(row.endsAt),
    });
    this.editing.set(row.id);
  }

  protected close(): void {
    this.editing.set(null);
  }

  protected async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set('');
    const value = this.form.getRawValue();
    const id = this.editing() || undefined;

    try {
      await this.service.save({
        id,
        ...value,
        startsAt: value.startsAt ? new Date(value.startsAt).toISOString() : null,
        endsAt: value.endsAt ? new Date(value.endsAt).toISOString() : null,
      });

      this.close();
      await this.load();
      this.flash('Annuncio salvato');
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : String(err));
    } finally {
      this.saving.set(false);
    }
  }

  protected async remove(row: Announcement): Promise<void> {
    if (!confirm('Eliminare questo annuncio?')) {
      return;
    }
    try {
      await this.service.remove(row.id);
      await this.load();
      this.flash('Annuncio eliminato');
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : String(err));
    }
  }

  protected async publish(row: Announcement): Promise<void> {
    try {
      await this.service.activateOnly(row.id);
      await this.load();
      this.flash('Annuncio pubblicato');
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : String(err));
    }
  }

  protected async unpublish(row: Announcement): Promise<void> {
    try {
      await this.service.save({ ...row, active: false });
      await this.load();
      this.flash('Annuncio ritirato');
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : String(err));
    }
  }

  // ------------------------------------------------------------------

  /**
   * Stato leggibile: "attivo" non basta, perché un annuncio acceso ma
   * fuori periodo il pubblico non lo vede e l'equivoco costerebbe caro.
   */
  protected state(row: Announcement): { label: string; kind: string } {
    if (!row.active) {
      return { label: 'Bozza', kind: 'draft' };
    }
    if (!withinWindow(row)) {
      const future = row.startsAt && new Date(row.startsAt).getTime() > Date.now();
      return { label: future ? 'Programmato' : 'Scaduto', kind: 'scheduled' };
    }
    return { label: 'In pagina', kind: 'live' };
  }

  protected period(row: Announcement): string {
    const fmt = (value: string | null) =>
      value ? new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short' }).format(new Date(value)) : null;
    const from = fmt(row.startsAt);
    const to = fmt(row.endsAt);
    if (!from && !to) return 'sempre';
    if (from && to) return `${from} → ${to}`;
    return from ? `da ${from}` : `fino al ${to}`;
  }

  protected invalid(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  private flash(message: string): void {
    this.toast.set(message);
    setTimeout(() => this.toast.set(''), 2200);
  }
}

/** ISO -> valore per `datetime-local`, che vuole l'ora locale senza fuso. */
function toInput(iso: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
