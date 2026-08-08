import { Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { Navbar } from './layout/navbar/navbar';
import { Footer } from './layout/footer/footer';
import { Ambience } from './layout/ambience/ambience';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, Ambience],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly router = inject(Router);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  /** L'area amministrativa ha una sua intestazione: navbar e footer si tolgono di mezzo. */
  protected readonly isAdminArea = computed(() => this.currentUrl().startsWith('/admin'));
}
