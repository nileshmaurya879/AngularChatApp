import { Component, NgZone } from '@angular/core';
import { Message } from './Models/Message.model';
import { ChatServiceService } from '../app/services/chat-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ChatAppAngular';
  txtMessage: string = '';
  uniqueId: string = new Date().getTime().toString();
  messages = new Array<Message>();
  message = new Message();

  constructor(private chatService: ChatServiceService, private _ngZone: NgZone) {
    this.subscribeToEvents();
  }


  sendMessage(): void {  
    if (this.txtMessage) {  
      this.message = new Message();  
      this.message.clientuniqueid = this.uniqueId;  
      this.message.type = "sent";  
      this.message.message = this.txtMessage;  
      this.message.date = new Date().toString();  
      this.messages.push(this.message);  
      this.chatService.sendMessage(this.message);  
      this.txtMessage = '';  
    }  
  }  

  private subscribeToEvents(){
    this.chatService.messageReceived.subscribe((message:Message)=>{
      this._ngZone.run(()=>{
        if(message.clientuniqueid !== this.uniqueId){
          message.type="recieved"
        }
      });
    });
  }

  test(event:any){
    this.txtMessage = event.target.value;
  }


}
