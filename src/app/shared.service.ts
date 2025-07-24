import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private homeState = new BehaviorSubject<number>(2); // default = HOME
  homeState$ = this.homeState.asObservable();

  private backgroundState = new BehaviorSubject<number>(2); // default = HOME
  backgroundState$ = this.backgroundState.asObservable();

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

  setBackgroundState(state: number) {
    this.backgroundState.next(state);
  }

  getBackgroundState() {
    return this.backgroundState.getValue();
  }

  cycleBackgroundState() {
    const newState = (this.getBackgroundState() + 1) % 3;
    this.setBackgroundState(newState);
  }
}
