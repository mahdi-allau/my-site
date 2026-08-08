import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MagneticDirective } from '../../shared/motion/magnetic.directive';
import { Logo } from '../../shared/logo/logo';
import { LangSwitch } from '../../shared/lang-switch/lang-switch';
import { I18nService } from '../../core/i18n/i18n.service';

interface NavItem {
  key: string;
  path: string;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, MagneticDirective, LangSwitch, Logo],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  private readonly header = viewChild.required<ElementRef<HTMLElement>>('header');
  private readonly progress = viewChild.required<ElementRef<HTMLElement>>('progress');

  protected readonly i18n = inject(I18nService);

  protected readonly links: NavItem[] = [
    { key: 'nav.home', path: '/' },
    { key: 'nav.about', path: '/about' },
    { key: 'nav.projects', path: '/projects' },
    { key: 'nav.services', path: '/services' },
  ];

  protected readonly menuOpen = signal(false);

  private frame = 0;
  private solid = false;

  constructor() {
    // Con il menù a tutto schermo aperto la pagina sotto non deve scorrere.
    effect(() => {
      document.body.style.overflow = this.menuOpen() ? 'hidden' : '';
    });
  }

  /**
   * Lo scroll aggiorna due cose: l'opacità dell'intestazione e la barra di
   * avanzamento. Entrambe vengono scritte direttamente sul DOM fuori da
   * Angular — far girare un ciclo di change detection a ogni pixel di
   * scorrimento renderebbe il movimento a scatti.
   */
  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onScroll, { passive: true });
      this.onScroll();
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
    if (this.frame) {
      cancelAnimationFrame(this.frame);
    }
    document.body.style.overflow = '';
  }

  private readonly onScroll = (): void => {
    if (this.frame) {
      return;
    }

    this.frame = requestAnimationFrame(() => {
      this.frame = 0;

      const y = window.scrollY;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? Math.min(y / scrollable, 1) : 0;

      this.progress().nativeElement.style.transform = `scaleX(${ratio})`;

      const shouldBeSolid = y > 16;
      if (shouldBeSolid !== this.solid) {
        this.solid = shouldBeSolid;
        this.header().nativeElement.classList.toggle('is-solid', shouldBeSolid);
      }
    });
  };

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
