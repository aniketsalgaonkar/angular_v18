import { CallClient, CallAgent } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier, getIdentifierKind } from "@azure/communication-common";
import { CommunicationIdentityClient } from "@azure/communication-identity";
import { ChatClient, ChatThreadClient } from "@azure/communication-chat";
import { Injectable } from "@angular/core";

@Injectable()
export class TokenManager
{
    async getToken(connectionString,initiator)
    {
        let user: CommunicationUserIdentifier = <CommunicationUserIdentifier>initiator.user;
        const identityClient = new CommunicationIdentityClient(connectionString);
        const userToken = await identityClient.getToken(user, ["chat","voip"]);
        return userToken;
    }
}