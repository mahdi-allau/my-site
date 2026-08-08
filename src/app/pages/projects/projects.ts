import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/content.service';
import { Project } from '../../core/models';
import { I18nService } from '../../core/i18n/i18n.service';
import { ProjectCard } from '../../shared/project-card/project-card';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { TiltDirective } from '../../shared/motion/tilt.directive';
import { MagneticDirective } from '../../shared/motion/magnetic.directive';

/** Sentinella del filtro "tutte le categorie": non è una categoria reale. */
const ALL = '__all__';

@Component({
  selector: 'app-projects',
  imports: [RouterLink, ProjectCard, RevealDirective, TiltDirective, MagneticDirective],
  templateUrl: './projects.html',
})
export class Projects {
  private readonly content = inject(ContentService);
  protected readonly i18n = inject(I18nService);

  protected readonly projects = signal<Project[]>([]);
  protected readonly loading = signal(true);
  protected readonly activeCategory = signal(ALL);
  protected readonly allValue = ALL;

  protected readonly categories = computed(() => {
    const found = new Set(this.projects().map((project) => project.category).filter(Boolean));
    return [ALL, ...[...found].sort()];
  });

  protected readonly visible = computed(() => {
    const category = this.activeCategory();
    if (category === ALL) {
      return this.projects();
    }
    return this.projects().filter((project) => project.category === category);
  });

  constructor() {
    effect(() => {
      this.i18n.lang();
      // Le categorie sono tradotte: un filtro attivo non varrebbe più.
      this.activeCategory.set(ALL);
      void this.load();
    });
  }

  protected label(category: string): string {
    return category === ALL ? this.i18n.t('projects.filterAll') : category;
  }

  protected select(category: string): void {
    this.activeCategory.set(category);
  }

  protected chipClass(category: string): string {
    const base = 'chip chip-selectable';
    return this.activeCategory() === category ? `${base} chip-active` : base;
  }

  private async load(): Promise<void> {
    this.projects.set(await this.content.listProjects());
    this.loading.set(false);
  }
}
