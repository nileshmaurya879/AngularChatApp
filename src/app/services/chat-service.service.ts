import {EventEmitter, Injectable } from '@angular/core';
import {Message} from '../Models/Message.model';
import {HubConnection, HubConnectionBuilder} from '@aspnet/signalr'

@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {
  messageReceived = new EventEmitter<Message>();  
  connectionEstablish = new EventEmitter<boolean>();

  private connectionIsestablished = false;
  private _hubConnection: HubConnection
  
  constructor() { 
    this.createConnection();  
    this.registerOnServerEvents();  
    this.startConnection();  
  }

  sendMessage(message: Message) {  
    this._hubConnection.invoke('NewMessage', message);  
  }  
  
  /* Create connection*/
  private createConnection(){
    this._hubConnection = new HubConnectionBuilder().withUrl("http://localhost:4023/MessageHub").build();
  }


  /* start connection*/
  private startConnection():void{
    this._hubConnection.start().then(()=>{
      this.connectionIsestablished = true;
      console.log("Hub Connection started")
      this.connectionEstablish.emit(true);
    })
    .catch(err => {
      console.log("Error while connection stablished")
      setTimeout(()=>{
        this.startConnection();
      },5000)
    });
  }

  /* Register on service event*/

  private registerOnServerEvents(){
    this._hubConnection.on("MessageRecieved",(data:any)=>{
      this.messageReceived.emit(data);
    })
  }
}
