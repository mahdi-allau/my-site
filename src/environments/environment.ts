/**
 * Configurazione di produzione.
 *
 * La anon key di Supabase è una chiave pubblica: è pensata per stare nel
 * bundle del browser ed è protetta dalle policy RLS definite in
 * `supabase/schema.sql`. Non inserire qui mai la service_role key.
 *
 * Finché i due campi restano vuoti il sito funziona lo stesso, servendo i
 * contenuti statici di `src/app/core/seed-content.ts`.
 */
export const environment = {
  production: true,
  supabaseUrl: '',
  supabaseAnonKey: '',
  contactEmail: 'mahdiallau@gmail.com',
};
