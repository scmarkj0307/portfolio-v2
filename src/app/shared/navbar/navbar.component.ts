import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../shared.service';
import { NavbarTourService } from './navbar-tour.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements AfterViewInit {
  constructor(
    public sharedService: SharedService,
    private router: Router,
    private navbarTourService: NavbarTourService
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => this.navbarTourService.startIfNeeded(), 150);
  }

  onIconClick() {
    const nextHomeState = this.sharedService.getHomeState() === 0 ? 2 : 0;
    this.sharedService.cycleHomeState();

    if (nextHomeState === 0) {
      setTimeout(() => this.navbarTourService.startHomeReturnGuide(), 0);
    }
  }

   onBackgroundIconClick() {
    this.sharedService.cycleBackgroundState();
  }

    goToRootAndSetHomeState() {
    this.sharedService.setHomeState(2);
    this.router.navigate(['/']);
  }

}
