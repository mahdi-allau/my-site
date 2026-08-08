import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/content.service';
import { Project, ServiceOffer } from '../../core/models';
import { SKILL_GROUPS, WORK_PROCESS } from '../../core/seed-content';
import { ProjectCard } from '../../shared/project-card/project-card';
import { ServiceIconComponent } from '../../shared/service-icon/service-icon';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProjectCard, ServiceIconComponent],
  templateUrl: './home.html',
})
export class Home {
  private readonly content = inject(ContentService);

  protected readonly projects = signal<Project[]>([]);
  protected readonly services = signal<ServiceOffer[]>([]);
  protected readonly loading = signal(true);

  protected readonly process = WORK_PROCESS;
  protected readonly skillGroups = SKILL_GROUPS;

  /** In home mostro solo i progetti marcati come "in evidenza". */
  protected readonly featured = computed(() => {
    const all = this.projects();
    const marked = all.filter((project) => project.featured);
    return (marked.length ? marked : all).slice(0, 3);
  });

  protected readonly topServices = computed(() => this.services().slice(0, 4));

  constructor() {
    void this.load();
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
