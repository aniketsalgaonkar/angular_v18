import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
//import { Observable } from 'rxjs/Observable';

const apiUrl = environment.apiUrl;
@Injectable(
    {
        providedIn: 'root'
    })
export class AzureCommunication {
    
    constructor(private _http: HttpClient) { }

    getContactList(UserName, ACSUserId) {
        return this._http.get(`${apiUrl}/${'api/ACS/GetContactList?UserName='+UserName} + &ACSUserId=` + ACSUserId);
    }

    getActiveThreads(UserName) {
        return this._http.get(`${apiUrl}/${'api/ACS/GetActiveThreads?UserName=' + UserName}`)
    }

    addNewParticipant(userId, threadId) {
        const data = new FormData();
        data.append("UserId", userId);
        data.append("threadId", threadId);
        // var data =participant;
        return this._http.post(`${apiUrl}/${'api/ACS/AddNewParticipant'}`, data);
    }
    assignACSUserID(username,acsUserId)
    {
        const data = new FormData();
        data.append("acsUserId", acsUserId);
        return this._http.post(`${apiUrl}/${'api/ACS/AssignACSUserId?UserName='+username}`, data);
    }
    getContactsForGroupChat(UserName, ACSUserId)
    {
        return this._http.get(`${apiUrl}/${'api/ACS/GetContactListForGroupChat?UserName='+UserName} + &ACSUserId=` + ACSUserId);
    }

    updateUnreadMessagesCount(UserId: any, threadId: any,messageCount:number) {
        const data=new FormData();
        data.append("UserId",UserId);
        data.append("threadId",threadId);
        return this._http.post(`${apiUrl}/${'api/ACS/UpdateUnreadMessagesCount?messageCount='+messageCount}`,data)
      }

      updateACSUserId(userId, acsUserId) {
        const data = new FormData();
        data.append("acsUserId", acsUserId);
        data.append("userId", userId);
        return this._http.post(`${apiUrl}/${"api/ACS/UpdateACSUserId"}`, data);
      }

      getAllUsers(){
        return this._http.get(`${apiUrl}/${"api/ACS/GetAllUsers"}`);
      }
}