import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/content.service';
import { Project, ServiceOffer } from '../../core/models';
import { I18nService } from '../../core/i18n/i18n.service';
import { accentWords } from '../../core/i18n/accent-words';
import { ProjectCard } from '../../shared/project-card/project-card';
import { ServiceIconComponent } from '../../shared/service-icon/service-icon';
import { SitePreview } from '../../shared/site-preview/site-preview';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { TiltDirective } from '../../shared/motion/tilt.directive';
import { MagneticDirective } from '../../shared/motion/magnetic.directive';
import { RotatingLine } from '../../shared/rotating-line/rotating-line';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    ProjectCard,
    ServiceIconComponent,
    SitePreview,
    RevealDirective,
    TiltDirective,
    MagneticDirective,
    RotatingLine,
  ],
  templateUrl: './home.html',
})
export class Home {
  private readonly content = inject(ContentService);
  protected readonly i18n = inject(I18nService);

  protected readonly projects = signal<Project[]>([]);
  protected readonly services = signal<ServiceOffer[]>([]);
  protected readonly loading = signal(true);

  /** Numerazione delle fasi e dei benefici: il testo sta nelle traduzioni. */
  protected readonly steps = [1, 2, 3, 4];

  /** Il titolo entra parola per parola, quindi va spezzato. */
  protected readonly headline = computed(() =>
    accentWords(this.i18n.t('home.hero.title'), this.i18n.t('home.hero.accent')),
  );

  protected readonly featured = computed(() => {
    const all = this.projects();
    const marked = all.filter((project) => project.featured);
    return (marked.length ? marked : all).slice(0, 3);
  });

  protected readonly topServices = computed(() => this.services().slice(0, 4));

  /** Voci della riga che scorre sotto l'hero. */
  protected readonly includes = computed(() =>
    [1, 2, 3, 4, 5, 6].map((n) => this.i18n.t(`home.includes.${n}`)),
  );

  constructor() {
    // Rileggendo `lang()` l'effetto si ripete al cambio lingua: i contenuti
    // che arrivano da Supabase vanno ricaricati nella lingua giusta.
    effect(() => {
      this.i18n.lang();
      void this.load();
    });
  }

  private async load(): Promise<void> {
    const [projects, services] = await Promise.all([
      this.content.listProjects(),
      this.content.listServices(),
    ]);

    this.projects.set(projects);
    this.services.set(services);
    this.loading.set(false);
  }
}
