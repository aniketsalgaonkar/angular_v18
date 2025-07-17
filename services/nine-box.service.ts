import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
// import { environment } from "src/environments/environment";
import { environment } from "../../environments/environment";

@Injectable(
    {
        providedIn: 'root'
    })
export class NineBoxService {
    apiUrl = environment.apiUrl;
    constructor(private http: HttpClient) {
    }
    getData(moduleId, menuId, username, data): Observable<any> {
        return this.http.post<any>(this.apiUrl + 'api/NineBox/GetNineBox?moduleId=' + moduleId + '&menuId=' + menuId + '&username=' + username, data);
    }
}