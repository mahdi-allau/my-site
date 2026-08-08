/**
 * Configurazione di produzione.
 *
 * `supabaseAnonKey` contiene la chiave *publishable* del progetto: è una
 * chiave pubblica, pensata per stare nel bundle del browser, ed è protetta
 * dalle policy RLS definite in `supabase/schema.sql`.
 * Non inserire qui mai la service_role key.
 */
export const environment = {
  production: true,
  supabaseUrl: 'https://pujouykvgptcurolpfys.supabase.co',
  supabaseAnonKey: 'sb_publishable_d8kxEQoDTZarnMdpwh5wnQ_IltVd8j8',
  contactEmail: 'mahdiallau@gmail.com',
};
