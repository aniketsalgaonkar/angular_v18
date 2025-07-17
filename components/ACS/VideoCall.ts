import { Injectable } from "@angular/core";
import { CallClient, CallAgent, VideoStreamRenderer, LocalVideoStream } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { debug } from "console";
import { CommunicationClient } from "./CommunicationClient";
@Injectable()
export class VideoCall {
  public callAgent;
  public call: any;
  showIncomingCallCard: boolean = false;
  localVideoStream: LocalVideoStream;
  rendererRemote: VideoStreamRenderer;
  incomingCall: any;

  constructor(private _client: CommunicationClient) {

  }


  async remoteVideoView(remoteVideoStream) {
    let rendererRemote = new VideoStreamRenderer(remoteVideoStream);
    this.rendererRemote = rendererRemote;
    const view = await rendererRemote.createView();
    console.log("Remote view", view);
    //document.getElementById("remoteVideo").appendChild(view.target);
  }

  async setCallAgent(connectionString, initiator) {
    this.callAgent = await this._client.CallAgent(connectionString, initiator);

    const callClient = new CallClient();
    let deviceManager = await callClient.getDeviceManager();
    const videoDevices = await deviceManager.getCameras();
    const videoDeviceInfo = videoDevices[0];

    let localVideoStream = new LocalVideoStream(videoDeviceInfo);
    this.localVideoStream = localVideoStream;

    this.callAgent.on('incomingCall', async (args) => {
      debugger;
      this.showIncomingCallCard = true;
      let incomingCall=args.incomingCall;
      this.incomingCall=incomingCall;
      // let call = await args.incomingCall.accept({ videoOptions: { localVideoStreams: [this.localVideoStream] } });
      // //call.isScreenSharingOn = true;
      // this.call = call;
      // this.subscribeToCall(call);
    })
    return this.callAgent;
  }

  subscribeToRemoteParticipantInCall(callInstance) {
    debugger;
    callInstance.on('remoteParticipantsUpdated', e => {
      e.added.forEach(p => {
        this.subscribeToParticipantVideoStreams(p);
      })
    });
    callInstance.remoteParticipants.forEach(p => {
      this.subscribeToParticipantVideoStreams(p);
    })
  }

  subscribeToParticipantVideoStreams(remoteParticipant) {
    remoteParticipant.on('videoStreamsUpdated', e => {
      e.added.forEach(v => {
        this.handleVideoStream(v);
      })
    });
    remoteParticipant.videoStreams.forEach(v => {
      this.handleVideoStream(v);
    });
  }


  handleVideoStream(remoteVideoStream) {
    remoteVideoStream.on('isAvailableChanged', async () => {
      if (remoteVideoStream.isAvailable) {
        this.remoteVideoView(remoteVideoStream);
      } else {
        this.rendererRemote.dispose();
      }
    });
    if (remoteVideoStream.isAvailable) {
      this.remoteVideoView(remoteVideoStream);
    }
  }

  async startVideoCall(userToCall) {


    let view = this.localVideoView(this.localVideoStream);
    const videoOptions = this.localVideoStream ? { localVideoStreams: [this.localVideoStream] } : undefined;;
    const userId = { communicationUserId: userToCall };
    // start a call
    this.call = await this.callAgent.startCall([userId], { videoOptions });
    this.subscribeToCall(this.call);
    return view;
  }

  async acceptCallButton() {
    try {
      const callClient = new CallClient();
      let deviceManager = await callClient.getDeviceManager();
      const videoDevices = await deviceManager.getCameras();
      const videoDeviceInfo = videoDevices[0];

      let localVideoStream = new LocalVideoStream(videoDeviceInfo);
      const videoOptions = localVideoStream ? { localVideoStreams: [localVideoStream] } : undefined;
      
      this.call = await this.incomingCall.accept({ videoOptions });
      this.subscribeToCall(this.call);
    } catch (error) {
      console.error(error);
    }
  }

  async hangUp() {
    this.showIncomingCallCard = false;
    this.call.hangUp({});
  }


  async localVideoView(localVideoStream) {
    let rendererLocal = new VideoStreamRenderer(localVideoStream);
    const view = await rendererLocal.createView();
    return view;
  }



  // Subscribe to a call obj.
  // Listen for property changes and collection udpates.
  subscribeToCall(call) {
    try {
      debugger;
      // Inspect the initial call.id value.
      console.log(`Call Id: ${call.id}`);
      //Subsribe to call's 'idChanged' event for value changes.
      call.on('idChanged', () => {
        console.log(`Call Id changed: ${call.id}`);
      });

      // Inspect the initial call.state value.
      console.log(`Call state: ${call.state}`);
      // Subscribe to call's 'stateChanged' event for value changes.
      call.on('stateChanged', async () => {
        console.log(`Call state changed: ${call.state}`);
        if (call.state === 'Connected') {
          // connectedLabel.hidden = false;
          // acceptCallButton.disabled = true;
          // startCallButton.disabled = true;
          // hangUpCallButton.disabled = false;
          // startVideoButton.disabled = false;
          // stopVideoButton.disabled = false;
        } else if (call.state === 'Disconnected') {
          // connectedLabel.hidden = true;
          // startCallButton.disabled = false;
          // hangUpCallButton.disabled = true;
          // startVideoButton.disabled = true;
          // stopVideoButton.disabled = true;
          console.log(`Call ended, call end reason={code=${call.callEndReason.code}, subCode=${call.callEndReason.subCode}}`);
        }
      });

      call.localVideoStreams.forEach(async (lvs) => {
        this.localVideoStream = lvs;
        //await displayLocalVideoStream();
      });
      call.on('localVideoStreamsUpdated', e => {
        e.added.forEach(async (lvs) => {
          this.localVideoStream = lvs;
          // await displayLocalVideoStream();
        });
        e.removed.forEach(lvs => {
          //removeLocalVideoStream();
        });
      });

      // Inspect the call's current remote participants and subscribe to them.
      call.remoteParticipants.forEach(remoteParticipant => {
        this.subscribeToRemoteParticipantInCall(remoteParticipant);
      });
      // Subscribe to the call's 'remoteParticipantsUpdated' event to be
      // notified when new participants are added to the call or removed from the call.
      call.on('remoteParticipantsUpdated', e => {
        // Subscribe to new remote participants that are added to the call.
        e.added.forEach(remoteParticipant => {
          this.subscribeToRemoteParticipantInCall(remoteParticipant)
        });
        // Unsubscribe from participants that are removed from the call
        e.removed.forEach(remoteParticipant => {
          console.log('Remote participant removed from the call.');
        });
      });
    } catch (error) {
      console.error(error);
    }
  }
}