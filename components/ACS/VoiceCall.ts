
import { Injectable } from "@angular/core";
import { CommunicationClient } from "./CommunicationClient";
import { CallCard } from "./CallCard";

@Injectable()
export class VoiceCall {
  public callAgent;
  public call;
  showIncomingCallCard: boolean = false;

  constructor(private _client: CommunicationClient,
    private _callCard: CallCard) { }


  async setCallAgent(connectionString, initiator) {
    this.callAgent = await this._client.CallAgent(connectionString, initiator);
    this.callAgent.on('incomingCall', async (args) => {
      this.showIncomingCallCard = true;
      this.call = await args.incomingCall.accept();

    })
    return this.callAgent;
  }

  async startCall(userToCall) {
    const userId = { communicationUserId: userToCall };
    // start a call
    this.call = await this.callAgent.startCall([userId], {});
    //const deviceManager = await this.callAgent.getDeviceManager();
    //console.log("Call",this.call);
  }

  async hangUp() {
    this.showIncomingCallCard = false;
    this.call.hangUp({});
  }

}