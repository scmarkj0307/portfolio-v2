import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../shared.service';
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { CardSkeletonComponent } from '../../shared/card-skeleton/card-skeleton.component';
import { SkeletonCardConfig, preloadCardAssets } from '../../shared/card-loading.util';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, CardSkeletonComponent],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css'
})
export class ExperienceComponent implements OnInit, OnDestroy{
 backgroundState = 2 
  isLoading = true;
  readonly skeletonCards: SkeletonCardConfig[] = [
    { variant: 'image-only', showTitle: false, imageHeight: 220, cssClass: 'skeleton-mobile-hidden', lineWidths: [] },
    { full: true, imageHeight: 150, lineWidths: ['100%', '92%', '84%', '68%'] },
    { full: true, imageHeight: 150, lineWidths: ['100%', '90%', '82%', '70%'] },
    { variant: 'image-only', showTitle: false, imageHeight: 220, cssClass: 'skeleton-mobile-hidden', lineWidths: [] },
    { variant: 'image-only', showTitle: false, imageHeight: 220, cssClass: 'skeleton-mobile-hidden', lineWidths: [] },
    { full: true, imageHeight: 150, lineWidths: ['100%', '88%', '78%', '64%'] }
  ];
  private subscription!: Subscription;
  private destroy$ = new Subject<void>();
  private isDestroyed = false;
  private readonly imageSources = [
    '../../assets/images/expschool1.jpg',
    '../../assets/images/phblockchain.jpg',
    '../../assets/images/expinfor2.jpg',
    '/assets/images/expschool2.jpg',
    '/assets/images/seminars.jpg',
    '/assets/images/expinfor1.jpg'
  ];
  

  constructor(
    private router: Router,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.subscription = this.sharedService.homeState$.subscribe(state => {
      if (state === 0) {
        this.router.navigate(['/']);
      }
    });

     this.sharedService.backgroundState$
          .pipe(takeUntil(this.destroy$))
          .subscribe((state) => {
            this.backgroundState = state;
          });

    void this.loadCardAssets();
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
    this.subscription.unsubscribe();
      this.destroy$.next();
    this.destroy$.complete();
  }

  getBackgroundClass(): string {
    switch (this.backgroundState) {
      case 0: return 'cosmos-background';
      case 1: return 'plain-white-background';
      default: return 'image-background';
    }
  }

  private async loadCardAssets(): Promise<void> {
    await preloadCardAssets(this.imageSources);

    if (!this.isDestroyed) {
      this.isLoading = false;
    }
  }
}
