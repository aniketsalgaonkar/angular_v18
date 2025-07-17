import { HttpClient } from '@angular/common/http';
// import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { Options } from 'selenium-webdriver';
// import { environment } from 'src/environments/environment';
import { environment } from '../../environments/environment';
// import { Topic } from '../Models/Topic';
import { Topic } from '../models/Topic';



@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  apiUrl: string = environment.apiUrl;
  constructor(private _http: HttpClient) { }

  getDatabase(ServerId) {
    return this._http.get(this.apiUrl + 'api/AdminPortal/GetDatabase?serverId='+ ServerId);
  }

  getTopic(TopicId) : Observable<Topic> {
    return this._http.get<Topic>(this.apiUrl + 'api/AdminPortal/GetTopic?topicId='+ TopicId);
  }

  updateTopic(TopicId, TopicContent) : Observable<boolean> {
    return this._http.post<boolean>(this.apiUrl + 'api/AdminPortal/UpdateTopic?topicId=' + TopicId, TopicContent);
  }

  saveTopic(topic) : Observable<boolean> {
    return this._http.post<boolean>(this.apiUrl + 'api/AdminPortal/SaveTopic', topic);
  }
}
