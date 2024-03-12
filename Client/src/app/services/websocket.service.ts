import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {io} from 'socket.io-client';

export interface Connection{
  create:'create',
  change: 'change'
}

@Injectable({
  providedIn: 'root'
})


export class WebsocketService {
  
  private socket :any;
  constructor() { 
    this.socket = io('http://localhost:3000'); 
  }
  
  listenToServer(connection:Connection):Observable<any>{
    return new Observable((subscribe) => {
      this.socket.on(connection,(data: any)=>{
        subscribe.next(data);
      });
    });
  } 

  emitToServer(connection:Connection,data: any):void{
    this.socket.emit(connection,data);
  }


  
}
