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
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, CardSkeletonComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit, OnDestroy {
  backgroundState = 2 
  isLoading = true;
  readonly skeletonCards: SkeletonCardConfig[] = [
    { full: true, imageHeight: 120, lineWidths: ['100%', '100%', '94%', '86%', '70%'] },
    { imageHeight: 100, lineWidths: ['82%', '58%'] },
    { imageHeight: 100, lineWidths: ['88%', '63%'] },
    { imageHeight: 100, lineWidths: ['90%', '66%'] },
    { imageHeight: 100, lineWidths: ['86%', '72%'] },
    { imageHeight: 100, lineWidths: ['94%', '68%'] },
    { imageHeight: 100, lineWidths: ['80%', '56%'] }
  ];
  private subscription!: Subscription;
  private destroy$ = new Subject<void>();
  private isDestroyed = false;
  private readonly imageSources = [
    '../../assets/images/me.jpg',
    '../../../assets/images/cofee.jpg',
    '../../../assets/images/siblings.jpg',
    '../../../assets/images/rides.jpg',
    '../../../assets/images/goals.jpg',
    '../../assets/images/education.jpg',
    '../../../assets/images/rs.jpg'
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
