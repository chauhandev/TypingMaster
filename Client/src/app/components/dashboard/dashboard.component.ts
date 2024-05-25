import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WebsocketService } from 'src/app/services/websocket.service';
import { ChallengeNotificationComponent } from '../challenge-notification/challenge-notification.component';
import { ProgressDialogComponent } from '../progress-dialog/progress-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  

  constructor(private dialog: MatDialog , public webSocketService: WebsocketService){

  }

  ngOnInit(){
  
  }

 
}
