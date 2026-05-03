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
  selector: 'app-technologies',
  standalone: true,
  imports: [CommonModule, CardSkeletonComponent],
  templateUrl: './technologies.component.html',
  styleUrl: './technologies.component.css'
})
export class TechnologiesComponent implements OnInit, OnDestroy {
    backgroundState = 2 
  isLoading = true;
  readonly skeletonCards: SkeletonCardConfig[] = [
    { variant: 'badges', badgeCount: 4, lineWidths: [] },
    { variant: 'badges', badgeCount: 4, lineWidths: [] },
    { variant: 'badges', badgeCount: 4, lineWidths: [] },
    { variant: 'badges', badgeCount: 4, lineWidths: [] },
    { variant: 'badges', badgeCount: 5, lineWidths: [] },
    { variant: 'badges', badgeCount: 4, lineWidths: [] }
  ];
  private subscription!: Subscription;
  private destroy$ = new Subject<void>();
  private isDestroyed = false;
  private readonly imageSources = [
    'https://img.shields.io/badge/Frontend-React.js-61DAFB?style=flat&logo=react&logoColor=white',
    'https://img.shields.io/badge/Frontend-React_Native-61DAFB?style=flat&logo=react&logoColor=white',
    'https://img.shields.io/badge/Frontend-Angular-DD0031?style=flat&logo=angular&logoColor=white',
    'https://img.shields.io/badge/Frontend-Vue.js-4FC08D?style=flat&logo=vue.js&logoColor=white',
    'https://img.shields.io/badge/Backend-Node.js-339933?style=flat&logo=node.js&logoColor=white',
    'https://img.shields.io/badge/Backend-Express.js-000000?style=flat&logo=express&logoColor=white',
    'https://img.shields.io/badge/Backend-Spring_Boot-6DB33F?style=flat&logo=spring&logoColor=white',
    'https://img.shields.io/badge/Backend-ASP.NET-512BD4?style=flat&logo=.net&logoColor=white',
    'https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white',
    'https://img.shields.io/badge/Database-MongoDB-47A248?style=flat&logo=mongodb&logoColor=white',
    'https://img.shields.io/badge/Database-Firebase-FFCA28?style=flat&logo=firebase&logoColor=white',
    'https://img.shields.io/badge/Database-MySQL-4479A1?style=flat&logo=mysql&logoColor=white',
    'https://img.shields.io/badge/Programming-JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=white',
    'https://img.shields.io/badge/Programming-Java-007396?style=flat&logo=java&logoColor=white',
    'https://img.shields.io/badge/Programming-Python-3776AB?style=flat&logo=python&logoColor=white',
    'https://img.shields.io/badge/Programming-C%23-239120?style=flat&logo=c-sharp&logoColor=white',
    'https://img.shields.io/badge/Version Control-Git-F05032?style=flat&logo=git&logoColor=white',
    'https://img.shields.io/badge/Version Control-GitHub-181717?style=flat&logo=github&logoColor=white',
    'https://img.shields.io/badge/Version Control-GitLab-FCA121?style=flat&logo=gitlab&logoColor=white',
    'https://img.shields.io/badge/Version Control-Sourcetree-0052CC?style=flat&logo=sourcetree&logoColor=white',
    'https://img.shields.io/badge/Version Control-Fork-2C3E50?style=flat&logo=github&logoColor=white',
    'https://img.shields.io/badge/Other Tools-VS_Code-007ACC?style=flat&logo=visual-studio-code&logoColor=white',
    'https://img.shields.io/badge/Other Tools-Visual_Studio-5C2D91?style=flat&logo=visual-studio&logoColor=white',
    'https://img.shields.io/badge/Other Tools-Android_Studio-3DDC84?style=flat&logo=android-studio&logoColor=white',
    'https://img.shields.io/badge/Other Tools-Postman-FF6C37?style=flat&logo=postman&logoColor=white'
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
    await preloadCardAssets(this.imageSources, 220);

    if (!this.isDestroyed) {
      this.isLoading = false;
    }
  }
}

