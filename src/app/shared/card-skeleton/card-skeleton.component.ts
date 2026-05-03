import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SkeletonCardVariant } from '../card-loading.util';

@Component({
  selector: 'app-card-skeleton',
  standalone: true,
  imports: [CommonModule],
  host: {
    'class': 'card skeleton-card',
    '[class.full]': 'full'
  },
  template: `
    <div *ngIf="showTitle" class="skeleton-block skeleton-title"></div>

    <ng-container [ngSwitch]="variant">
      <div *ngSwitchCase="'badges'" class="skeleton-badges">
        <div
          *ngFor="let badge of badgePlaceholders"
          class="skeleton-block skeleton-badge"
        ></div>
      </div>

      <div
        *ngSwitchDefault
        class="skeleton-block skeleton-image"
        [style.height.px]="imageHeight"
      ></div>
    </ng-container>

    <div *ngIf="variant !== 'image-only' && lineWidths.length" class="skeleton-copy">
      <div
        *ngFor="let width of lineWidths"
        class="skeleton-block skeleton-line"
        [style.width]="width"
      ></div>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      pointer-events: none;
      cursor: default;
      user-select: none;
      overflow: hidden;
    }

    .skeleton-block {
      border-radius: 0.8rem;
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.12) 0%,
        rgba(255, 255, 255, 0.28) 50%,
        rgba(255, 255, 255, 0.12) 100%
      );
      background-size: 200% 100%;
      animation: skeleton-shimmer 1.4s ease-in-out infinite;
    }

    .skeleton-title {
      height: 1.2rem;
      width: 45%;
      min-width: 8rem;
      margin-inline: auto;
    }

    .skeleton-image {
      width: 100%;
      min-height: 6rem;
      border-radius: 0.9rem;
    }

    .skeleton-copy {
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
      width: 100%;
    }

    .skeleton-line {
      height: 0.8rem;
      width: 100%;
      border-radius: 999px;
    }

    .skeleton-badges {
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
      width: 100%;
    }

    .skeleton-badge {
      height: 2.5rem;
      width: 100%;
      border-radius: 0.75rem;
    }

    :host-context(.plain-white-background) .skeleton-block {
      background: linear-gradient(
        90deg,
        rgba(98, 74, 45, 0.12) 0%,
        rgba(152, 121, 82, 0.26) 50%,
        rgba(98, 74, 45, 0.12) 100%
      );
      background-size: 200% 100%;
    }

    @keyframes skeleton-shimmer {
      0% {
        background-position: 200% 0;
      }

      100% {
        background-position: -200% 0;
      }
    }
  `]
})
export class CardSkeletonComponent {
  @Input() full = false;
  @Input() variant: SkeletonCardVariant = 'image';
  @Input() showTitle = true;
  @Input() imageHeight = 120;
  @Input() badgeCount = 4;
  @Input() lineWidths: string[] = ['100%', '82%', '64%'];

  get badgePlaceholders(): number[] {
    return Array.from({ length: this.badgeCount }, (_, index) => index);
  }
}
