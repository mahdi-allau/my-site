import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { ContactDraft, ContactMessage, Project, ProjectDraft, ServiceOffer } from './models';
import { seedProjects, seedServices } from './seed-content';
import { SupabaseService } from './supabase.service';
import { I18nService, Lang } from './i18n/i18n.service';

/** Esito dell'invio del form contatti. */
export type ContactResult =
  | { ok: true; mode: 'stored' }
  | { ok: true; mode: 'mailto'; href: string }
  | { ok: false; error: string };

/** Le colonne `*_en` sono facoltative: se vuote si ricade sull'italiano. */
type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  summary: string | null;
  description: string | null;
  technologies: string[] | null;
  highlights: string[] | null;
  title_en: string | null;
  category_en: string | null;
  summary_en: string | null;
  description_en: string | null;
  technologies_en: string[] | null;
  highlights_en: string[] | null;
  image_url: string | null;
  repo_url: string | null;
  live_url: string | null;
  year: number | null;
  featured: boolean | null;
  sort_order: number | null;
};

type ServiceRow = {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  description: string | null;
  deliverables: string[] | null;
  title_en: string | null;
  tagline_en: string | null;
  description_en: string | null;
  deliverables_en: string[] | null;
  icon: string | null;
  sort_order: number | null;
};

type MessageRow = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  budget: string | null;
  message: string;
  handled: boolean | null;
  created_at: string;
};

/**
 * Lettura e scrittura dei contenuti del sito.
 *
 * Ogni metodo di lettura pubblico ricade sui dati statici di `seed-content.ts`
 * quando Supabase non è configurato o quando la query fallisce: il sito
 * pubblico non deve mai mostrare una pagina vuota per un problema di rete.
 */
@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly supabase = inject(SupabaseService);
  private readonly i18n = inject(I18nService);

  get usesRemoteData(): boolean {
    return this.supabase.isConfigured;
  }

  // ------------------------------------------------------------------
  // Lettura pubblica
  // ------------------------------------------------------------------

  async listProjects(): Promise<Project[]> {
    const lang = this.i18n.lang();

    if (!this.supabase.isConfigured) {
      return seedProjects(lang);
    }

    try {
      const client = await this.supabase.getClient();
      const { data, error } = await client
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error || !data?.length) {
        return seedProjects(lang);
      }

      return (data as ProjectRow[]).map((row) => toProject(row, lang));
    } catch {
      return seedProjects(lang);
    }
  }

  async listServices(): Promise<ServiceOffer[]> {
    const lang = this.i18n.lang();

    if (!this.supabase.isConfigured) {
      return seedServices(lang);
    }

    try {
      const client = await this.supabase.getClient();
      const { data, error } = await client
        .from('services')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error || !data?.length) {
        return seedServices(lang);
      }

      return (data as ServiceRow[]).map((row) => toService(row, lang));
    } catch {
      return seedServices(lang);
    }
  }

  async findProject(slug: string): Promise<Project | null> {
    const projects = await this.listProjects();
    return projects.find((project) => project.slug === slug) ?? null;
  }

  // ------------------------------------------------------------------
  // Form contatti
  // ------------------------------------------------------------------

  async sendContactMessage(draft: ContactDraft): Promise<ContactResult> {
    if (!this.supabase.isConfigured) {
      return { ok: true, mode: 'mailto', href: buildMailto(draft) };
    }

    try {
      const client = await this.supabase.getClient();
      const { error } = await client.from('contact_messages').insert({
        name: draft.name.trim(),
        email: draft.email.trim(),
        company: draft.company.trim() || null,
        budget: draft.budget.trim() || null,
        message: draft.message.trim(),
      });

      if (error) {
        return { ok: false, error: error.message };
      }

      return { ok: true, mode: 'stored' };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : String(err) };
    }
  }

  // ------------------------------------------------------------------
  // Area amministrativa (richiede sempre una sessione valida)
  // ------------------------------------------------------------------

  /**
   * Come `listProjects` ma senza fallback sui dati statici: la dashboard deve
   * vedere esattamente le righe presenti sul database, altrimenti mostrerebbe
   * come modificabili dei progetti che non esistono.
   */
  async listProjectsForAdmin(): Promise<Project[]> {
    const client = await this.supabase.getClient();
    const { data, error } = await client
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    // La dashboard lavora sempre sull'originale italiano.
    return (data as ProjectRow[]).map((row) => toProject(row, 'it'));
  }

  async listMessages(): Promise<ContactMessage[]> {
    const client = await this.supabase.getClient();
    const { data, error } = await client
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data as MessageRow[]).map(toMessage);
  }

  async setMessageHandled(id: string, handled: boolean): Promise<void> {
    const client = await this.supabase.getClient();
    const { error } = await client.from('contact_messages').update({ handled }).eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }

  async deleteMessage(id: string): Promise<void> {
    const client = await this.supabase.getClient();
    const { error } = await client.from('contact_messages').delete().eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }

  async saveProject(draft: ProjectDraft): Promise<void> {
    const client = await this.supabase.getClient();
    const payload = {
      slug: draft.slug,
      title: draft.title,
      category: draft.category,
      summary: draft.summary,
      description: draft.description,
      technologies: draft.technologies,
      highlights: draft.highlights,
      image_url: draft.imageUrl,
      repo_url: draft.repoUrl,
      live_url: draft.liveUrl,
      year: draft.year,
      featured: draft.featured,
      sort_order: draft.sortOrder,
    };

    const { error } = draft.id
      ? await client.from('projects').update(payload).eq('id', draft.id)
      : await client.from('projects').insert(payload);

    if (error) {
      throw new Error(error.message);
    }
  }

  async deleteProject(id: string): Promise<void> {
    const client = await this.supabase.getClient();
    const { error } = await client.from('projects').delete().eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }
}

// --------------------------------------------------------------------
// Mapper snake_case -> camelCase
// --------------------------------------------------------------------

/** Sceglie la traduzione richiesta; se manca o è vuota torna l'italiano. */
function pick(it: string | null, en: string | null, lang: Lang): string {
  if (lang === 'en' && en && en.trim().length > 0) {
    return en;
  }
  return it ?? '';
}

function pickList(it: string[] | null, en: string[] | null, lang: Lang): string[] {
  if (lang === 'en' && en && en.length > 0) {
    return en;
  }
  return it ?? [];
}

function toProject(row: ProjectRow, lang: Lang): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: pick(row.title, row.title_en, lang),
    category: pick(row.category, row.category_en, lang),
    summary: pick(row.summary, row.summary_en, lang),
    description: pick(row.description, row.description_en, lang),
    technologies: pickList(row.technologies, row.technologies_en, lang),
    highlights: pickList(row.highlights, row.highlights_en, lang),
    imageUrl: row.image_url,
    repoUrl: row.repo_url,
    liveUrl: row.live_url,
    year: row.year,
    featured: row.featured ?? false,
    sortOrder: row.sort_order ?? 0,
  };
}

const SERVICE_ICONS: ReadonlyArray<ServiceOffer['icon']> = [
  'globe',
  'restaurant',
  'app',
  'chart',
  'spark',
];

function toService(row: ServiceRow, lang: Lang): ServiceOffer {
  const icon = SERVICE_ICONS.find((allowed) => allowed === row.icon) ?? 'spark';

  return {
    id: row.id,
    slug: row.slug,
    title: pick(row.title, row.title_en, lang),
    tagline: pick(row.tagline, row.tagline_en, lang),
    description: pick(row.description, row.description_en, lang),
    deliverables: pickList(row.deliverables, row.deliverables_en, lang),
    icon,
    sortOrder: row.sort_order ?? 0,
  };
}

function toMessage(row: MessageRow): ContactMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    company: row.company,
    budget: row.budget,
    message: row.message,
    handled: row.handled ?? false,
    createdAt: row.created_at,
  };
}

/** Fallback usato quando il database non è ancora collegato. */
function buildMailto(draft: ContactDraft): string {
  const body = [
    `Nome: ${draft.name}`,
    `Email: ${draft.email}`,
    draft.company ? `Attività: ${draft.company}` : null,
    draft.budget ? `Budget indicativo: ${draft.budget}` : null,
    '',
    draft.message,
  ]
    .filter((line): line is string => line !== null)
    .join('\n');

  return `mailto:${environment.contactEmail}?subject=${encodeURIComponent(
    `Richiesta dal sito — ${draft.name}`,
  )}&body=${encodeURIComponent(body)}`;
}
