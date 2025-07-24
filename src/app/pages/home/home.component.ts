import {
  Component,
  ElementRef,
  AfterViewInit,
  AfterViewChecked,
  Renderer2,
  ViewChildren,
  QueryList,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, AfterViewChecked, OnInit {
  backgroundState = 2; 
  homeLabelState = 2;
  cards = [
    { title: 'Card 1', description: 'This is the first card.' },
    { title: 'Card 2', description: 'This is the second card.' },
    { title: 'Card 3', description: 'This is the third card.' },
    { title: 'Card 4', description: 'This is the fourth card.' },
    { title: 'Card 5', description: 'This is the fifth card.' },
    { title: 'Card 6', description: 'This is the sixth card.' },
  ];

  private letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  private intervalMap = new Map<HTMLElement, ReturnType<typeof setInterval>>();

  @ViewChildren('cardRef') cardRefs!: QueryList<ElementRef>;
  @ViewChildren('hackerText') hackerTextRefs!: QueryList<ElementRef>;

  hasAnimated = false;

  constructor(private renderer: Renderer2, private sharedService: SharedService) {}

  ngOnInit() {
    this.sharedService.homeState$.subscribe((state) => {
      this.homeLabelState = state;
      this.hasAnimated = false; // Reset animation on state change
    });
      this.sharedService.backgroundState$.subscribe((state) => {
      this.backgroundState = state;
    });
  }

  ngAfterViewInit(): void {
    this.setupHackerTextAnimation();
  }

  ngAfterViewChecked(): void {
    if (!this.hasAnimated && this.homeLabelState === 0) {
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

  getBackgroundClass(): string {
    switch (this.backgroundState) {
      case 0: return 'cosmos-background';
      case 1: return 'plain-white-background';
      default: return 'image-background';
    }
  }


}
