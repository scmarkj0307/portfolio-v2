import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../shared.service';
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { MatSnackBar, MatSnackBarModule  } from '@angular/material/snack-bar';




@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule,MatSnackBarModule ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit, OnDestroy {
  backgroundState = 2 
  private subscription!: Subscription;
  private destroy$ = new Subject<void>();
  

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.subscription = this.sharedService.homeState$.subscribe(state => {
      if (state === 0) {
        this.router.navigate(['/']);
      }
    });

     this.sharedService.backgroundState$
          .pipe(takeUntil(this.destroy$))
          .subscribe((state) => {
            this.backgroundState = state;
          });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
      this.destroy$.next();
    this.destroy$.complete();
  }

   getBackgroundClass(): string {
    switch (this.backgroundState) {
      case 0: return 'cosmos-background';
      case 1: return 'plain-white-background';
      default: return 'image-background';
    }
  }

   lastEmailTimestamp: number | null = null;  // store the last sent time
cooldownMinutes = 5;

public sendEmail(e: Event): void {
  e.preventDefault();

  const now = Date.now();

  if (this.lastEmailTimestamp && (now - this.lastEmailTimestamp) < this.cooldownMinutes * 60 * 1000) {
    const remaining = Math.ceil(((this.cooldownMinutes * 60 * 1000 - (now - this.lastEmailTimestamp)) / 1000) / 60);
    this.snackBar.open(`Please wait ${remaining} more minute(s) before sending again.`, 'Close', { duration: 4000,  verticalPosition: 'top' });
    return;
  }

  emailjs.sendForm('service_l7cyhsi', 'template_r8k23lz', e.target as HTMLFormElement, '5JtO2FAppmBbugUNj')
    .then((result: EmailJSResponseStatus) => {
      this.lastEmailTimestamp = now;  // record the time of successful send
      this.snackBar.open('Message sent successfully!', 'Close', { duration: 3000,  verticalPosition: 'top' });
      (e.target as HTMLFormElement).reset(); // optional: clear form
    }, (error) => {
      this.snackBar.open('Failed to send message. Please try again later.', 'Close', { duration: 4000,  verticalPosition: 'top' });
      console.error(error.text);
    });
}

}