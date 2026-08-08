/** Modelli di dominio condivisi. I nomi sono in camelCase anche quando
 *  le colonne su Postgres sono in snake_case: la conversione avviene nei
 *  mapper di `content.service.ts`. */

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  technologies: string[];
  highlights: string[];
  imageUrl: string | null;
  repoUrl: string | null;
  liveUrl: string | null;
  year: number | null;
  featured: boolean;
  sortOrder: number;
}

export interface ServiceOffer {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  icon: ServiceIcon;
  sortOrder: number;
}

export type ServiceIcon = 'globe' | 'restaurant' | 'app' | 'chart' | 'spark';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company: string | null;
  budget: string | null;
  message: string;
  handled: boolean;
  createdAt: string;
}

export interface ContactDraft {
  name: string;
  email: string;
  company: string;
  budget: string;
  message: string;
}

export interface SkillGroup {
  /** Chiave di traduzione dell'etichetta del gruppo. */
  labelKey: string;
  items: string[];
}

/** Input per creare o aggiornare un progetto dalla dashboard admin. */
export type ProjectDraft = Omit<Project, 'id'> & { id?: string };
