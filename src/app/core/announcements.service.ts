import { Injectable, computed, inject, signal } from '@angular/core';
import { I18nService } from './i18n/i18n.service';
import { SupabaseService } from './supabase.service';

export interface Announcement {
  id: string;
  messageIt: string;
  messageEn: string;
  linkUrl: string;
  linkLabelIt: string;
  linkLabelEn: string;
  kind: 'info' | 'promo';
  active: boolean;
  startsAt: string | null;
  endsAt: string | null;
}

export const EMPTY_ANNOUNCEMENT: Omit<Announcement, 'id'> = {
  messageIt: '',
  messageEn: '',
  linkUrl: '',
  linkLabelIt: '',
  linkLabelEn: '',
  kind: 'promo',
  active: false,
  startsAt: null,
  endsAt: null,
};

const DISMISSED_KEY = 'ma.announcement.dismissed';

/**
 * La fascia in cima al sito.
 *
 * Il filtro su periodo e stato lo fa il database, non il browser: le
 * policy lasciano vedere al pubblico solo gli annunci attivi e nel
 * periodo, così una promozione preparata in anticipo non trapela
 * guardando le richieste di rete.
 */
@Injectable({ providedIn: 'root' })
export class AnnouncementsService {
  private readonly supabase = inject(SupabaseService);
  private readonly i18n = inject(I18nService);

  private readonly currentSignal = signal<Announcement | null>(null);
  private readonly dismissedSignal = signal<string>(readDismissed());

  /** Annuncio da mostrare: nessuno se non c'è o se è già stato chiuso. */
  readonly visible = computed(() => {
    const announcement = this.currentSignal();
    if (!announcement || this.dismissedSignal() === announcement.id) {
      return null;
    }
    return announcement;
  });

  readonly message = computed(() => {
    const a = this.visible();
    if (!a) return '';
    return this.i18n.lang() === 'en' ? a.messageEn || a.messageIt : a.messageIt;
  });

  readonly linkLabel = computed(() => {
    const a = this.visible();
    if (!a) return '';
    return this.i18n.lang() === 'en' ? a.linkLabelEn || a.linkLabelIt : a.linkLabelIt;
  });

  async load(): Promise<void> {
    if (!this.supabase.isConfigured) {
      return;
    }

    try {
      const client = await this.supabase.getClient();
      const { data, error } = await client
        .from('announcements')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error || !data?.length) {
        return;
      }

      // Si prende il primo valido, non il più recente in assoluto: chi
      // amministra riceve per policy anche quelli programmati, e uno
      // preparato per il mese prossimo coprirebbe quello in corso.
      const row = (data as Record<string, unknown>[]).map(toAnnouncement).find(withinWindow);

      if (row) {
        this.currentSignal.set(row);
      }
    } catch {
      // Nessun annuncio: il sito prosegue senza fascia.
    }
  }

  dismiss(): void {
    const announcement = this.currentSignal();
    if (!announcement) {
      return;
    }
    this.dismissedSignal.set(announcement.id);
    try {
      localStorage.setItem(DISMISSED_KEY, announcement.id);
    } catch {
      // Vale per questa visita soltanto.
    }
  }

  // ------------------------------------------------------------------
  // Area riservata
  // ------------------------------------------------------------------

  async list(): Promise<Announcement[]> {
    const client = await this.supabase.getClient();
    const { data, error } = await client
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    return (data as Record<string, unknown>[]).map(toAnnouncement);
  }

  async save(announcement: Omit<Announcement, 'id'> & { id?: string }): Promise<void> {
    const client = await this.supabase.getClient();
    const payload = {
      message_it: announcement.messageIt,
      message_en: announcement.messageEn,
      link_url: announcement.linkUrl,
      link_label_it: announcement.linkLabelIt,
      link_label_en: announcement.linkLabelEn,
      kind: announcement.kind,
      active: announcement.active,
      starts_at: announcement.startsAt || null,
      ends_at: announcement.endsAt || null,
    };

    const { error } = announcement.id
      ? await client.from('announcements').update(payload).eq('id', announcement.id)
      : await client.from('announcements').insert(payload);

    if (error) {
      throw new Error(error.message);
    }
  }

  async remove(id: string): Promise<void> {
    const client = await this.supabase.getClient();
    const { error } = await client.from('announcements').delete().eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
  }

  /** Attivandone uno gli altri si spengono: la fascia è una sola. */
  async activateOnly(id: string): Promise<void> {
    const client = await this.supabase.getClient();
    await client.from('announcements').update({ active: false }).neq('id', id);
    const { error } = await client.from('announcements').update({ active: true }).eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
  }
}

function toAnnouncement(row: Record<string, unknown>): Announcement {
  const text = (key: string) => ((row[key] as string | null) ?? '').trim();
  return {
    id: row['id'] as string,
    messageIt: text('message_it'),
    messageEn: text('message_en'),
    linkUrl: text('link_url'),
    linkLabelIt: text('link_label_it'),
    linkLabelEn: text('link_label_en'),
    kind: (row['kind'] as 'info' | 'promo') ?? 'info',
    active: !!row['active'],
    startsAt: (row['starts_at'] as string | null) ?? null,
    endsAt: (row['ends_at'] as string | null) ?? null,
  };
}

export function withinWindow(a: Pick<Announcement, 'startsAt' | 'endsAt'>): boolean {
  const now = Date.now();
  if (a.startsAt && new Date(a.startsAt).getTime() > now) {
    return false;
  }
  if (a.endsAt && new Date(a.endsAt).getTime() < now) {
    return false;
  }
  return true;
}

function readDismissed(): string {
  try {
    return localStorage.getItem(DISMISSED_KEY) ?? '';
  } catch {
    return '';
  }
}
