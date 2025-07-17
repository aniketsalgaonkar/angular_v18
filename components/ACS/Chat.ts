import { Component, OnInit, ViewChild, ViewChildren, QueryList, ElementRef, Injectable, Output, EventEmitter } from '@angular/core';
import { CallClient, CallAgent } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier, getIdentifierKind } from "@azure/communication-common";
import { CommunicationIdentityClient } from "@azure/communication-identity";
import { ChatClient, ChatThreadClient } from "@azure/communication-chat";
import { measureMemory } from 'vm';
import { debug } from 'console';
import {TokenManager} from "./TokenManager"
import { CommunicationClient } from './CommunicationClient';
import { setLogLevel } from '@azure/logger';
import { AzureLogger } from '@azure/logger';

@Injectable()
export class Chat  {

  public call;
  public callAgent;
  public chatClient;
  public chatThreadClient;

  public title = 'ChatIntegration';
  public userId = '';
  public messages = '';

  public callButton;
  public messagebox;
  public sendMessageButton;
  public chatBox;
  public messagesContainer;
  public callStateElement;
  public hangUpButton;
  public threadIdInput;
  public meetingLinkInput;
  private message = "";
  endpointUrl: string;
  threadId: any;
  userCredential: AzureCommunicationTokenCredential;
  token: string;
  connectionString: string;
  identityResponse: any;
  messageReceived: any;

  @Output() messageEvent = new EventEmitter<any>();


  constructor(private _token_manager:TokenManager,
              private _client:CommunicationClient) {
      
  }

  async getListOfThreads()
  {
    let promises=[];
    //alert();
    for await(const thread of this.chatClient.listChatThreads())
    {
      promises.push(this.getListChatThreads(thread));
    }
   let threads=await Promise.all(promises);
   console.log(threads);
   return threads;
  }


   getListChatThreads(thread) {
    var promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        resolve(thread);
      }, 1000);
    });
    return promise;
  }
  
  async chatThread(initiator) {//Returns new thread id 
    debugger;
    const createChatThreadRequest = {
      topic: "Calling Application",
      participants: [
        {
          id: initiator.user,
          displayName: initiator.displayName
        }
      ]
    };
    const createChatThreadOptions = {
      participants: [
        {
          id: initiator.user,
          displayName: initiator.displayName
        }
      ]
    };
    const createChatThreadResult = await this.chatClient.createChatThread(
      createChatThreadRequest,
      createChatThreadOptions
    );
    const threadId = await createChatThreadResult.chatThread.id;
    this.threadId = threadId;
    console.log(`Thread created:${threadId}`);

    return threadId;

  }

  async getThreadId(connectionString, endpointUrl, initiator) {
    //await this.setChatClient(connectionString, endpointUrl, initiator);
    var threadId = await this.chatThread(initiator);
    return threadId;
  }


  async setChatClient(connectionString, endpointUrl, initiator)
  {

    // setLogLevel('verbose');
    // AzureLogger.log = (...args) => {
    //   console.log(...args); // to console, file, buffer, REST API..
    // };
    this.chatClient=await this._client.ChatClient(connectionString, endpointUrl, initiator);
    this.chatClient.startRealtimeNotifications();
    this.chatClient.on("chatMessageReceived", (e) => {
      this.ReceiveMessageEvent(e);
    });
   //return await this.getListOfThreads();
  }
  

  async addParticipant(participant, connectionString) {
    let chatThreadClient = this.chatClient.getChatThreadClient(participant.threadId);
    const addParticipantsRequest =
    {
      participants: [
        {
          id:{communicationUserId:participant.id} ,
          displayName: participant.displayName
        }
      ]
    };
    await chatThreadClient.addParticipants(addParticipantsRequest);

  }


  async sendMessage(message, threadId, senderName) {
    let chatThreadClient = this.chatClient.getChatThreadClient(threadId);
    // <Send a message to a chat thread>
    const sendMessageRequest =
    {
      content: message
    };
    let sendMessageOptions =
    {
      senderDisplayName: senderName,
      type: 'text'
    };
    let sendMessageResult=await chatThreadClient.sendMessage(sendMessageRequest, sendMessageOptions);
    console.log(sendMessageResult);
   return chatThreadClient.getMessage(sendMessageResult.id);

  }


  async getMessages(threadId) {
    let chatThreadClient = this.chatClient.getChatThreadClient(threadId);
    // <LIST MESSAGES IN A CHAT THREAD>
    const messages =await chatThreadClient.listMessages();
    var conversations = []
    const promises=[];
    for await(const message of messages) {
      promises.push(this.getMessage(chatThreadClient,message.id))
    }
    conversations=await Promise.all(promises);
    return conversations;
  }

  async getMessage(chatThreadClient,messageId)
  {
    return new Promise(resolve=>{
      setTimeout(() => {
        resolve(chatThreadClient.getMessage(messageId));
      }, 100);
    })
  }

  deleteMessage(threadId,message)
  {
    let chatThreadClient = this.chatClient.getChatThreadClient(threadId);
    chatThreadClient.deleteMessage(message.id)
  }

  ReceiveMessageEvent(message)
  {
    this.messageEvent.emit(message);
  }

  async getNewMessage(threadId,messageId)
  {
    let chatThreadClient =await this.chatClient.getChatThreadClient(threadId);
    let message=chatThreadClient.getMessage(messageId);
    return message;
  }
}

