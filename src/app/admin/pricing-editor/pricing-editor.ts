import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EMPTY_PACKAGE, PricingPackage, PricingService, formatPrice } from '../../core/pricing.service';

@Component({
  selector: 'app-pricing-editor',
  imports: [ReactiveFormsModule],
  templateUrl: './pricing-editor.html',
  styleUrl: './pricing-editor.css',
})
export class PricingEditor {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(PricingService);

  protected readonly rows = signal<PricingPackage[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly error = signal('');
  protected readonly toast = signal('');

  /** `null` chiuso, stringa vuota per un pacchetto nuovo. */
  protected readonly editing = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
    nameIt: ['', Validators.required],
    nameEn: [''],
    audienceIt: [''],
    audienceEn: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    durationIt: [''],
    durationEn: [''],
    // Una voce per riga: più comodo di una lista separata da virgole,
    // visto che le voci contengono virgole loro.
    featuresIt: [''],
    featuresEn: [''],
    discountPercent: [0, [Validators.min(0), Validators.max(99)]],
    discountLabelIt: [''],
    discountLabelEn: [''],
    highlight: [false],
    active: [true],
    sortOrder: [0],
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
      ...EMPTY_PACKAGE,
      featuresIt: '',
      featuresEn: '',
      sortOrder: this.rows().length + 1,
    });
    this.editing.set('');
  }

  protected edit(row: PricingPackage): void {
    this.form.setValue({
      slug: row.slug,
      nameIt: row.nameIt,
      nameEn: row.nameEn,
      audienceIt: row.audienceIt,
      audienceEn: row.audienceEn,
      price: row.price,
      durationIt: row.durationIt,
      durationEn: row.durationEn,
      featuresIt: row.featuresIt.join('\n'),
      featuresEn: row.featuresEn.join('\n'),
      discountPercent: row.discountPercent,
      discountLabelIt: row.discountLabelIt,
      discountLabelEn: row.discountLabelEn,
      highlight: row.highlight,
      active: row.active,
      sortOrder: row.sortOrder,
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
    const v = this.form.getRawValue();

    try {
      await this.service.save({
        id: this.editing() || undefined,
        slug: v.slug,
        nameIt: v.nameIt,
        nameEn: v.nameEn,
        audienceIt: v.audienceIt,
        audienceEn: v.audienceEn,
        price: Number(v.price),
        durationIt: v.durationIt,
        durationEn: v.durationEn,
        featuresIt: splitLines(v.featuresIt),
        featuresEn: splitLines(v.featuresEn),
        discountPercent: Number(v.discountPercent),
        discountLabelIt: v.discountLabelIt,
        discountLabelEn: v.discountLabelEn,
        highlight: v.highlight,
        active: v.active,
        sortOrder: Number(v.sortOrder),
      });

      this.close();
      await this.load();
      this.flash('Pacchetto salvato');
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : String(err));
    } finally {
      this.saving.set(false);
    }
  }

  protected async remove(row: PricingPackage): Promise<void> {
    if (!confirm(`Eliminare il pacchetto "${row.nameIt}"?`)) {
      return;
    }
    try {
      await this.service.remove(row.id);
      await this.load();
      this.flash('Pacchetto eliminato');
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : String(err));
    }
  }

  protected async toggleActive(row: PricingPackage): Promise<void> {
    try {
      await this.service.save({ ...row, active: !row.active });
      await this.load();
      this.flash(row.active ? 'Pacchetto nascosto' : 'Pacchetto in pagina');
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : String(err));
    }
  }

  // ------------------------------------------------------------------

  /** Anteprima del prezzo come lo vedrà il cliente, sconto compreso. */
  protected preview(row: PricingPackage): string {
    if (row.discountPercent > 0) {
      const off = row.price * (1 - row.discountPercent / 100);
      return `${formatPrice(off, 'it')} invece di ${formatPrice(row.price, 'it')}`;
    }
    return formatPrice(row.price, 'it');
  }

  /** Anteprima dal modulo aperto, per vedere l'effetto dello sconto mentre si scrive. */
  protected livePreview(): string {
    const price = Number(this.form.controls.price.value) || 0;
    const off = Number(this.form.controls.discountPercent.value) || 0;
    if (off <= 0) {
      return formatPrice(price, 'it');
    }
    return `${formatPrice(price * (1 - off / 100), 'it')} invece di ${formatPrice(price, 'it')}`;
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

function splitLines(raw: string): string[] {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}
