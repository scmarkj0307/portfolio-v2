import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../shared.service';
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit, OnDestroy {
  backgroundState = 2 
   private subscription!: Subscription;
   private destroy$ = new Subject<void>();
   
 
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
   }
 
   ngOnDestroy(): void {
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
}
