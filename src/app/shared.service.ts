import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private homeState = new BehaviorSubject<number>(2); // default = HOME
  homeState$ = this.homeState.asObservable();

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
}
