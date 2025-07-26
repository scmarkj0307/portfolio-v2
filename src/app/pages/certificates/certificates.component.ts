import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../shared.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [],
  templateUrl: './certificates.component.html',
  styleUrl: './certificates.component.css'
})
export class CertificatesComponent implements OnInit, OnDestroy  {
  private subscription!: Subscription;
  
    constructor(
      private router: Router,
      private sharedService: SharedService
    ) {}
  
    ngOnInit(): void {
      this.subscription = this.sharedService.homeState$.subscribe(state => {
        if (state === 2) {
          this.router.navigate(['/']);
        }
      });
    }
  
    ngOnDestroy(): void {
      this.subscription.unsubscribe();
    }

}
