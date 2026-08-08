import { Injectable } from '@angular/core';
import type { SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

/**
 * Unico punto di accesso al client Supabase.
 *
 * La libreria viene importata dinamicamente: pesa un paio di centinaia di kB e
 * non deve rallentare il primo caricamento del sito. Chi visita le pagine
 * pubbliche senza database configurato non la scarica affatto.
 */
@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly isConfigured =
    environment.supabaseUrl.trim().length > 0 && environment.supabaseAnonKey.trim().length > 0;

  private pending: Promise<SupabaseClient> | null = null;

  /** Restituisce sempre la stessa istanza; la crea alla prima chiamata. */
  getClient(): Promise<SupabaseClient> {
    if (!this.isConfigured) {
      return Promise.reject(
        new Error(
          'Supabase non è configurato: inserisci supabaseUrl e supabaseAnonKey in src/environments/.',
        ),
      );
    }

    this.pending ??= import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(environment.supabaseUrl, environment.supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      }),
    );

    return this.pending;
  }
}
