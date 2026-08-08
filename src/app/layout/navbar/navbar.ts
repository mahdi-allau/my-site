import { Component, HostListener, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  path: string;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
})
export class Navbar {
  protected readonly links: NavItem[] = [
    { label: 'Home', path: '/' },
    { label: 'Chi sono', path: '/about' },
    { label: 'Progetti', path: '/projects' },
    { label: 'Servizi', path: '/services' },
  ];

  protected readonly menuOpen = signal(false);
  protected readonly scrolled = signal(false);

  /** L'intestazione diventa opaca appena la pagina scorre o il menù è aperto. */
  protected readonly headerClass = computed(() => {
    const solid = this.scrolled() || this.menuOpen();
    return [
      'sticky top-0 z-40 border-b transition-colors duration-300',
      solid ? 'border-line-soft bg-ink-950/80 backdrop-blur-xl' : 'border-transparent',
    ].join(' ');
  });

  @HostListener('window:scroll')
  protected onScroll(): void {
    this.scrolled.set(window.scrollY > 12);
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
