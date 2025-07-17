import { HttpClient } from '@angular/common/http';
// import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { Options } from 'selenium-webdriver';
// import { environment } from 'src/environments/environment';
import { environment } from '../../environments/environment';
// import { CreateNode } from '../Models/CreateNode';
import { CreateNode } from '../models/CreateNode';
// import { Node } from '../Models/Node';
import { Node } from '../models/Node';

@Injectable({
  providedIn: 'root'
})
export class DocumentManagementService {
 

  apiUrl: string = environment.apiUrl;
  constructor(private _http: HttpClient) { }

  getDocumentNodes(username)
  {
    return this._http.get(this.apiUrl + 'api/DMS/GetDocumentNodes?username='+ username);
  }

  getNodeData(nodeId: any) {
    return this._http.get(this.apiUrl+ 'api/DMS/GetNodeData?nodeId='+ nodeId)
  }

  AddParentNode(createNode: CreateNode){
    return this._http.post(this.apiUrl+ 'api/DMS/AddChildNode', createNode);
  }

  AddNextLevel(createNode: CreateNode){
    return this._http.post(this.apiUrl+ 'api/DMS/AddChildNode', createNode);
  }

  AddContent(content,nodeid){
    var data=new FormData();
    data.append('content',content);
    return this._http.post(this.apiUrl+'api/DMS/AddContent?nodeid='+nodeid,data);
  }
  
  EditLabel(Nodename:string,NodeID){
    var data=new FormData();
    data.append('nodeName',Nodename)
    return this._http.post(this.apiUrl+'api/DMS/EditNode?nodeID='+NodeID, data);
  }

  DeleteNode(NodeID) {
    var data=new FormData();
    return this._http.post(this.apiUrl+'api/DMS/Delete?nodeid='+ NodeID, data);
  }

  UpdateSequenceNumber(node: Node) {
    return this._http.post(this.apiUrl + 'api/DMS/updatesequencenumber', node)
  }

  getUser() {
    return this._http.get(this.apiUrl + 'api/DMS/users');
  }

}
