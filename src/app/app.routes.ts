import { Routes } from '@angular/router';
import { adminGuard } from './core/admin.guard';

const SUFFIX = ' · Mahdi Allau';

export const routes: Routes = [
  {
    path: '',
    title: 'Sviluppo siti web per ristoranti e piccole aziende' + SUFFIX,
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'about',
    title: 'Chi sono' + SUFFIX,
    loadComponent: () => import('./pages/about/about').then((m) => m.About),
  },
  {
    path: 'projects',
    title: 'Progetti' + SUFFIX,
    loadComponent: () => import('./pages/projects/projects').then((m) => m.Projects),
  },
  {
    path: 'services',
    title: 'Servizi' + SUFFIX,
    loadComponent: () => import('./pages/services/services').then((m) => m.Services),
  },
  {
    path: 'contact',
    title: 'Contatti' + SUFFIX,
    loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
  },
  {
    path: 'admin/login',
    title: 'Accesso amministratore' + SUFFIX,
    loadComponent: () => import('./admin/login/login').then((m) => m.Login),
  },
  {
    path: 'admin',
    title: 'Dashboard' + SUFFIX,
    canActivate: [adminGuard],
    loadComponent: () => import('./admin/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: '**',
    title: 'Pagina non trovata' + SUFFIX,
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
