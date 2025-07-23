import {
  Component,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
  AfterViewInit,
  HostListener,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements AfterViewInit {
  @ViewChild('carousel') carouselRef!: ElementRef;
  @ViewChildren('memoryCard') memoryCards!: QueryList<ElementRef>;
  @ViewChild('prevBtn') prevBtnRef!: ElementRef;
  @ViewChild('nextBtn') nextBtnRef!: ElementRef;

  currentIndex = 0;
  startX = 0;
  theta = 0;
  isDragging = false;
  radius = 400;
  totalCards = 0;
  isBrowser: boolean;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.radius = window.innerWidth <= 768 ? 250 : 400;
    this.totalCards = this.memoryCards.length;

    this.arrangeCards();
    this.rotateCarousel();

    this.prevBtnRef.nativeElement.addEventListener('click', () => this.prevCard());
    this.nextBtnRef.nativeElement.addEventListener('click', () => this.nextCard());

    this.memoryCards.forEach((card) => {
      card.nativeElement.addEventListener('click', (e: Event) => this.flipCard(e));
    });

    const carouselEl = this.carouselRef.nativeElement;

    carouselEl.addEventListener('mousedown', (e: MouseEvent) => this.dragStart(e));
    carouselEl.addEventListener('touchstart', (e: TouchEvent) => this.dragStart(e), { passive: true });

    this.document.addEventListener('mousemove', (e: MouseEvent) => this.drag(e));
    this.document.addEventListener('touchmove', (e: TouchEvent) => this.drag(e), { passive: false });

    this.document.addEventListener('mouseup', (e: MouseEvent) => this.dragEnd(e));
    this.document.addEventListener('touchend', (e: TouchEvent) => this.dragEnd(e));
  }

  private arrangeCards(): void {
    if (!this.memoryCards || this.memoryCards.length === 0) return;

    const angle = 360 / this.totalCards;

    this.memoryCards.forEach((card, index) => {
      const el = card.nativeElement as HTMLElement;
      const cardAngle = angle * index;
      el.style.transform = `rotateY(${cardAngle}deg) translateZ(${this.radius}px)`;
      el.dataset['index'] = String(index);
    });
  }

  private rotateCarousel(): void {
    if (!this.isBrowser) return;
    this.carouselRef.nativeElement.style.transform = `rotateY(${this.theta}deg)`;
    this.currentIndex = Math.round(Math.abs(this.theta / (360 / this.totalCards)) % this.totalCards);
    if (this.currentIndex >= this.totalCards) this.currentIndex = 0;
  }

  nextCard(): void {
    this.theta -= 360 / this.totalCards;
    this.rotateCarousel();
  }

  prevCard(): void {
    this.theta += 360 / this.totalCards;
    this.rotateCarousel();
  }

  flipCard(e: Event): void {
    const card = e.currentTarget as HTMLElement;
    const cardIndex = parseInt(card.dataset['index'] || '0', 10);
    if (cardIndex === this.currentIndex) {
      card.classList.toggle('flipped');
    }
  }

  dragStart(e: MouseEvent | TouchEvent): void {
    this.isDragging = true;
    this.startX = 'touches' in e ? e.touches[0].pageX : e.pageX;
  }

  drag(e: MouseEvent | TouchEvent): void {
    if (!this.isDragging || !this.isBrowser) return;
    e.preventDefault();

    const currentX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    const diffX = currentX - this.startX;
    const newTheta = this.theta + diffX * 0.5;

    this.carouselRef.nativeElement.style.transform = `rotateY(${newTheta}deg)`;
  }

  dragEnd(e: MouseEvent | TouchEvent): void {
    if (!this.isDragging || !this.isBrowser) return;
    this.isDragging = false;

    const currentX = 'changedTouches' in e ? e.changedTouches[0].pageX : e.pageX;
    const diffX = currentX - this.startX;

    if (Math.abs(diffX) > 20) {
      diffX > 0 ? this.prevCard() : this.nextCard();
    } else {
      const anglePerCard = 360 / this.totalCards;
      const snapAngle = Math.round(this.theta / anglePerCard) * anglePerCard;
      this.theta = snapAngle;
      this.rotateCarousel();
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(e: KeyboardEvent): void {
    if (!this.isBrowser) return;

    if (e.key === 'ArrowLeft') this.nextCard();
    else if (e.key === 'ArrowRight') this.prevCard();
    else if (e.key === 'Enter' || e.key === ' ') {
      const currentCard = this.memoryCards.find(card =>
        card.nativeElement.dataset['index'] === String(this.currentIndex)
      );
      currentCard?.nativeElement.classList.toggle('flipped');
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.isBrowser) return;

    this.radius = window.innerWidth <= 768 ? 250 : 400;
    this.arrangeCards();
    this.rotateCarousel();
  }
}
