import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Protegge `/admin`.
 *
 * Non basta avere una sessione: se l'account ha un secondo fattore
 * attivo, la sessione deve averlo superato. Una sessione fatta con la
 * sola password resta valida per Supabase, ma qui non passa.
 *
 * Questo controllo da solo non sarebbe sufficiente — chi conosce la
 * password potrebbe chiamare l'API senza passare dal sito. La barriera
 * vera sono le policy RLS che pretendono `aal2`; questa guard serve a far
 * arrivare l'utente alla richiesta del codice invece che a una pagina di
 * errori di permesso.
 */
export const adminGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.ensureReady();

  const toLogin = () =>
    router.createUrlTree(['/admin/login'], {
      queryParams: state.url === '/admin' ? undefined : { redirect: state.url },
    });

  if (!auth.isAuthenticated()) {
    return toLogin();
  }

  try {
    if (await auth.needsSecondFactor()) {
      return toLogin();
    }
  } catch {
    // Se il livello non è verificabile si resta prudenti e si rimanda
    // al login, dove l'errore diventa visibile.
    return toLogin();
  }

  return true;
};
