import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AzureCommunication } from './../../Services/AzureCommunication.service';
import { Chat } from './Chat';
import { VoiceCall } from './VoiceCall'

@Injectable()
export class AzureCommunicationDAL  {
constructor(private Chat: Chat,
    private Call: VoiceCall,
    private ACS: AzureCommunication)
{

}

getActiveThreads(UserName):Observable<any[]>
{
    let activeThreadParticipants:any=[];
    this.ACS.getActiveThreads(UserName).subscribe(data => {///Active participants
        activeThreadParticipants=data;
      });
    return activeThreadParticipants;
}

getTotalNumberOfMessages(activeThreadParticipants)
{
   return activeThreadParticipants.map(p=>p.UnreadMessageCount).reduce(function(a,b)
        {//show total unread messages when page load
          if(a==undefined)
            a=0;
  
          if(b==undefined)
            b=0;
          let sum=a+b;
          return sum;
        });
}

}
