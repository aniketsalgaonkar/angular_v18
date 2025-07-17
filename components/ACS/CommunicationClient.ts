
import { CallClient } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";

import { ChatClient } from "@azure/communication-chat";
import { TokenManager } from "./TokenManager";
import { Injectable } from "@angular/core";

@Injectable()
export class CommunicationClient
{
    constructor(private _token_manager:TokenManager)
    {

    }
    async ChatClient(connectionString, endpointUrl, initiator) 
    {
        const userToken =await this._token_manager.getToken(connectionString,initiator);
        const chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(userToken.token));
        return chatClient;
    }

    async CallAgent(connectionString,initiator)
    {
        const userToken =await this._token_manager.getToken(connectionString,initiator);
        const callClient = new CallClient();
        var tokenCredential=new AzureCommunicationTokenCredential(userToken.token);
        const callAgent=callClient.createCallAgent(tokenCredential);
        console.log(callAgent);
        return callAgent;
    }

    async videoCallAgent(connectionString,initiator)
    {
        const userToken =await this._token_manager.getToken(connectionString,initiator);
        const callClient = new CallClient();
        var tokenCredential=new AzureCommunicationTokenCredential(userToken.token);
        const callAgent=callClient.createCallAgent(tokenCredential, { displayName: initiator.displayName });
        console.log(callAgent);
        return callAgent;
    }
}