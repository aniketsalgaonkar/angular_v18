import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { AzureCommunication } from "../../../Services/AzureCommunication.service";
import { Chat } from "../Chat";
import { VoiceCall } from "../VoiceCall";
import { VideoCall } from "../VideoCall";
import { UserManager } from "../UserManager";
import {
  AddParticipantsRequest,
  ChatClient,
  ChatThreadClient,
  ChatThreadItem,
  ChatThreadProperties,
  SendMessageRequest,
  SendReadReceiptRequest,
} from "@azure/communication-chat";
import {
  AzureCommunicationTokenCredential,
  CommunicationIdentifier,
  CommunicationUserIdentifier,
} from "@azure/communication-common";
import { CommunicationIdentityClient } from "@azure/communication-identity";
import { environment } from "src/environments/environment";
import { DatePipe } from "@angular/common";
import { TokenManager } from "../TokenManager";
import { CommunicationClient } from "../CommunicationClient";
import { Call, CallAgent, IncomingCall } from "@azure/communication-calling";

@Component({
  selector: "app-chat-component",
  templateUrl: "./chat-component.component.html",
  styleUrls: ["./chat-component.component.scss"],
})
export class ChatComponent implements OnInit {
  endpointUrl: string;
  connectionString: string;
  chatopen: boolean = false; //chat box
  contactopen: boolean = false;
  contactlistopen: boolean = false;
  groupChatOpen: boolean = false;
  activeThreadParticipants: any = [];
  contactList: any = [];
  allContacts: any = [];
  conversation: any[];
  participantName: any;
  ACSUserId: string;
  threadId: string;
  initiator: any;
  showCallCard: boolean = false;
  showLocalVideoCard: boolean = false;
  showRemoteVideoCard: boolean = false;
  MicStatus: string = "Mute";
  showIncomingCallCard: boolean = false;
  showIncomingVideoCallCard: boolean = false;
  selectedMessage: any;
  chatClient: ChatClient | any = null;
  isEdit = false;
  isGroup = false;
  isGroupInfo = false;
  groupParticipantsCount: string;
  filteredContacts: any = [];
  userName: string;
  searchAllContacts: any = [];
  allThreads: any;
  chats: conversation[] = [];
  chatThreadClient?: ChatThreadClient = undefined;
  sendMsg: message = {
    id: "",
    message: "",
    sender: "",
    isOwner: false,
    isEdited: false,
  };
  messages: message[] = [];
  communicatorUserName: any = "";
  isTyping: Boolean = false;
  showEmojiPicker: boolean = false;
  groupName: string;
  isGroupName: boolean = false;
  isEditGroupName: boolean = false;
  groupParticipantList: any[] = [];
  allContactsList: any = [];
  searchChatText: string;
  searchGroupText: string;
  unReadCountList: conversation[] = [];
  seenParticipantList: conversation[] = [];
  searchText: string;
  recentConversationList: conversation[] = [];
  @ViewChild("op", { static: false }) readRecipientModel;
  callAgent: CallAgent;
  call: Call;
  userList: any = [];
  acsToken: string;
  participantId: string;
  incomingCall: IncomingCall;
  participantUserId: any;

  constructor(
    private Chat: Chat,
    private Call: VoiceCall,
    private VideoCall: VideoCall,
    private ACS: AzureCommunication,
    private ACSUser: UserManager,
    private changeDetection: ChangeDetectorRef,
    private datePipe: DatePipe,
    private tokenManager: TokenManager,
    private _client: CommunicationClient
  ) {
    //alert("constructor")
    //debugger
    this.connectionString =
      environment.azureCommunicationService.connectionString;
    this.endpointUrl = environment.azureCommunicationService.endPointUrl;
    this.userName = localStorage.getItem("username");
    this.ACSUserId = localStorage.getItem("ACSUserId");
    this.getContactList();
    this.getAllContacts();
    if (this.ACSUserId) {
      this.connectACS();
    } else {
      this.getAllUsers();
    }
  }

  async ngOnInit() {
    this.initiator = {};
    this.initiator["user"] = { communicationUserId: this.ACSUserId };
    this.initiator["displayName"] = this.userName;
    this.initiator["UserId"] = localStorage.getItem("UserId");

    // this.callAgent.on("incomingCall", async (args) => {
    //   this.showIncomingCallCard = true;
    //   this.call = await args.incomingCall.accept();
    // });
    // this.callAgent = await this.setCallAgent(
    //   this.connectionString,
    //   this.initiator
    // );
    // this.callAgent.on("incomingCall", async (args) => {

    //   this.showIncomingCallCard = true;
    //   this.call = await args.incomingCall.accept();
    // });
    // await this.ACSUser.createUser(this.connectionString);

    //this.Call.setCallAgent(this.connectionString, this.initiator);
    // this.VideoCall.setCallAgent(this.connectionString, this.initiator);
    // this.showIncomingCallCard = this.Call.showIncomingCallCard;
    // this.showIncomingVideoCallCard = this.VideoCall.showIncomingCallCard;
  }

  // Connection with Azure communication service
  async connectACS() {
    let token;
    try {
      token = await this.generateToken();

      if (token) {
        this.acsToken = token.token;
        console.log(token, "Connect ACS");
        this.chatClient = new ChatClient(
          this.endpointUrl,
          new AzureCommunicationTokenCredential(this.acsToken)
        );
        console.log(this.chatClient)
        this.setupHandlers();
      }
    } catch (error) {
      let acsUserId = await this.createUserAndAssignUserId(
        localStorage.getItem("UserId")
      );
      if (acsUserId) {
        localStorage.setItem("ACSUserId", acsUserId);
        this.ACSUserId = acsUserId;
        this.connectACS();
      }
    }
    //alert("connect acs")
  }

  async generateToken() {
    const client = new CommunicationIdentityClient(this.connectionString);
    let user: CommunicationUserIdentifier = {
      communicationUserId: this.ACSUserId,
    };
    return await client.getToken(user, ["chat", "voip"]);
  }

  getAllUsers() {
    this.ACS.getAllUsers().subscribe({
      next: async (response) => {
        this.userList = response;
        console.log(response, "Email")
        for await (const user of this.userList) {
          //let acsUserId = await this.createUserAndAssignUserId(user.ID);
          if (user.Email_id == localStorage.getItem("ADusername")) {
            let acsUserId=user["ACSUserId"];
            localStorage.setItem("ACSUserId", acsUserId);
            localStorage.setItem("username", user.userName);
            localStorage.setItem("UserId", user.ID);
            this.ACSUserId = acsUserId;
          }
        }

        if (localStorage.getItem("UserId")) {
          this.getContactList();
          this.getAllContacts();
          this.connectACS();
        }
      },
    });
  }

  async createUserAndAssignUserId(userId) {
    
    const identityClient = new CommunicationIdentityClient(
      this.connectionString
    );
    var userResponse = await identityClient.createUser();
    if (userResponse.communicationUserId) {
      this.ACS.updateACSUserId(
        userId,
        userResponse.communicationUserId
      ).subscribe();
      //alert("user created")
      return userResponse.communicationUserId;
    }
  }

  private shouldMarkAsRead(state: any): boolean {
    return (
      this.chatopen &&
      state?.sender?.communicationUserId !== this.ACSUserId
    );
  }

  // ACS Hub
  async setupHandlers() {
    debugger;
    this.chatClient.startRealtimeNotifications();
    this.chatClient.on(
      "chatMessageReceived",
      (async (state: any) => {
        debugger
        this.isTyping = false;
        this.changeDetection.detectChanges();
        this.addMessage(state);
        if (
          this.chatopen &&
          state.sender.communicationUserId != this.ACSUserId
        ) {
          this.seenParticipantList = [];
          await this.listReadReceipt();
          debugger
        }
        this.changeDetection.detectChanges();
        debugger
      }).bind(this)
    );
    this.chatClient.on(
      "chatMessageEdited",
      ((state: any) => {
        this.getListMessages();
      }).bind(this)
    );
    this.chatClient.on(
      "chatMessageDeleted",
      ((state: any) => {
        this.getListMessages();
      }).bind(this)
    );
    this.chatClient.on(
      "typingIndicatorReceived",
      ((state: any) => {
        this.showTyping(state);
        this.changeDetection.detectChanges();
      }).bind(this)
    );
    this.chatClient.on(
      "readReceiptReceived",
      (async (state: any) => {
        await this.listReadReceipt();
        this.changeDetection.detectChanges();
      }).bind(this)
    );
    this.chatClient.on(
      "chatThreadCreated",
      ((state: any) => {
        if (this.ACSUserId != state.createdBy.id.communicationUserId) {
          let latestChat = this.chats.find((x) => x.threadId == state.threadId);
          
          if (!latestChat) {
            let topic =
              state.participants.length == 2
                ? state.createdBy.displayName.trim()
                : state.properties.topic.trim();

            let participants = [];
            state.participants.map((x) => {
              participants.push({
                userId: x.id.communicationUserId,
                userName: x.displayName,
              });
            });

            topic = this.chats.unshift({
              threadId: state.threadId,
              topic: topic,
              topicInitial: this.getProfileCircleName(topic),
              participants: participants,
              unreadCount: 0,
              lastMessageReceivedOn: state.createdOn,
            });
            this.changeDetection.detectChanges();
          }
        }
      }).bind(this)
    );
    this.chatClient.on(
      "chatThreadDeleted",
      ((state: any) => {
        this.chats = this.chats.filter((x) => x.threadId != state.threadId);
        this.changeDetection.detectChanges();
      }).bind(this)
    );
    this.chatClient.on(
      "chatThreadPropertiesUpdated",
      (async (state: any) => {
        await this.listAllChatThreads();
        await this.updateChatThreadParticipant();
        this.changeDetection.detectChanges();
      }).bind(this)
    );
    this.chatClient.on(
      "participantsAdded",
      (async (state: any) => {
        await this.listAllChatThreads();
        await this.updateChatThreadParticipant();
        this.changeDetection.detectChanges();
      }).bind(this)
    );
    this.chatClient.on(
      "participantsRemoved",
      (async (state: any) => {
        await this.listAllChatThreads();
        await this.updateChatThreadParticipant();
        this.changeDetection.detectChanges();
      }).bind(this)
    );
  }

  // get user list for new chat
  getContactList() {
    this.ACS.getContactList(this.userName, this.ACSUserId).subscribe((data) => {
      this.contactList = data;
      this.contactList.sort((a, b) =>
        a.displayName.localeCompare(b.displayName)
      );
      this.filteredContacts = [...this.contactList];
    });
  }

  // get user list for new group
  getAllContacts() {
    this.ACS.getContactsForGroupChat(this.userName, this.ACSUserId).subscribe((data) => {
      this.allContacts = data;
      this.allContacts.sort((a, b) =>
        a.displayName.localeCompare(b.displayName)
      );
      this.allContacts.map(
        (x) => ((x.isSelected = false), (x.isShareHistory = false))
      );
      this.searchAllContacts = [...this.allContacts];
    });
  }

  // open and close chat bubbles
  OpenCloseChatandContact(contactopen, chatopen) {
    if (this.chats.length > 0) {
      this.unReadCountList = this.chats.filter((x) => x.unreadCount > 0);
    }
    //this.chats = [];
    if (contactopen == true && chatopen == true) {
      this.contactopen = !this.contactopen;
      this.chatopen = !this.chatopen;
    } else if (contactopen == false && chatopen == false) {
      this.contactopen = !this.contactopen;
      this.threadId = null; //to reset thread
      this.listAllChatThreads();
    } else if (contactopen == true && chatopen == false) {
      this.contactopen = !this.contactopen;
      this.threadId = null; //to reset thread
    } else if (contactopen == false && chatopen == true) {
      this.contactopen = !this.contactopen;
      this.chatopen = !this.chatopen;
    }
    this.contactlistopen = false;
    this.groupChatOpen = false;
  }

  // list of recent conversations
  async listAllChatThreads() {
    // this.chats = [];
    let threads: AsyncIterableIterator<ChatThreadItem> =
      this.chatClient.listChatThreads();
    for await (const thread of threads) {
      if (
        !thread.deletedOn &&
        this.chats.find((x) => x.threadId == thread.id) == undefined
      ) {
        let participants = await this.loadParticipants(thread.id);
        let unReadCount = this.unReadCountList.find(
          (x) => x.threadId == thread.id
        );
        if (participants) {
          let topic = thread.topic;
          if (participants.length === 2) {
            let chatParticipants = participants?.find(
              (x: any) => x.userId != this.ACSUserId
            );
            topic = chatParticipants?.userName;
          }
          this.chats.push({
            topic: topic,
            threadId: thread.id,
            participants: participants,
            topicInitial: this.getProfileCircleName(topic),
            unreadCount: unReadCount ? unReadCount.unreadCount : 0,
            lastMessageReceivedOn: thread.lastMessageReceivedOn,
          });
        }
      }
    }

    this.chats = this.chats.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    });

    this.recentConversationList = [...this.chats];

    // alert()
    console.log('All Chat thread : ',this.threadId);
  }

  // get chat participantds
  async loadParticipants(threadId: string) {
    try {
      let users: any[] = [];
      var client = this.chatClient.getChatThreadClient(threadId);
      const participants = client?.listParticipants();
      if (!participants) {
        return;
      }
      for await (const message of participants) {
        users.push({
          userId: message.id.communicationUserId,
          userName: message.displayName,
        });
      }
      return users;
    } catch (error) {}
  }

  // open chat
  async openChat(chat: conversation, participantName = null) {
    debugger;
    this.seenParticipantList = [];
    this.participantId = chat.participants?.find(
      (x: any) => x.userId != this.ACSUserId
    )?.userId;
    this.selectedMessage = null;
    this.isTyping = false;
    chat.unreadCount = 0;
    this.threadId = chat.threadId;
    this.chatThreadClient = this.chatClient.getChatThreadClient(this.threadId);
    this.getListMessages();
    this.isGroup = chat.participants.length > 2;
    if (this.isGroup) {
      this.updateGroupNameAndParticipantCount(chat);
    }
    this.participantName = participantName ?? this.getParticipant(chat);
    this.chatopen = true;
    this.contactopen = true;
    this.contactlistopen = false;
    this.sendMsg = {
      id: "",
      message: "",
      sender: "",
      isOwner: false,
      isEdited: false,
    };
    setTimeout(async () => {
      await this.listReadReceipt();
      let latestMessageId = this.messages.filter((x) => x.isOwner)[0]?.id;
      if (latestMessageId) {
        let alreaySeen = this.seenParticipantList.filter(
          (x) => x.messageId == latestMessageId && x.threadId == this.ACSUserId
        );
        this.changeDetection.detectChanges();
        if (alreaySeen.length === 0) {
          this.readReceipt();
        }
      } else {
        this.readReceipt();
      }
    }, 1000);

    // alert('Open Chat');
  }

  // latest message reader
  async readReceipt() {
    let latestMessageId = this.messages.filter((x) => !x.isOwner)[0]?.id;
    if (latestMessageId) {
      let sendReadReceiptRequest: SendReadReceiptRequest = {
        chatMessageId: latestMessageId,
      };
      await this.chatThreadClient.sendReadReceipt(sendReadReceiptRequest);
    }
  }

  // list of read recipients
  async listReadReceipt() {
    debugger
    let latestMessageId = this.messages.filter((x) => x.isOwner)[0]?.id;
    let listOfReadRecipients = await this.chatThreadClient.listReadReceipts();
    for await (const recipient of listOfReadRecipients as any) {
      if (recipient.chatMessageId == latestMessageId) {
        let seenUser = this.allContacts.find(
          (x) => x.id == recipient.sender.communicationUserId
        );
        if (
          seenUser &&
          this.seenParticipantList.find((x) => x.threadId == seenUser.id) ==
            undefined
        ) {
          this.seenParticipantList.push({
            topic: seenUser.displayName.trim(),
            threadId: seenUser.id,
            topicInitial: this.getProfileCircleName(
              seenUser.displayName.trim()
            ),
            unreadCount: 0,
            participants: [],
            messageId: recipient.chatMessageId,
          });
        }
      }
    }
  }

  // open new chat from click on contact list
  async openAndAddChat(participant) {
    debugger
    if (this.checkAndChangeToThread(participant.id)) {
      let users: any[] = [
        {
          userId: this.ACSUserId,
          userName: this.userName,
        },
        {
          userId: participant.id,
          userName: participant.displayName,
        },
      ];
      //console.log(users, "Sandeep Users");
      let thread = await this.createChatThread(users, participant.displayName);
      let newlyCreatedChat = {
        threadId: thread.id,
        topic: thread.topic,
        participants: await this.loadParticipants(thread.id),
        topicInitial: this.getProfileCircleName(thread.topic.trim()),
        unreadCount: 0,
        lastMessageReceivedOn: thread.createdOn,
      };
      console.log('ThreadID : ',this.threadId);
      this.chats.unshift(newlyCreatedChat);
      this.searchChatText = null;
      this.openChat(newlyCreatedChat);

      return true;
    }
  }

  // create new chat thread
  async createChatThread(
    users: any[],
    topicName: string
  ): Promise<ChatThreadProperties> {

    let createChatThreadRequest = {
      topic: topicName,
    };
    let createChatThreadOptions = {
      participants: users.map((x) => {
        return {
          id: { communicationUserId: x.userId },
          displayName: x.userName,
        };
      }),
    };
    console.log(this.chatClient)
    let createChatThreadResult = await this.chatClient?.createChatThread(createChatThreadRequest, createChatThreadOptions);
    console.log(createChatThreadResult, 'createChatThreadResult')
    return createChatThreadResult?.chatThread;
  }

  // check exsiting chat available or not
  checkAndChangeToThread(userId: string) {
    debugger;
    let chat = this.chats.find(
      (x) =>
        x.participants &&
        x.participants.length == 2 &&
        x.participants.some((y) => y.userId == userId)
    );
    if (chat) {
      this.openChat(chat);
      return false;
    }
    return true;
  }

  // add new participant
  addParticipant(event, participant) {
    if (event) {
      participant.isSelected = event.checked;
    } else {
      participant.isSelected = !participant.isSelected;
    }

    if (participant.isShareHistory) {
      participant.isShareHistory = false;
    }
  }

  // create Group
  async createGroup() {
    let selectedContacts = this.searchAllContacts.filter((x) => x.isSelected);
    if (
      !this.groupName || !this.isGroupInfo ? selectedContacts.length < 2 : false
    ) {
      return;
    }

    if (!this.isGroupInfo) {
      let users: any[] = [
        {
          userId: this.ACSUserId,
          userName: this.userName,
        },
        ...selectedContacts.map((x) => ({
          userId: x.id,
          userName: x.displayName,
        })),
      ];
      let thread = await this.createChatThread(users, this.groupName);
      let newlyCreatedChat = {
        threadId: thread.id,
        topic: thread.topic,
        participants: await this.loadParticipants(thread.id),
        topicInitial: this.getProfileCircleName(thread.topic.trim()),
        unreadCount: 0,
      };
      this.chats.unshift(newlyCreatedChat);

      this.groupName = null;
      this.contactopen = true;
      this.groupChatOpen = false;
      this.openChat(newlyCreatedChat);
    } else {
      let newlyAdddedParticipant: AddParticipantsRequest = {
        participants: selectedContacts.map((x) => {
          return {
            id: { communicationUserId: x.id },
            displayName: x.displayName,
            shareHistoryTime: !x.isShareHistory
              ? this.datePipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ssZ")
              : null,
          };
        }),
      };

      await this.chatThreadClient.addParticipants(newlyAdddedParticipant);
      this.groupParticipantList = [];
      await this.listAllChatThreads();
      this.isGroupInfo = true;
      let currentChat = this.chats.find((x) => x.threadId == this.threadId);

      if (currentChat) {
        this.updateGroupNameAndParticipantCount(currentChat);
      }
    }

    this.isGroupName = false;
    this.allContacts = this.searchAllContacts;
    this.searchGroupText = null;
    return true;
  }

  // get selected message
  getSelectedMessage(message) {
    if (this.selectedMessage?.id == message.id) {
      this.selectedMessage = null;
    } else {
      this.selectedMessage = message;
    }
    this.changeDetection.detectChanges();
  }

  // get current chat header info
  getParticipant(chat: any) {
    if (chat.participants && chat.participants.length > 2) {
      return chat.topic;
    }

    let chatParticipants = chat.participants?.find(
      (x: any) => x.userId != this.ACSUserId
    );
    return chatParticipants?.userName ?? chat.topic;
  }

  // notify Typing indicator
  async notifyTyping() {
    await this.chatThreadClient?.sendTypingNotification();
  }

  // show Typing
  showTyping(state: any) {
    this.isTyping = false;
    if (
      state.sender.communicationUserId != this.ACSUserId &&
      this.threadId == state.threadId
    ) {
      this.isTyping = true;
      setTimeout(() => {
        this.isTyping = false;
      }, 10000);
    }
    this.changeDetection.detectChanges();
  }

  // push new message in current thread
  addMessage(data: any) {
    debugger
    let currentChat = this.chats.find((x) => x.threadId == data.threadId);
    if (currentChat) {
      currentChat.lastMessageReceivedOn = data.createdOn;
      if (
        this.threadId != currentChat.threadId &&
        data.sender.communicationUserId != this.ACSUserId
      ) {
        currentChat.unreadCount = currentChat.unreadCount + 1;
      }
    }
    this.chats = this.chats.sort(
      (b: conversation, a: conversation) =>
        a.lastMessageReceivedOn?.getTime() - b.lastMessageReceivedOn?.getTime()
    );
    if (this.chats.length > 0) {
      this.unReadCountList = [...this.chats.filter((x) => x.unreadCount > 0)];
    }
    if (this.threadId == data.threadId) {
      if (!this.messages.some((x) => x.id == data.id)) {
        let newMessage: message = {
          id: data.id,
          sender: data.senderDisplayName,
          message: data.message,
          isOwner: data.sender.communicationUserId == this.ACSUserId,
          createdOn: data.createdOn,
          isEdited: false,
        };
        this.messages.push(newMessage);
        this.messages = this.messages.sort(
          (b, a) => parseInt(a.id) - parseInt(b.id)
        );
        setTimeout(async () => {
          this.readReceipt();
        }, 1000);
        this.changeDetection.detectChanges();
      }
    }
  }

  // get all message of chat
  async getListMessages() {
    this.messages = [];
    const messages = <any>this.chatThreadClient?.listMessages();
    if (!messages) {
      return;
    }
    for await (const message of messages) {
      if (!message.deletedOn) {
        if (message.type == "text") {
          let msg: message = {
            id: message.id,
            sender: message.senderDisplayName,
            message: message.content.message,
            isOwner: message.sender.communicationUserId == this.ACSUserId,
            createdOn: message.createdOn,
            isEdited: message.editedOn,
          };
          this.messages.push(msg);
          this.messages = this.messages.sort(
            (b, a) => parseInt(a.id) - parseInt(b.id)
          );
        }
      }
    }

    this.changeDetection.detectChanges();
  }

  // check json
  checkJson(jsonString: string) {
    try {
      JSON.parse(jsonString);
      return true;
    } catch (error) {
      return false;
    }
  }

  // send new message
  async sendMessage() {
    if (!this.sendMsg.message) {
      return;
    }

    if (this.isEdit) {
      let updatedMessage = {
        content: this.sendMsg.message,
      };
      await this.chatThreadClient.updateMessage(
        this.sendMsg.id,
        updatedMessage
      );
      this.isEdit = false;
      this.selectedMessage = null;
    } else {
      let sendMessageRequest: SendMessageRequest = {
        content: this.sendMsg.message.toString(),
      };
      const sendChatMessageResult = await this.chatThreadClient?.sendMessage(
        sendMessageRequest,
        { senderDisplayName: this.userName, type: "text" }
      );
      if (!sendChatMessageResult) {
        return;
      }
    }
    this.showEmojiPicker = false;
    this.sendMsg = {
      id: "",
      message: "",
      sender: "",
      isOwner: false,
      isEdited: false,
    };
    this.isTyping = false;
    this.seenParticipantList = [];

    // alert("Send Meassge");
  }

  // delete chat Message
  async deleteMessage() {
    await this.chatThreadClient.deleteMessage(this.selectedMessage.id);
    this.selectedMessage = null;
  }

  // update message
  updateMessage() {
    this.isEdit = true;
    this.sendMsg.message = this.selectedMessage.message;
    this.sendMsg.id = this.selectedMessage.id;
    document.getElementById("sendmessageInput").focus();
    this.selectedMessage = null;
  }

  // delete chat thread
  async deleteChatThread(threadId) {
    await this.chatClient.deleteChatThread(threadId);
    this.chatopen = false;
  }

  // add emoji in message
  addEmoji(event: any) {
    this.sendMsg.message += event.emoji.native;
    document.getElementById("sendmessageInput").focus();
  }

  // open emoji picker
  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  // clear current message
  clearMessage() {
    this.isEdit = false;
    this.selectedMessage = null;
    this.sendMsg = {
      id: "",
      message: "",
      sender: "",
      isOwner: false,
      isEdited: false,
    };
  }

  // open Group info
  openGroupInfo() {
    this.groupChatOpen = true;
    this.contactopen = false;
    this.isGroupInfo = true;
    this.isEditGroupName = false;
    this.isGroupName = false;
    this.groupName = this.participantName;
    if (this.groupParticipantList.length === 0) {
      let currentChat = this.chats.find((x) => x.threadId == this.threadId);
      if (currentChat) {
        this.groupParticipantList = currentChat.participants;
      }
    }
  }

  // make a initial of chat topic
  getProfileCircleName(input) {
    if (input) {
      let value = input.trim().split(" ");
      if (value.length == 1) {
        return value[0][0] + value[0][1];
      } else {
        return value[0][0] + value[1][0];
      }
    }
  }

  // mouse enter event
  onMouseEnter(id) {
    document.getElementById("msg_" + id).classList.remove("menu-hide");
    document.getElementById("msg_" + id).classList.add("menu-visible");
  }

  // mouse out event
  onMouseOut(id) {
    document.getElementById("msg_" + id).classList.remove("menu-visible");
    document.getElementById("msg_" + id).classList.add("menu-hide");
  }

  // close group list
  closeGroupList() {
    this.groupChatOpen = false;
    this.contactlistopen = false;
    this.contactopen = true;
    this.isGroupName = false;
    this.groupName = null;
    this.isGroupInfo = false;
    this.isEditGroupName = false;
    this.closeGroupChat();
  }

  // update group name
  async updateGroupName() {
    if (!this.groupName) {
      return;
    }

    await this.chatThreadClient.updateTopic(this.groupName);
    this.isEditGroupName = false;
  }

  // remove participant from group
  async removeParticipant(participant) {
    let removeParticipant: CommunicationIdentifier = {
      communicationUserId: participant.userId,
    };
    await this.chatThreadClient.removeParticipant(removeParticipant);
  }

  // add participant from group
  async updateChatThreadParticipant() {
    let currentChat = this.chats.find((x) => x.threadId == this.threadId);

    if (currentChat) {
      currentChat.participants = await this.loadParticipants(
        currentChat.threadId
      );
      this.updateGroupNameAndParticipantCount(currentChat);
      this.changeDetection.detectChanges();
    }
  }

  // add new participant in existing group
  onClickGroupParticipant() {
    this.isGroupName = true;
    this.allContactsList = JSON.parse(JSON.stringify(this.allContacts));
    this.allContacts = this.allContacts.filter(
      (o1) => !this.groupParticipantList.some((o2) => o1.id === o2.userId)
    );
    this.allContacts.map(
      (x) => ((x.isSelected = false), (x.isShareHistory = false))
    );
  }

  // update group name and participant count
  updateGroupNameAndParticipantCount(chat) {
    this.participantName = this.groupName = this.getParticipant(chat);
    this.groupParticipantList = chat.participants;
    this.groupParticipantList.sort((a, b) =>
      a.userName.localeCompare(b.userName)
    );
    this.groupParticipantList.map(
      (x) => (x.userInitial = this.getProfileCircleName(x.userName.trim()))
    );
    this.groupParticipantsCount = chat.participants.length + " participants";
  }

  // display save button while creating new group
  visibleSaveButton() {
    return this.allContacts.filter((x) => x.isSelected).length > 0;
  }

  // click on share participant checkbox
  onClickShareHistoryButton(event, participant) {
    participant.isShareHistory = event.checked;
  }

  // open new group chat
  openGroupChat() {
    this.groupChatOpen = true;
    this.contactlistopen = false;
    this.contactopen = false;
    this.isGroupInfo = false;
    this.groupName = "";
    this.isGroupName = false;
    this.groupParticipantList = [];
    this.allContacts =
      this.allContactsList.length > 0 ? this.allContactsList : this.allContacts;
    this.allContacts.map(
      (x) => ((x.isSelected = false), (x.isShareHistory = false))
    );
  }

  // click on next button while creating new group
  onClickNextButton() {
    this.isGroupName = true;
    this.allContacts.map(
      (x) => ((x.isSelected = false), (x.isShareHistory = false))
    );
  }

  // open new chat
  openNewChat() {
    this.groupChatOpen = false;
    this.contactlistopen = true;
    this.contactopen = false;
    this.contactList = this.filteredContacts;
  }

  // close new chat
  closeNewChat() {
    this.groupChatOpen = false;
    this.contactlistopen = false;
    this.contactopen = true;
    this.searchChatText = null;
  }

  // close group chat
  closeGroupChat() {
    this.isGroupName = false;
    this.searchGroupText = null;
    this.allContacts = this.searchAllContacts;
  }

  // close chat
  closeChat() {
    this.chatopen = !this.chatopen;
    this.threadId = null;
    this.groupChatOpen = false;
    this.contactopen = true;
  }

  // search contact
  searchItems() {
    if (this.searchChatText) {
      this.contactList = this.filteredContacts.filter(
        (i) =>
          i.displayName
            .toLowerCase()
            .indexOf(this.searchChatText.toLowerCase()) > -1
      );
    } else {
      this.contactList = this.filteredContacts;
    }
  }

  // search group contacts
  searchGroupItems() {
    if (this.searchGroupText) {
      let filteredContacts =
        this.groupParticipantList.length > 0
          ? [
              ...this.searchAllContacts.filter(
                (o1) =>
                  !this.groupParticipantList.some((o2) => o1.id === o2.userId)
              ),
            ]
          : this.searchAllContacts;
      this.allContacts = filteredContacts.filter(
        (i) =>
          i.displayName
            .toLowerCase()
            .indexOf(this.searchGroupText.toLowerCase()) > -1
      );
    } else {
      this.allContacts = this.searchAllContacts;
    }
  }

  // search recent conversation
  searchRecentConversation() {
    if (this.searchText) {
      this.chats = this.recentConversationList.filter(
        (o1) =>
          o1.topic
            .toLocaleLowerCase()
            .trim()
            .includes(this.searchText.toLowerCase().trim()) ||
          o1.participants.some((o2) =>
            o2.userName
              .toLowerCase()
              .trim()
              .includes(this.searchText.toLowerCase().trim())
          )
      );
    } else {
      this.chats = this.recentConversationList;
    }
  }

  async startCall() {
    this.showCallCard = true;
    // this.Call.startCall(participantId);

    const userId = { communicationUserId: this.participantId };
    // start a call
    this.call = await this.callAgent.startCall([userId]);
    // const deviceManager = await this.callAgent.getDeviceManager();
    // this.showIncomingCallCard = this.Call.showIncomingCallCard;

    this.changeDetection.detectChanges();
  }

  async endCall() {
    this.showCallCard = false;
    this.showIncomingCallCard = false;
    this.showLocalVideoCard = false;
    this.showIncomingVideoCallCard = false;
    //this.Call.hangUp();
    this.VideoCall.hangUp();
  }

  async startVideoCall(participantId) {
    this.showLocalVideoCard = true;
    let view = await this.VideoCall.startVideoCall(participantId);
    document.getElementById("myVideo").appendChild(view.target);
  }

  acceptCallButton() {
    this.VideoCall.acceptCallButton();
  }

  muteCall() {
    if (this.MicStatus == "Unmute") this.MicStatus = "Mute";
    else this.MicStatus = "Unmute";
  }

  // open read recipient model
  openReadRecipientModel(event) {
    this.readRecipientModel.toggle(event);
    this.changeDetection.detectChanges();
  }

  async acceptVoiceCall() {
    this.call = await this.incomingCall.accept();
    this.showCallCard = false;
    this.changeDetection.detectChanges();
  }
}

interface message {
  id: string;
  sender?: string;
  message?: string;
  isOwner: boolean;
  createdOn?: Date;
  file?: File;
  image?: string;
  isEdited: boolean;
}

interface conversation {
  threadId: string;
  topic: string;
  participants?: any[];
  topicInitial: string;
  unreadCount: number;
  messageId?: string;
  lastMessageReceivedOn?: Date;
}
