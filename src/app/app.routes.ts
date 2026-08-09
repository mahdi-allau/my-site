import { Routes } from '@angular/router';
import { adminGuard } from './core/admin.guard';

/**
 * I titoli non stanno più qui: erano fissi in italiano e non seguivano il
 * cambio lingua. Ogni rotta dichiara una chiave `seo`, e `SeoService`
 * compone titolo e descrizione nella lingua attiva.
 */
export const routes: Routes = [
  {
    path: '',
    data: { seo: 'home' },
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'about',
    data: { seo: 'about' },
    loadComponent: () => import('./pages/about/about').then((m) => m.About),
  },
  {
    path: 'projects',
    data: { seo: 'projects' },
    loadComponent: () => import('./pages/projects/projects').then((m) => m.Projects),
  },
  {
    path: 'services',
    data: { seo: 'services' },
    loadComponent: () => import('./pages/services/services').then((m) => m.Services),
  },
  {
    path: 'contact',
    data: { seo: 'contact' },
    loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
  },
  {
    path: 'privacy',
    data: { seo: 'privacy' },
    loadComponent: () => import('./pages/privacy/privacy').then((m) => m.Privacy),
  },
  {
    path: 'demo/trattoria',
    data: { seo: 'demoTrattoria' },
    loadComponent: () => import('./demo/trattoria/trattoria').then((m) => m.Trattoria),
  },
  {
    path: 'demo/dashboard',
    data: { seo: 'demoDashboard' },
    loadComponent: () => import('./demo/dashboard/demo-dashboard').then((m) => m.DemoDashboard),
  },
  {
    path: 'demo/gestionale',
    data: { seo: 'demoGestionale' },
    loadComponent: () => import('./demo/gestionale/demo-gestionale').then((m) => m.DemoGestionale),
  },
  {
    path: 'demo/iot',
    data: { seo: 'demoIot' },
    loadComponent: () => import('./demo/iot/demo-iot').then((m) => m.DemoIot),
  },
  {
    path: 'admin/login',
    data: { seo: 'admin' },
    loadComponent: () => import('./admin/login/login').then((m) => m.Login),
  },
  {
    // Aperta dal link di recupero: niente guard, la sessione arriva col token.
    path: 'admin/nuova-password',
    data: { seo: 'admin' },
    loadComponent: () => import('./admin/new-password/new-password').then((m) => m.NewPassword),
  },
  {
    path: 'admin',
    data: { seo: 'admin' },
    canActivate: [adminGuard],
    loadComponent: () => import('./admin/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: '**',
    data: { seo: 'notfound' },
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
