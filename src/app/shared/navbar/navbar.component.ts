import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../shared.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(public sharedService: SharedService,   private router: Router) {}

  onIconClick() {
    this.sharedService.cycleHomeState();
  }

   onBackgroundIconClick() {
    this.sharedService.cycleBackgroundState();
  }

    goToRootAndSetHomeState() {
    this.sharedService.setHomeState(2);
    this.router.navigate(['/']);
  }

}
