import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../shared.service';
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardSkeletonComponent } from '../../shared/card-skeleton/card-skeleton.component';
import { SkeletonCardConfig, preloadCardAssets } from '../../shared/card-loading.util';


@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule,RouterModule,CardSkeletonComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit, OnDestroy {
  backgroundState = 2 
   isLoading = true;
   readonly skeletonCards: SkeletonCardConfig[] = Array.from(
     { length: 5 },
     () => ({
       full: true,
       imageHeight: 150,
       lineWidths: ['55%', '100%', '78%']
     })
   );
   private subscription!: Subscription;
   private destroy$ = new Subject<void>();
   private isDestroyed = false;
   private readonly imageSources = [
     '../../assets/images/uscl.png',
     '../../assets/images/kmmobile.jpg',
     '../../assets/images/kmweb.jpg',
     '../../assets/images/cinecity.jpg',
     '../../assets/images/portfolio.png'
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
