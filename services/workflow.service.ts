import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
// import { Headers, RequestOptions, ResponseContentType } from "@angular/common/http";
import { fromEvent, merge, of, from, throwError } from 'rxjs';
import { mapTo, catchError } from "rxjs/operators";

import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
//import { ServerSideColumn } from '../Models/ServersideColumn';
//import { Module } from '../Models/Module';
//import { Observable } from 'rxjs/Observable';


const apiUrl = environment.apiUrl;
@Injectable(
    {
        providedIn: 'root'
    })
export class WorkFlowService {


    constructor(private _http: HttpClient) {
    }

    validateDataset(datasets: any[], sp: string) {
        const data: FormData = new FormData();
        let UserName: string = localStorage.getItem("username") || "";
        data.append('dataset', JSON.stringify(datasets));
        return this._http.post(`${apiUrl}/${'api/workflow/validateDataset?storedProcedure=' + sp + '&UserName=' + UserName}`, data);
    }

    RunWorkflowTask(Run_ID:any, ScenarioId:any, username:any, dataset:any,AppId:any) {
         const data: FormData = new FormData();
        return this._http.post(`${apiUrl}/api/Workflow/RunWorkflowTask?RowValue=${Run_ID}&ScenarioId=${ScenarioId}&UserName=${username}&dataset=${dataset}&AppId=${AppId}`, data);
    }

    CreateOrUpdateDataset(tableName: string, username: string,AppId:any, isAppend?:boolean) {
        debugger;
        // const data: FormData = new FormData();
        // data.append('isAppend', isAppend.toString());
        return this._http.get(`${apiUrl}/api/Workflow/CreateOrUpdateDataset?tablename=${tableName}&username=${username}&AppId=${AppId}&IsAppend=${isAppend}`);
    }
    saveAllModules(menuId:any, UserName:any, AppId:any, data:any) {
        return this._http.post(`${apiUrl}/${'api/Workflow/SaveAllModules?Id=' + menuId + '&UserName=' + UserName + '&AppId=' + AppId}`, data)
    }
    getDatasetList(username:any, AppId:any) {
        return this._http.get(`${apiUrl}/${'api/Workflow/getDatasetList?username=' + username+'&AppId=' + AppId}`)
    }
   
    ValidateDataset(menuId: number, UserName:any, AppId:any,table_list:any) {
        const data: FormData = new FormData();
        data.append("table_list",JSON.stringify(table_list));
        return this._http.post(`${apiUrl}/${'api/Workflow/ValidateDataset?MenuId=' + menuId + '&UserName=' + UserName + '&AppId=' + AppId}`,data);
    }

    getInvalidData(ModuleId: any, UserName: string) {
        return this._http.get(`${apiUrl}/${'api/RuleEngine/getInvalidData?ModuleId='+ModuleId+'&username=' + UserName}`)
    }

    SaveValidData(validData: any[], ModuleId:number,UserName: any, AppId: number) {
        const data:FormData=new FormData();
        data.append("ValidData",JSON.stringify(validData));
        return this._http.post(`${apiUrl}/${'api/RuleEngine/SaveValidData?ModuleId='+ModuleId+'&appId='+AppId+'&username=' + UserName}`,data);
    }


}
