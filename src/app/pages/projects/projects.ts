import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/content.service';
import { Project } from '../../core/models';
import { ProjectCard } from '../../shared/project-card/project-card';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { TiltDirective } from '../../shared/motion/tilt.directive';
import { MagneticDirective } from '../../shared/motion/magnetic.directive';

const ALL = 'Tutti';

@Component({
  selector: 'app-projects',
  imports: [RouterLink, ProjectCard, RevealDirective, TiltDirective, MagneticDirective],
  templateUrl: './projects.html',
})
export class Projects {
  private readonly content = inject(ContentService);

  protected readonly projects = signal<Project[]>([]);
  protected readonly loading = signal(true);
  protected readonly activeCategory = signal(ALL);
  protected readonly allLabel = ALL;

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
    void this.load();
  }

  protected select(category: string): void {
    this.activeCategory.set(category);
  }

  protected chipClass(category: string): string {
    const base = 'chip chip-selectable cursor-pointer';
    return this.activeCategory() === category ? `${base} chip-active` : base;
  }

  private async load(): Promise<void> {
    this.projects.set(await this.content.listProjects());
    this.loading.set(false);
  }
}
