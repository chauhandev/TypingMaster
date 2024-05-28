import { ChangeDetectorRef, Component } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import { ProgressDialogComponent } from '../progress-dialog/progress-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  onlineUsers: any[] = [];
  waitingForResponse: boolean = false;
  challengedUserId: string | null = null;
  dialogRef: MatDialogRef<ProgressDialogComponent> | null = null;
console: any;
  
  constructor(private websocketService: WebsocketService , private dialog: MatDialog) {
    this.websocketService.listenForOnlineUsers().subscribe(users => {
      this.onlineUsers = users;
      console.log(this.onlineUsers);
    });

    this.websocketService.listenForChallengeResponse().subscribe(response => {
      this.waitingForResponse = false;
      this.challengedUserId = null;
      if (this.dialogRef) {
        this.dialogRef.close();
        if(response.response == true){
          let message = `${response.opponent.userName} has accepted the challenge.`
          //this.showResponseDialog(message, true);
          this.showCountdownDialog();
          this.websocketService.updateOpponent(response.opponent)
        }
        else{
          let message = `${response.sender.userName} has rejected the challenge.`
          this.showResponseDialog(message,false); 
         }
        
        this.waitingForResponse = false;
        this.challengedUserId = null;
        this.dialogRef = null;
        // Handle timeout case if needed
      }
    });
  }

  ngOnInit(): void {
   
  }

  challengeUser(user: any): void {
    this.waitingForResponse = true;
    this.challengedUserId = user.socketID;
    let textToType =  "As a lad Jack had a jarring laugh a jagged edge to his jokes. Half the kids at school adored him half found him aloof like an old hag. Jack though had a knack for finding hidden gems a gift that had shaped his jagged path. His jalopy a faded black hulk lumbered through the hills a relic from another age. As dusk fell Jack halted gazing at the sky. A flak jacket hung loosely around him a shield against the cold. He laughed a harsh guttural sound echoing through the night haunting like a banshee's wail.".toLowerCase()
   
    let  challengeConfig = {
      textToType: this.shuffleArray(textToType.split(' ')).join(' '),
      time : 1
    }
    this.websocketService.emitToServer("challengeUser", {socketID :user.socketID,challengeConfig });

     // Open the progress dialog
     this.dialogRef = this.dialog.open(ProgressDialogComponent, {
      disableClose: true,
      width: '300px',
      data: { message: 'Waiting for Response' , countdown: false}
    });

    setTimeout(() => {
      if (this.dialogRef) {
        this.dialogRef.close();
        this.waitingForResponse = false;
        this.challengedUserId = null;
        this.showResponseDialog('No response received from user',false);
        // Handle timeout case if needed
      }
    }, 10000);
  
  }
  private showResponseDialog(message: string , showCountDown :boolean): void {
    const responseDialogRef = this.dialog.open(ProgressDialogComponent, {
      width: '300px',
      data: { message, countdown: false }
    });

    // Close the response dialog after 3 seconds and show the countdown
    setTimeout(() => {
      responseDialogRef.close();
      if(showCountDown)
        this.showCountdownDialog();
    }, 3000); // 3 seconds
  }

  private showCountdownDialog(): void {
    let timer = 5;
    const countDownDialogRef =   this.dialog.open(ProgressDialogComponent, {
      width: '300px',
      data: { message: 'Match starts in', countdown: true ,timer: timer}
    });

    setTimeout(() => {
      countDownDialogRef.close();
    }, timer * 1000);
  }

  shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; 
    }
    return array;
  }
}
