import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-challenge-notification',
  templateUrl: './challenge-notification.component.html',
  styleUrls: ['./challenge-notification.component.css']
})
export class ChallengeNotificationComponent {
  constructor(public dialogRef: MatDialogRef<ChallengeNotificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  onAccept(): void {
    // Handle accept action
    console.log('Challenge accepted');
    this.dialogRef.close({ accepted: true });
  }

  onDecline(): void {
    // Handle decline action
    console.log('Challenge declined');
    this.dialogRef.close({ accepted: false });
  } 
 
}
