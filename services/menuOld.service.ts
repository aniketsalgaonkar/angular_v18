import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { environment } from '../../environments/environment';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
//import { Observable } from 'rxjs/Observable';

const apiUrl = environment.apiUrl;
@Injectable(
    {
        providedIn: 'root'
    })
export class MenuOldService {


    constructor(private _http: HttpClient) { }

    getAppMenus(UserName: string, SubGroupID: number) {
        return this._http.get(`${apiUrl}/` + `api/Menu/GetAppMenus?username=${UserName}&SubGroupID=${SubGroupID}`);
    }
    GetApps(UserName: string) {
        return this._http.get(`${apiUrl}/` + `api/Menu/GetApps?username=${UserName}`);
    }

    getMenuList(UserName: string) {
        return this._http.get(`${apiUrl}/` + `api/Menu/GetMenuList?username=${UserName}`);
    }

    UpdateFrequentAndRecentMenus(menuID: number, UserName: string) {
        return this._http.get(`${apiUrl}/` + `api/Menu/UpdateFrequentAndRecentMenus?menuId=${menuID}&username=${UserName}`);
    }

    getSubGroup(UserName) {
        console.log(apiUrl);
        return this._http.get(`${apiUrl}/` + `api/Menu/GetSubGroup_ng7?username=${UserName}`);
    }
    /*This code snippet is for JWT authorization
    /*Use Headers with Authorization 'Bearer and token 
   /*  getSubGroup(UserName) {
        console.log(apiUrl);
        let token = localStorage.getItem("jwt");
        console.log('Menu SubGroup Token: - '+ token)
    return this._http.get(`${apiUrl}/` + `api/Menu/GetSubGroup_ng7?username=${UserName}`, {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      })
    })  */



    getmenus(id, UserName) {
        console.log(apiUrl);
        //console.log(url);
        return this._http.get(`${apiUrl}/` + `api/Menu/GetMenus?ParentID=${id}&username=${UserName}`);
    }

    public getJSON(): Observable<any> {
        return this._http.get("./assets/mainpage_routing.json", { responseType: 'text' as 'json' })
    }
    getAllMenus(UserName) {
        return this._http.get(`${apiUrl}/` + `api/Menu/GetAllMenus?username=${UserName}`);
    }


}
