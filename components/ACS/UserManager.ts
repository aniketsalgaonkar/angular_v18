
import { CallClient, CallAgent } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier, getIdentifierKind } from "@azure/communication-common";
import { CommunicationIdentityClient } from "@azure/communication-identity";
import { ChatClient, ChatThreadClient } from "@azure/communication-chat";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class UserManager
{


    async createUser(connectionString)
  {
    debugger;
    const identityClient = new CommunicationIdentityClient(connectionString);
    var userResponse= await identityClient.createUser();
    console.log(userResponse);
    return userResponse.communicationUserId;
  }
}