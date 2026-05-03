import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { driver, type DriveStep, type Driver } from 'driver.js';

@Injectable({
  providedIn: 'root'
})
export class NavbarTourService {
  private readonly mainTourSeenKey = 'navbarTourSeen';
  private readonly homeReturnGuideSeenKey = 'navbarHomeReturnGuideSeen';
  private readonly gridReturnGuideSeenKey = 'navbarGridReturnGuideSeen';
  private readonly isBrowser: boolean;
  private readonly requiredSelectors = [
    '#navbar-theme-toggle',
    '#navbar-layout-toggle',
    '#navbar-resume-link'
  ];

  private tourInstance: Driver | null = null;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  startIfNeeded(): void {
    if (this.hasSeen(this.mainTourSeenKey)) {
      return;
    }

    this.start(true);
  }

  start(force = false): void {
    if (!this.isBrowser || this.tourInstance?.isActive()) {
      return;
    }

    if (!force && this.hasSeen(this.mainTourSeenKey)) {
      return;
    }

    if (!this.hasAllTargets()) {
      return;
    }

    const tour = this.getOrCreateTour();
    tour.setSteps(this.buildSteps());
    tour.drive();
    this.markSeen(this.mainTourSeenKey);
  }

  startHomeReturnGuide(): void {
    if (!this.isBrowser || this.tourInstance?.isActive()) {
      return;
    }

    if (this.hasSeen(this.homeReturnGuideSeenKey)) {
      return;
    }

    const selector = '#navbar-home-return-icon';
    if (!this.document.querySelector(selector)) {
      return;
    }

    const tour = this.getOrCreateTour();
    tour.setSteps([
      {
        element: selector,
        popover: {
          title: 'Go back to Home',
          description: 'Click this button to go back to the landing page.',
          side: 'bottom',
          align: 'end',
          showProgress: false,
          doneBtnText: 'Got it'
        }
      }
    ]);
    tour.drive();
    this.markSeen(this.homeReturnGuideSeenKey);
  }

  startGridReturnGuide(): void {
    if (!this.isBrowser || this.tourInstance?.isActive()) {
      return;
    }

    if (this.hasSeen(this.gridReturnGuideSeenKey)) {
      return;
    }

    const selector = '#navbar-grid-return-icon';
    if (!this.document.querySelector(selector)) {
      return;
    }

    const tour = this.getOrCreateTour();
    tour.setSteps([
      {
        element: selector,
        popover: {
          title: 'Go back to Grid Cards',
          description: 'Click this button to go back to the grid cards that contain information.',
          side: 'bottom',
          align: 'end',
          showProgress: false,
          doneBtnText: 'Got it'
        }
      }
    ]);
    tour.drive();
    this.markSeen(this.gridReturnGuideSeenKey);
  }

  private getOrCreateTour(): Driver {
    if (!this.tourInstance) {
      this.tourInstance = driver({
        animate: true,
        allowClose: true,
        overlayClickBehavior: () => {},
        overlayOpacity: 0.6,
        stagePadding: 8,
        stageRadius: 14,
        popoverOffset: 16,
        showProgress: true,
        disableActiveInteraction: true,
        nextBtnText: 'Next',
        prevBtnText: 'Back',
        doneBtnText: 'Done',
        popoverClass: 'navbar-tour-popover'
      });
    }

    return this.tourInstance;
  }

  private buildSteps(): DriveStep[] {
    return [
      {
        element: '#navbar-theme-toggle',
        popover: {
          title: 'Change Portfolio Theme',
          description: 'Switch between light, default, and dark themes for the portfolio.',
          side: 'bottom',
          align: 'end'
        }
      },
      {
        element: '#navbar-layout-toggle',
        popover: {
          title: 'View Content',
          description: 'Display the grid cards that contain my information.',
          side: 'bottom',
          align: 'end'
        }
      },
      {
        element: '#navbar-resume-link',
        popover: {
          title: 'View My Resume',
          description: 'Open my latest resume in a new tab whenever you want to review it.',
          side: 'bottom',
          align: 'end'
        }
      }
    ];
  }

  private hasAllTargets(): boolean {
    return this.requiredSelectors.every((selector) => !!this.document.querySelector(selector));
  }

  private hasSeen(storageKey: string): boolean {
    if (!this.isBrowser) {
      return true;
    }

    return localStorage.getItem(storageKey) === 'true';
  }

  private markSeen(storageKey: string): void {
    if (!this.isBrowser) {
      return;
    }

    localStorage.setItem(storageKey, 'true');
  }
}
