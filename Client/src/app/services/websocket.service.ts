import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {io} from 'socket.io-client';

export interface Connection{
  create:'create',
  change: 'change',
  connection: 'connection'
}

@Injectable({
  providedIn: 'root'
})


export class WebsocketService {

  
  
  private socket :any = null;
  private opponent :any = null;
  constructor() { 
    
  }
  
    // Method to establish connection
 establishConnection(): void {
      this.socket = io('http://localhost:3000', {
        auth: {
          username: localStorage.getItem('username'),
          token: localStorage.getItem('token')
        }
      });
    }

  listenToServer(connection: string): Observable<any> {
      return new Observable(subscribe => {
        if (!this.socket) {
          this.establishConnection();
        }
        this.socket.on(connection, (data: any) => {
          subscribe.next(data);
        });
      });
    }

  emitToServer(eventType:any,data: any):void{
    if (!this.socket) {
      this.establishConnection();
    }
    this.socket.emit(eventType, data);
  }

 disconnectSocket(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
  
  // Method to listen for 'onlineUsers' event
  listenForOnlineUsers(): Observable<any> {
    return this.listenToServer('onlineUsers');
  }

  listenForChallenge(): Observable<any> {
    return this.listenToServer('UserChallenge');
  }

  listenForChallengeResponse(): Observable<any> {
    return this.listenToServer('ChallengeResponse');
  }

  listenForChallengeResult(): Observable<any> {
    return this.listenToServer('OpponentScore');
  }

  listenForOpponentCurrentlyTypingWord(): Observable<any> {
    return this.listenToServer('OpponentCurrentlyTypingWord');
  }
  
  updateOpponent(opponent: any) {
    this.opponent = opponent
  }
  startChallenge(startChallenge: boolean) {
    this.startChallenge(startChallenge)
  }
}
