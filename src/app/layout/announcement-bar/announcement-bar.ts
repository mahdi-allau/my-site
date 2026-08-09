import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AnnouncementsService } from '../../core/announcements.service';
import { I18nService } from '../../core/i18n/i18n.service';

/**
 * Fascia degli annunci, sopra la barra di navigazione.
 *
 * Si può chiudere e la scelta resta salvata per quell'annuncio: chi l'ha
 * già letto non se la ritrova a ogni pagina, ma un annuncio nuovo ricompare
 * perché la chiave salvata è l'identificativo, non un semplice "chiusa".
 */
@Component({
  selector: 'app-announcement-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (announcements.visible(); as announcement) {
      <aside class="bar" [attr.data-kind]="announcement.kind" role="region"
             [attr.aria-label]="i18n.t('announcement.label')">
        <div class="inner">
          <span class="text">{{ announcements.message() }}</span>

          @if (announcement.linkUrl) {
            <a [href]="announcement.linkUrl" class="link">
              {{ announcements.linkLabel() || i18n.t('announcement.more') }} →
            </a>
          }

          <button type="button" class="close" (click)="announcements.dismiss()"
                  [attr.aria-label]="i18n.t('announcement.close')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
            </svg>
          </button>
        </div>
      </aside>
    }
  `,
  styles: `
    .bar {
      position: relative;
      z-index: 41;
      font-size: 0.875rem;
      background: var(--color-forest-950);
      color: var(--color-sand-100);
    }

    /* Le promozioni si distinguono dagli avvisi di servizio */
    .bar[data-kind="promo"] {
      background: linear-gradient(100deg, var(--color-forest-800), var(--color-forest-600));
    }

    .inner {
      width: 100%;
      max-width: 78rem;
      margin-inline: auto;
      padding: 0.7rem 1.5rem;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 0.3rem 1rem;
      text-align: center;
    }

    .text {
      line-height: 1.45;
    }

    .link {
      font-weight: 600;
      color: var(--color-forest-300);
      text-decoration: underline;
      text-underline-offset: 3px;
      white-space: nowrap;
    }

    .link:hover {
      color: #fff;
    }

    .close {
      position: absolute;
      right: 0.6rem;
      top: 50%;
      transform: translateY(-50%);
      display: grid;
      place-items: center;
      width: 1.9rem;
      height: 1.9rem;
      border-radius: 999px;
      color: inherit;
      opacity: 0.65;
      cursor: pointer;
      transition: opacity 200ms ease, background-color 200ms ease;
    }

    .close:hover {
      opacity: 1;
      background: rgba(255, 255, 255, 0.12);
    }

    .close svg {
      width: 1rem;
      height: 1rem;
    }

    /* Sul telefono il testo va a capo: il tasto non deve coprirlo */
    @media (max-width: 640px) {
      .inner {
        padding-right: 2.75rem;
      }
    }
  `,
})
export class AnnouncementBar {
  protected readonly announcements = inject(AnnouncementsService);
  protected readonly i18n = inject(I18nService);
}
