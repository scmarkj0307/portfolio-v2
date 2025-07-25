import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private backgroundStateKey = 'backgroundState';
  private isBrowser: boolean;


  private homeState = new BehaviorSubject<number>(2); // default = HOME
  homeState$ = this.homeState.asObservable();

  private backgroundState: BehaviorSubject<number>;
  backgroundState$;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

  const initialBackgroundState = this.isBrowser && localStorage.getItem(this.backgroundStateKey) !== null
  ? +localStorage.getItem(this.backgroundStateKey)!
  : 1;
  
   this.backgroundState = new BehaviorSubject<number>(initialBackgroundState);
   this.backgroundState$ = this.backgroundState.asObservable(); }

//for home state
  setHomeState(state: number) {
    this.homeState.next(state);
  }

  getHomeState() {
    return this.homeState.getValue();
  }

  cycleHomeState() {
    const newState = (this.getHomeState() + 1) % 3;
    this.setHomeState(newState);
  }

//for background state
   setBackgroundState(state: number) {
    this.backgroundState.next(state);
    if (this.isBrowser) {
      localStorage.setItem(this.backgroundStateKey, state.toString());
    }
  }

  getBackgroundState() {
    return this.backgroundState.getValue();
  }

  cycleBackgroundState() {
    const newState = (this.getBackgroundState() + 1) % 3;
    this.setBackgroundState(newState);
  }
}
