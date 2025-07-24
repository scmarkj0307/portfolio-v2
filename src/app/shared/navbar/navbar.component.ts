import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../shared.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(public sharedService: SharedService) {}

  onIconClick() {
    this.sharedService.cycleHomeState();
  }

   onBackgroundIconClick() {
    this.sharedService.cycleBackgroundState();
  }

}
