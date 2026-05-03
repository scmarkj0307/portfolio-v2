import {
  Component,
  ElementRef,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy,
  Renderer2,
  ViewChildren,
  QueryList,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../shared.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CardSkeletonComponent } from '../../shared/card-skeleton/card-skeleton.component';
import { SkeletonCardConfig, preloadCardAssets } from '../../shared/card-loading.util';
import { NavbarTourService } from '../../shared/navbar/navbar-tour.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardSkeletonComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, AfterViewChecked, OnInit, OnDestroy {
  backgroundState = 2; 
  homeLabelState = 2;
  isCardGridLoading = true;
  cards = [
  {
    title: 'About Me',
    description: 'Click to see my personal info',
    image: '/assets/about/card1.png'
  },
  {
    title: 'Projects',
    description: 'Click to see my sample works',
    image: '/assets/about/card2.png'
  },
  {
    title: 'Experience',
    description: 'Click to see my experience',
    image: '/assets/about/card3.png'
  },
  {
    title: 'Technologies',
    description: 'Click to see the list of tech stacks I\'ve used in my projects',
    image: '/assets/about/card4.png'
  },
  {
    title: 'Certificates',
    description: 'Click to see my certificates',
    image: '/assets/about/card5.png'
  },
  {
    title: 'Contacts',
    description: 'Click to see my contact details',
    image: '/assets/about/card6.png'
  }
];

  readonly skeletonCards: SkeletonCardConfig[] = Array.from(
    { length: this.cards.length },
    () => ({
      imageHeight: 110,
      lineWidths: ['92%', '68%']
    })
  );


  private letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  private intervalMap = new Map<HTMLElement, ReturnType<typeof setInterval>>();
  private destroy$ = new Subject<void>();
  private isDestroyed = false;


  @ViewChildren('cardRef') cardRefs!: QueryList<ElementRef>;
  @ViewChildren('hackerText') hackerTextRefs!: QueryList<ElementRef>;

  hasAnimated = false;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private sharedService: SharedService,
    private navbarTourService: NavbarTourService
  ) {}

  ngOnInit() {
    this.sharedService.homeState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.homeLabelState = state;
        this.hasAnimated = false;
      });

    this.sharedService.backgroundState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.backgroundState = state;
      });

    void this.loadCardGridAssets();
  }

    ngOnDestroy() {
    this.isDestroyed = true;
    this.destroy$.next();
    this.destroy$.complete();
  }



  ngAfterViewInit(): void {
    this.setupHackerTextAnimation();
  }

  ngAfterViewChecked(): void {
    if (
      !this.hasAnimated &&
      this.homeLabelState === 0 &&
      !this.isCardGridLoading &&
      this.cardRefs?.length
    ) {
      this.hasAnimated = true;
      this.cardRefs.forEach((card, index) => {
        setTimeout(() => {
          this.renderer.addClass(card.nativeElement, 'animate-in');
        }, index * 150);
      });
    }
  }

  private setupHackerTextAnimation(): void {
    this.hackerTextRefs.forEach((elRef) => {
      const el = elRef.nativeElement as HTMLElement;
      const originalText = el.innerText;
      this.renderer.setAttribute(el, 'data-value', originalText);

      this.renderer.listen(el, 'mouseover', () => {
        let iteration = 0;
        const text = el.dataset['value'] || '';
        clearInterval(this.intervalMap.get(el));

        const interval = setInterval(() => {
          const scrambled = text
            .split("")
            .map((letter, index) => {
              if (index < iteration) {
                return text[index];
              }
              return this.letters[Math.floor(Math.random() * 26)];
            })
            .join("");

          el.innerText = scrambled;

          if (iteration >= text.length) {
            clearInterval(interval);
          }

          iteration += 1 / 3;
        }, 30);

        this.intervalMap.set(el, interval);
      });
    });
  }

  private async loadCardGridAssets(): Promise<void> {
    await preloadCardAssets([
      ...this.cards.map((card) => card.image),
      '/assets/images/whiteclick.png'
    ]);

    if (!this.isDestroyed) {
      this.isCardGridLoading = false;
    }
  }

  getBackgroundClass(): string {
    switch (this.backgroundState) {
      case 0: return 'cosmos-background';
      case 1: return 'plain-white-background';
      default: return 'image-background';
    }
  }

  navigateTo(title: string) {

    switch (title) {
      case 'About Me':
        this.navigateToRoute('/about');
        break;
      case 'Projects':
        this.navigateToRoute('/projects');
        break;
      case 'Experience':
        this.navigateToRoute('/experience');
        break;
      case 'Technologies':
        this.navigateToRoute('/technologies');
        break;
      case 'Certificates':
        this.navigateToRoute('/certificates');
        break;
      case 'Contacts':
        this.navigateToRoute('/contact');
        break;
    }
  }

  private navigateToRoute(route: string): void {
    this.sharedService.setHomeState(2);
    void this.router.navigate([route]).then((didNavigate) => {
      if (didNavigate) {
        setTimeout(() => this.navbarTourService.startGridReturnGuide(), 0);
      }
    });
  }
}
