import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ContentService } from '../../core/content.service';
import { ContactMessage, Project } from '../../core/models';
import { Logo } from '../../shared/logo/logo';
import { ContentEditor } from '../content-editor/content-editor';
import { SettingsEditor } from '../settings-editor/settings-editor';
import { AnnouncementsEditor } from '../announcements-editor/announcements-editor';

type Tab = 'messages' | 'projects' | 'content' | 'settings' | 'announcements';

@Component({
  selector: 'app-dashboard',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    DatePipe,
    Logo,
    ContentEditor,
    SettingsEditor,
    AnnouncementsEditor,
  ],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly auth = inject(AuthService);
  private readonly content = inject(ContentService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly userEmail = computed(() => this.auth.user()?.email ?? '');

  protected readonly tab = signal<Tab>('messages');
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly saving = signal(false);

  protected readonly messages = signal<ContactMessage[]>([]);
  protected readonly projects = signal<Project[]>([]);

  /** id del progetto in modifica, `null` quando il form è chiuso. */
  protected readonly editingId = signal<string | null>(null);
  protected readonly formOpen = signal(false);

  protected readonly unreadCount = computed(
    () => this.messages().filter((message) => !message.handled).length,
  );

  protected readonly projectForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    slug: ['', Validators.required],
    category: [''],
    summary: [''],
    description: [''],
    technologies: [''],
    highlights: [''],
    year: [new Date().getFullYear()],
    sortOrder: [0],
    featured: [false],
    imageUrl: [''],
    repoUrl: [''],
    liveUrl: [''],
    credit: [''],
  });

  constructor() {
    void this.load();
  }

  // ------------------------------------------------------------------
  // Caricamento
  // ------------------------------------------------------------------

  protected async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');

    try {
      const [messages, projects] = await Promise.all([
        this.content.listMessages(),
        this.content.listProjectsForAdmin(),
      ]);
      this.messages.set(messages);
      this.projects.set(projects);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : String(err));
    } finally {
      this.loading.set(false);
    }
  }

  protected select(tab: Tab): void {
    this.tab.set(tab);
  }

  protected tabClass(tab: Tab): string {
    const base = 'rounded-full px-4 py-2 text-sm font-medium transition-colors';
    return this.tab() === tab
      ? `${base} bg-forest-800 text-sand-100`
      : `${base} text-muted hover:text-heading`;
  }

  // ------------------------------------------------------------------
  // Messaggi
  // ------------------------------------------------------------------

  protected async toggleHandled(message: ContactMessage): Promise<void> {
    const next = !message.handled;
    this.messages.update((list) =>
      list.map((item) => (item.id === message.id ? { ...item, handled: next } : item)),
    );

    try {
      await this.content.setMessageHandled(message.id, next);
    } catch (err) {
      // Ripristino lo stato precedente se la scrittura fallisce.
      this.messages.update((list) =>
        list.map((item) => (item.id === message.id ? { ...item, handled: !next } : item)),
      );
      this.error.set(err instanceof Error ? err.message : String(err));
    }
  }

  protected async removeMessage(message: ContactMessage): Promise<void> {
    if (!confirm(`Eliminare definitivamente il messaggio di ${message.name}?`)) {
      return;
    }

    try {
      await this.content.deleteMessage(message.id);
      this.messages.update((list) => list.filter((item) => item.id !== message.id));
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : String(err));
    }
  }

  // ------------------------------------------------------------------
  // Progetti
  // ------------------------------------------------------------------

  protected newProject(): void {
    this.editingId.set(null);
    this.projectForm.reset({
      title: '',
      slug: '',
      category: '',
      summary: '',
      description: '',
      technologies: '',
      highlights: '',
      year: new Date().getFullYear(),
      sortOrder: this.projects().length + 1,
      featured: false,
      imageUrl: '',
      repoUrl: '',
      liveUrl: '',
      credit: '',
    });
    this.formOpen.set(true);
  }

  protected editProject(project: Project): void {
    this.editingId.set(project.id);
    this.projectForm.setValue({
      title: project.title,
      slug: project.slug,
      category: project.category,
      summary: project.summary,
      description: project.description,
      technologies: project.technologies.join(', '),
      highlights: project.highlights.join('\n'),
      year: project.year ?? new Date().getFullYear(),
      sortOrder: project.sortOrder,
      featured: project.featured,
      imageUrl: project.imageUrl ?? '',
      repoUrl: project.repoUrl ?? '',
      liveUrl: project.liveUrl ?? '',
      credit: project.credit ?? '',
    });
    this.formOpen.set(true);
  }

  protected closeForm(): void {
    this.formOpen.set(false);
    this.editingId.set(null);
  }

  protected async saveProject(): Promise<void> {
    if (this.projectForm.invalid || this.saving()) {
      this.projectForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set('');
    const value = this.projectForm.getRawValue();

    try {
      await this.content.saveProject({
        id: this.editingId() ?? undefined,
        slug: value.slug.trim(),
        title: value.title.trim(),
        category: value.category.trim(),
        summary: value.summary.trim(),
        description: value.description.trim(),
        technologies: splitList(value.technologies, ','),
        highlights: splitList(value.highlights, '\n'),
        year: Number(value.year) || null,
        sortOrder: Number(value.sortOrder) || 0,
        featured: value.featured,
        imageUrl: value.imageUrl.trim() || null,
        repoUrl: value.repoUrl.trim() || null,
        liveUrl: value.liveUrl.trim() || null,
        credit: value.credit.trim() || null,
      });

      this.closeForm();
      await this.load();
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : String(err));
    } finally {
      this.saving.set(false);
    }
  }

  protected async removeProject(project: Project): Promise<void> {
    if (!confirm(`Eliminare il progetto "${project.title}"?`)) {
      return;
    }

    try {
      await this.content.deleteProject(project.id);
      this.projects.update((list) => list.filter((item) => item.id !== project.id));
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : String(err));
    }
  }

  /** Genera lo slug dal titolo quando l'utente non l'ha ancora scritto. */
  protected suggestSlug(): void {
    const slugControl = this.projectForm.controls.slug;
    if (slugControl.dirty && slugControl.value.trim().length > 0) {
      return;
    }
    slugControl.setValue(slugify(this.projectForm.controls.title.value));
  }

  // ------------------------------------------------------------------

  protected async signOut(): Promise<void> {
    await this.auth.signOut();
    await this.router.navigateByUrl('/admin/login');
  }
}

function splitList(raw: string, separator: string): string[] {
  return raw
    .split(separator)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // toglie gli accenti: "società" -> "societa"
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
