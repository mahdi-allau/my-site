import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SiteContentService } from '../../core/site-content.service';

@Component({
  selector: 'app-settings-editor',
  imports: [ReactiveFormsModule],
  templateUrl: './settings-editor.html',
  styleUrl: './settings-editor.css',
})
export class SettingsEditor {
  private readonly fb = inject(FormBuilder);
  private readonly site = inject(SiteContentService);

  protected readonly saving = signal(false);
  protected readonly error = signal('');
  protected readonly toast = signal('');

  protected readonly form = this.fb.nonNullable.group({
    companyName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    whatsapp: [''],
    street: [''],
    city: [''],
    postalCode: [''],
    region: [''],
    country: ['IT'],
    vat: [''],
    mapsUrl: [''],
  });

  constructor() {
    this.form.setValue({ ...this.site.settings() });
  }

  protected async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set('');

    try {
      await this.site.saveSettings(this.form.getRawValue());
      this.toast.set('Impostazioni salvate');
      setTimeout(() => this.toast.set(''), 2200);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : String(err));
    } finally {
      this.saving.set(false);
    }
  }

  protected invalid(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }
}
