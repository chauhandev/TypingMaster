import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-progress-dialog',
  templateUrl: './progress-dialog.component.html',
  styleUrls: ['./progress-dialog.component.css']
})
export class ProgressDialogComponent {
  countdown: number | null = null;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string , countdown: boolean ,timer: number}) {
    if (data.countdown) {
      this.startCountdown(data.timer);
    }
  }

  private startCountdown(timer : number): void {
    this.countdown = timer;
    const countdownInterval = setInterval(() => {
      if (this.countdown !== null) {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(countdownInterval);
        }
      }
    }, 1000);
  }

}
