import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse, HttpEventType } from '@angular/common/http';
// import { Headers, RequestOptions, ResponseContentType } from "@angular/common/http";
import { fromEvent, merge, of, from, throwError, BehaviorSubject, forkJoin } from 'rxjs';
import { mapTo, catchError, map } from "rxjs/operators";

import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
//import { ServerSideColumn } from '../Models/ServersideColumn';
//import { Module } from '../Models/Module';
//import { Observable } from 'rxjs/Observable';


const apiUrl = environment.apiUrl;

class DataTablesResponse {
    data: any[];
    draw: number;
    recordsFiltered: number;
    recordsTotal: number;
}

@Injectable(
    {
        providedIn: 'root'
    })
export class MainPageService {
    online$: Observable<boolean>;
    headers = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };
    filterData: '"Filter":{"Entity":"2"}';
    columnHeader: any;
    UserName: string;
    onlineFlag: any;
    Module: any;
    dymDataCache = new Map();
    private dataMeasureMap = new Map<string, string>();

    constructor(private _http: HttpClient) {
        this.onlineFlag = navigator.onLine;
        console.log(this.onlineFlag);
    }

    //getListModule(MenuID, UserName): Observable<Module[]> {
    //    return this._http.get<Module[]>(`${apiUrl}/${'api/Page/GetListModule?UserName=' + UserName + '&MenuNo=' + MenuID}`);
    //}
    getmodules(MenuID, UserName) {
        //alert('getmodules');
        //console.log(apiUrl);
        return this._http.get(`${apiUrl}/${'api/Page/GetModules?Id=' + MenuID + '&UserName=' + UserName}`);
    }
    getdata() {
        return this._http.get(`${'https://jsonplaceholder.typicode.com/photos'}`);
    }
    //GetColumnsForDataTable(MenuID, UserName): Observable<ServerSideColumn[]> {

    //    return this._http.get<ServerSideColumn[]>(`${apiUrl}/${'api/Page/GetColumnsForDataTable_AG_6?Id=' + MenuID + '&UserName=' + UserName}`, { responseType: 'json' });

    //}



    getPageMenuDetails(MenuID, UserName) {
        //alert('call');
        return this._http.get(`${apiUrl}/${'api/Page/GetPageMenuDetail?UserName=' + UserName + '&MenuNo=' + MenuID}`);
    }


    Savedata(ModuleID, data, username, AppId?: number, filter?: any) {

        return this._http.post(`${apiUrl}/${'api/Page/SaveModules_v1?id=' + ModuleID + '&username=' + username + '&AppId=' + AppId + '&FilterData=' + filter}`, data)

    }

    SaveDatatable(ModuleID, data, username, AppId?: number) {
        return this._http.post(`${apiUrl}/${'api/Page/SaveDataTable?id=' + ModuleID + '&username=' + username + '&AppId=' + AppId}`, data)

    }

    GetDecryptedPassword(password: string) {
        return this._http.post(`${apiUrl}/api/Login/GetDecryptedPassword`, { password });
    }

    GetEncryptedPassword(password: string) {
        return this._http.post(`${apiUrl}/api/Login/GetEncryptedPassword`, { password });
    }



    SaveSubmodules(ModuleID, form, dt, username, AppId?: number) {
        var data = new FormData();
        data.append("Form", JSON.stringify(form));
        data.append("Tables", JSON.stringify(dt));
        return this._http.post(`${apiUrl}/${'api/Page/SaveSubmodules?id=' + ModuleID + '&username=' + username + '&AppId=' + AppId}`, data)
    }

    UpdateSubmodules(ModuleID: any, form: any, dt: any, ButtonId: number, username: string) {
        var data = new FormData();
        data.append("Form", JSON.stringify(form));
        data.append("Tables", JSON.stringify(dt));
        return this._http.post(`${apiUrl}/${'api/Page/SaveSubmodulesButtonConfig?Id=' + ModuleID + '&ButtonId=' + ButtonId + '&UserName=' + username}`, data)
    }

    Savedata1(ModuleID, data, username, httpdata) {

        //debugger;

        //alert("You are in Mainpage.service.ts " +username);

        var formData = new FormData();

        console.log('data :-' + data);
        console.log('File Name :- ' + httpdata.name + ' File Data :-' + httpdata.FileData);
        formData.append('data', data);
        formData.append(httpdata.name, httpdata.FileData);
        console.log(JSON.stringify(formData));
        return this._http.post(`${apiUrl}/${'api/Page/SaveModules?id=' + ModuleID + '&username=' + username}`, formData);
    }

    Savedata1_backup(ModuleID, data, username, httpdata) {
        // alert("You are in Mainpage.service.ts " +username);
        // var headers = new Headers();
        // headers.append("Accept", 'application/json');
        // headers.append('Content-Type', 'multipart/form-data');
        // const requestOptions = new RequestOptions({ headers: headers });

        data.append('blob', httpdata);
        console.log(data);
        //data.append('blob',httpdata);
        return this._http.post(`${apiUrl}/${'api/Page/SaveModules?id=' + ModuleID + '&username=' + username}`, data);
    }

    // return this._http.post(`${apiUrl}/${'api/Page/SaveModules?id='+ModuleID+'&username=' +username}`, data)


    uploadFileToBLOB(formData) {


        this._http.post(`${apiUrl}/${'api/AzureBlob/UploadToBLOB'}`, formData)
            .subscribe(
                (event: any) => {
                    if (event.type === HttpEventType.UploadProgress) {
                        const percentDone = Math.round(100 * event.loaded / event.total);
                        console.log(`File is ${percentDone}% uploaded.`);
                    } else if (event.type === HttpEventType.Response) {
                        console.log('File upload successful:', event.body);
                    }
                },
                (error: any) => {
                    console.error('File upload error:', error);
                }
            );
    }

    postFile(fileToUpload: File, username, columnHeader) {
        const data: FormData = new FormData();
        data.append('fileKey', fileToUpload);
        // const data='{"file":"'+fileToUpload.name+'""}'
        console.log(data);
        return this._http.post(`${apiUrl}/${'api/Page/UploadJsonFile?columnHeader=' + columnHeader + '&UserName=' + username}`, data
        )/*
        .subscribe(
        data  => {
        console.log("POST Request is successful ", data);
        },
        error  => {

        console.log("Error", error);

        }

        );*/
    }

    postFile1(data: FormData, username, columnHeader) {

        return this._http.post(`${apiUrl}/${'api/Page/UploadJsonFile?columnHeader=' + columnHeader + '&UserName=' + username}`, data
        ).pipe(catchError(this.errorhandler));
    }
    public errorhandler(error: HttpErrorResponse) {
        console.log('error', error);
        return throwError(error.message);
    }

    SaveJsData(ModuleID, data, username) {

        const body = new HttpParams()

            .set('data', data);

        return this._http.post(`${apiUrl}/${'api/Page/SaveModuleJson?id=' + ModuleID + '&username=' + username}`, body, { responseType: 'text' })

    }

    exporttoexcel(menuid, UserName, filter) {
        //console.log("data",JSON.stringify(data));
        //var datasend=JSON.stringify(data);
        //const body = new HttpParams()
        //    .set('data', data);
        var data = {};
        data["Filter"] = filter;
        return this._http.post(`${apiUrl}/${'api/Page/ExportToexcel?MenuId=' + menuid + '&UserName=' + UserName}`, data, { responseType: 'arraybuffer', headers: { 'Content-Type': 'application/json' } });
    }


    GetModulesWithFilter(MenuID, UserName, data, AppId?: number) {
        console.log("You are in getmoduleswithfilter");
        return this._http.post(`${apiUrl}/${'api/Page/GetModulesWithFilters_v1?Id=' + MenuID + '&UserName=' + UserName + '&AppId=' + AppId}`, data, this.headers);

    }

    GetPaginatedTreeTable(MenuID, UserName, data) {
        console.log("You are in GetPaginatedTreeTable");
        return this._http.post(`${apiUrl}/${'api/Page/GetPaginatedTreeTable?Id=' + MenuID + '&UserName=' + UserName}`, data, this.headers);

    }

    //SaveTreetable(ModuleID: number, data1: string, username: string, treetableModuleIndex?: number, appId?: number): any {
    //    var data = new FormData();
    //    data.append('files', data1);
    //    return this._http.post(`${apiUrl}/${'api/Page/SaveTreeTable?id=' + ModuleID + '&index=' + treetableModuleIndex + '&username=' + username + '&AppId=' + appId}`, data);
    //}
    SaveTreetable(ModuleID: number, data1: string, username: string, filter: any, treetableModuleIndex?: number, appId?: number): any {
        var data = new FormData();
        data.append('files', data1);
        data.append('Filter', filter);
        return this._http.post(`${apiUrl}/${'api/Page/SaveTreeTable?id=' + ModuleID + '&index=' + treetableModuleIndex + '&username=' + username + '&AppId=' + appId}`, data);
    }



    //Get Mails
    GetMails(UserName) {
        debugger;
        return this._http.get(`${apiUrl}/` + `api/Email/GetMails?username=${UserName}`);

    }
    //Table Save Added On:May 17 2019
    SaveModule(ModuleID, data, username) {
        //const body=new HttpParams()
        //.set('data',data);
        //return this._http.post(`${apiUrl}/${'api/Page/SaveModuleJson?id=' + ModuleID + '&username=' + username}`, data, {responseType:'text', headers: { 'Content-Type': 'application/json; charset=utf-8'}  })
        return this._http.post(`${apiUrl}/${'api/Page/SaveModule?id=' + ModuleID + '&username=' + username}`, data)

    }

    GenerateReport(reporttype, username, data) {

        //const body=new HttpParams()
        //.set('data',data);

        //return this._http.post(`${apiUrl}/${'api/Page/SaveModuleJson?id=' + ModuleID + '&username=' + username}`, data, {responseType:'text', headers: { 'Content-Type': 'application/json; charset=utf-8'}  })
        //return this._http.post(`${apiUrl}/${'api/Report/ExportReport?reporttype=' + reporttype + '&username=' + username}`, data,this.headers)
        return this._http.post(`${apiUrl}/${'api/Report/ExportReport?reporttype=' + reporttype + '&username=' + username}`, data, { responseType: 'blob', headers: { 'Content-Type': 'application/json' } });
    }

    SendReport(reporttype, username, data) {
        return this._http.post(`${apiUrl}/${'api/Report/SendReport?reporttype=' + reporttype + '&username=' + username}`, data, { responseType: 'blob', headers: { 'Content-Type': 'application/json' } })
    }
    GenerateOTPEmail(Email) {
        return this._http.get(`${apiUrl}/${'api/Login/SendOTPEmail_v1?Email_Id=' + Email}`);
    }

    getDependentDropDownValue(ModuleDetailId, Id) {
        return this._http.get(`${apiUrl}/${'api/Page/GetDependentDropDownValue?ModuleDetailId=' + ModuleDetailId + '&Id=' + Id}`)
    }

    GetDependentTextBoxValue(moduledetailid, Param1, Param2, username) {
        return this._http.get(`${apiUrl}/${'api/Page/GetDependentTextBoxValue?ModuleDetailId=' + moduledetailid + '&Param1=' + Param1 + '&Param2=' + Param2 + '&Username=' + username}`)
    }
    GetDashboardMenu(username) {
        return this._http.get(`${apiUrl}/${'api/Menu/GetDashboardMenu?Username=' + username}`)
    }
    GetDependentDropDownThroughValue(ModuleDetailId, Id) {
        return this._http.get(`${apiUrl}/${'api/Page/GetDependentDropDownThroughValue?ModuleDetailId=' + ModuleDetailId + '&Id=' + Id}`)
    }


    GetFabMenus(UserName, ParentMenuID, roleid) {

        let data: any;
        return this._http.get(`${apiUrl}/${'api/Menu/GetFabMenus?username=' + UserName + '&ParentMenuID=' + ParentMenuID + '&RoleId=' + roleid}`);

    }
    UpdateData(ModuleID: any, ButtonId: number, data: any, username: string) {
        return this._http.post(`${apiUrl}/${'api/Page/SaveModulesButtonConfig?Id=' + ModuleID + '&ButtonId=' + ButtonId + '&UserName=' + username}`, data)
    }

    UpdateDatatable(ModuleID: any, ButtonId: number, data: any, username: string) {
        return this._http.post(`${apiUrl}/${'api/Page/SaveDatatableButtonConfig?Id=' + ModuleID + '&ButtonId=' + ButtonId + '&UserName=' + username}`, data)
    }

    //for get the feedback data
    GetFeedback(MenuID, UserName, data) {

        console.log("You are in getmoduleswithfilter");
        return this._http.post(`${apiUrl}/${'api/Page/GetFeedback?Id=' + MenuID + '&UserName=' + UserName}`, data, this.headers);

    }
    //to save the feedback data
    SaveFeedback(MenuId, data, username) {
        return this._http.post(`${apiUrl}/${'api/Page/SaveFeedback?id=' + MenuId + '&username=' + username}`, data)

    }
    RunWorkflowTask(ID, username, data) {
        return this._http.post(`${apiUrl}/api/Page/RunWorkflowTask?RowValue=${ID}&UserName=${username}`, data);
    }
    RunWorkflowTask1(ID, username, data, AppId) {
        //var data = new FormData();
        if (!(data instanceof FormData)) {
            data = new FormData();
        }
        data.append('AppId', AppId);
        return this._http.post(`${apiUrl}/api/Page/RunWorkflowTask?RowValue=${ID}&UserName=${username}`, data);
    }

    getDependentFilterDropDownValue(ModuleDetailId, Id) {
        return this._http.get(`${apiUrl}/${'api/Page/GetDependentFilterDropDownValue?ParameterId=' + ModuleDetailId + '&Id=' + Id}`)
    }

    getModulesToShow(MenuID, UserName) {
        return this._http.get(`${apiUrl}/${'api/Page/GetModulesToShow?MenuID=' + MenuID + '&UserName=' + UserName}`)
    }

    getModuleDetailIdToHide(MenuID, UserName) {
        return this._http.get(`${apiUrl}/${'api/Page/GetModuleDetailIDToHide?MenuID=' + MenuID + '&UserName=' + UserName}`)
    }
    Savedata_file(fileToUpload: Array<File>, ModuleID, data, username) {
        const data1: FormData = new FormData();
        data1.append('data', JSON.stringify(data));
        fileToUpload.forEach((item) => {
            data1.append('file[]', item);
        })
        return this._http.post(`${apiUrl}/${'api/Page/SaveModules_v1?id=' + ModuleID + '&username=' + username}`,
            data1)

    }


    SavePrimeNgDatatable(ModuleID, data1, username) {
        var data = new FormData();
        data.append('files', data1);
        return this._http.post(`${apiUrl}/${'api/Page/SavePrimeNgTable?id=' + ModuleID + '&username=' + username}`, data)

    }
    SavePrimeNgTable(MenuID, ModuleID, data1, username, filter) {

        var data = new FormData();
        data.append('files', data1);
        data.append('filter', filter);
        return this._http.post(`${apiUrl}/${'api/Page/SavePrimeNgTable?id=' + ModuleID + '&username=' + username + '&MenuId=' + MenuID}`, data);
    }
    SavePrimeNgTable1(ModuleID, MenuId, data, username, AppId?: number) {

        return this._http.post(`${apiUrl}/${'api/Page/SavePrimeNgTable?Id=' + ModuleID + '&menuId=' + MenuId + '&UserName=' + username + '&AppId=' + AppId}`, data);
    }
    GetPivotTableModule(MenuId: number, ID: number, UserName: string, filter: any) {
        var data = {};
        data["Filter"] = filter;
        return this._http.post(`${apiUrl}/${'api/Page/GetPivotTableModule?Id=' + ID + '&MenuId=' + MenuId + '&UserName=' + UserName}`, data);
    }

    UpdateDatatablewithfilter(ModuleID: any, menuId, ButtonId: number, data: any, username: string) {
        return this._http.post(`${apiUrl}/${'api/Page/SaveDatatableButtonConfig?Id=' + ModuleID + '&menuId=' + menuId + '&ButtonId=' + ButtonId + '&UserName=' + username}`, data, this.headers)
    }

    getImage(path: string) {
        return this._http.get(`${apiUrl}/${'api/Page/GetImage?path=' + path}`, { responseType: 'text' });
    }
    //Notifications:
    getNotifications(UserName) {
        return this._http.get(`${apiUrl}/${'api/Page/GetDesktopNotifications?UserName=' + UserName}`);
    }
    AddReadInAppNotifications(UserName, InAppID) {
        return this._http.post(`${apiUrl}/${'api/Page/AddReadInAppNotifications?UserName=' + UserName +
            '&InAppID=' + InAppID}`,
            {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/x-www-form-urlencoded')
            }
        );

    }

    private notificationCount = new BehaviorSubject<number>(0);
    private badgeValue = 0;
    notificationCount$ = this.notificationCount.asObservable();

    incrementNotificationCount() {
        this.UserName = localStorage.getItem('username');
        // this.GetBadgeValue(this.UserName).subscribe((response: number) => this.badgeValue = response)
        this.GetBadgeValue(this.UserName).subscribe((response: number) => {
            this.notificationCount.next(response);
        });
    }
    GetBadgeValue(UserName) {
        return this._http.get(`${apiUrl}/${'api/Page/GetBadgeValue?username=' + UserName}`);
    }

    MultipleDependentDropdown(moduledetailid, value, sp, username) {
        var data = {};
        data["value"] = value;
        return this._http.post(`${apiUrl}/${'api/Page/GetValuesForMultipleDependantDropdown?Id=' + moduledetailid + '&DependantSP=' + sp + '&username=' + username}`, data);

    }


    AutoPopulateMultipleFields(value: any, AutoPopulateSP: any, UserName: string) {
        var data = {};
        data["value"] = value;
        return this._http.post(`${apiUrl}/${'api/Page/AutoPopulateMultipleFields?AutoPopulateSP=' + AutoPopulateSP + '&username=' + UserName}`, data);
    }


    // Excel Reporting Changes
    uploadFile(file, username, columnHeader, tableName?: string, isAppend?: boolean, ExcelSheetNames?: string) {
        const data: FormData = new FormData();
        data.append('file', file, file.Name);
        data.append('isAppend', isAppend.toString());
        return this._http.post(`${apiUrl}/${'api/Page/UploadJsonFile?columnHeader=' + columnHeader + '&UserName=' + username + '&table_name=' + tableName + '&ExcelSheetNames=' + ExcelSheetNames}`, data)
    }

    exporttoexcelModulewise(moduleId, UserName, data, AppId?: number) {
        return this._http.post(`${apiUrl}/${'api/Page/ExportToexcelModulewise?ModuleId=' + moduleId + '&UserName=' + UserName + '&AppId=' + AppId}`, data, { responseType: 'arraybuffer', headers: { 'Content-Type': 'application/json' } });
    }

    GetDependentDropDownFormtable(ModuleDetailId, Id) {
        return this._http.get(`${apiUrl}/${'api/Page/GetDependentDropDownValueFormTable?ModuleDetailId=' + ModuleDetailId + '&Id=' + Id}`)
    }


    //test:ankita
    UpdatePrimeNgTables(MenuID, ModuleID, data1, username, ModuleName?, otModuleName?, filepath?) {

        var data = new FormData();
        data.append('data', JSON.stringify(data1));
        data.append('filepath', filepath);
        data.append('otModuleName', JSON.stringify(otModuleName));
        // var datasend={};
        debugger;
        return this._http.post(`${apiUrl}/${'api/Page/UpdateExcel1?Id=' + ModuleID + '&username=' + username + '&MenuId=' + MenuID + '&ModuleName=' + ModuleName}`, data);
    }
    UpdatePrimeNgTables1(MenuID, ModuleID, data1, username, ModuleName?, otModuleName?, filepath?) {

        var data = new FormData();
        data.append('data', JSON.stringify(data1));
        data.append('filepath', filepath);
        data.append('otModuleName', JSON.stringify(otModuleName));
        // var datasend={};
        debugger;
        return this._http.post(`${apiUrl}/${'api/Page/UpdateExcel1?Id=' + ModuleID + '&username=' + username + '&MenuId=' + MenuID + '&ModuleName=' + ModuleName}`, data);
    }
    populateDropdown(columnName: any, filterValue: any, dropdownSP, username) {
        return this._http.get(`${apiUrl}/${'api/Page/GetDropdownValuesWithFilter?columnName=' + columnName + '&filterValue=' + filterValue + '&dropdownSP=' + dropdownSP + '&username=' + username}`)
    }



    FilterDropdownValues(filterByList: any[], dropdownSP, UserName: string) {
        var data = new FormData();
        data.append('filterData', JSON.stringify(filterByList));
        return this._http.post(`${apiUrl}/${'api/Page/FilterDropdownValues?username=' + UserName + '&dropdownSP=' + dropdownSP}`, data);
    }

    downloadpdf(UserName, filepath) {
        var data = new FormData();
        data.append('filepath', filepath);
        return this._http.post(`${apiUrl}/${'api/Page/downloadpdf?UserName=' + UserName}`, data, { responseType: 'blob' });

    }
    downloadexcel(UserName, filepath) {
        var data = new FormData();
        data.append('filepath', filepath);
        return this._http.post(`${apiUrl}/${'api/Page/downloadexcel?UserName=' + UserName}`, data, { responseType: 'blob' });

    }

    populateModuleData(moduleId: number, menuId: number, username: string, data: any, storedProc: string, AppId: number, NotificationParameterListCount?: number) {
        return this._http.post(`${apiUrl}/${'api/Page/PopulateModuleData?ModuleId='
            + moduleId + '&MenuId=' + menuId + '&UserName=' + username + '&storedProc=' + storedProc + '&AppId=' + AppId + '&NotificationParameterList=' + NotificationParameterListCount}`, data);
    }

    getTreeTableData(moduleId: number, menuId: number, username: string, data: any, storedProc: string, AppId: number) {
        return this._http.post(`${apiUrl}/${'api/Page/GetTreeTableData?ModuleId='
            + moduleId + '&MenuId=' + menuId + '&UserName=' + username + '&storedProc=' + storedProc + '&AppId=' + AppId}`, data);
    }

    getTreeData(moduleId: number, menuId: number, username: string, data: any, storedProc: string, AppId: number) {
        return this._http.post(`${apiUrl}/${'api/Page/GetTreeData?ModuleId='
            + moduleId + '&MenuId=' + menuId + '&UserName=' + username + '&storedProc=' + storedProc + '&AppId=' + AppId}`, data);
    }

    GetPivotedData(moduleId: number, menuId: number, username: string, data: any, storedProc: string, AppId: number) {
        return this._http.post(`${apiUrl}/${'api/Page/GetPivotedData?ModuleId='
            + moduleId + '&MenuId=' + menuId + '&UserName=' + username + '&storedProc=' + storedProc + '&AppId=' + AppId}`, data);
    }

    GetPageWithoutModuleData(MenuID: number, UserName: string, AppId: number) {
        return this._http.get(`${apiUrl}/${'api/Page/GetPageWithoutModuleData?MenuId=' + MenuID + '&UserName=' + UserName + '&AppId=' + AppId}`);
    }

    GetRules(moduleId: number, menuId: number, username: string, data: any, storedProc: string, AppId: number) {

        return this._http.post(`${apiUrl}/${'api/Page/GetRules?ModuleId=' + moduleId + '&MenuId=' + menuId + '&UserName=' + username + '&storedProc=' + storedProc + '&AppId=' + AppId}`, data);

    }

    menuFlowData(UserName, appID) {
        return this._http.get(`${apiUrl}/${'api/Page/menuFlowData?UserName=' + UserName + '&appID=' + appID}`)
    }

    GetDataSaviUsername(EmailId) {
        return this._http.get(`${apiUrl}/` + `api/Login/GetDataSaviUsername?EmailId=${EmailId}`);
    }

    // SaveTableToDataset(UserName, sqlTableName, IsAppend, dt) {
    //     debugger;
    //     var data = new FormData();
    //     data.append('data', JSON.stringify(dt));
    //     return this._http.post(`${apiUrl}/${'api/workflow/ImportTableToDataset?UserName=' + UserName + '&sqlTableName=' + sqlTableName + '&IsAppend=' + IsAppend}`, data);
    // }
    SaveTableToDataset(UserName, sqlTableName, IsAppend, dt, chunkSize = 500) {
        const chunks = [];
        // Split data into chunks of size `chunkSize`
        for (let i = 0; i < dt.length; i += chunkSize) {
            chunks.push(dt.slice(i, i + chunkSize));
        }

        const observables = [];
        // Collect observables for each chunk
        for (const chunk of chunks) {
            const data = new FormData();
            data.append('data', JSON.stringify(chunk));

            // Create an observable for each HTTP request and store it in the observables array
            const observable = this._http.post(`${apiUrl}/api/workflow/ImportTableToDataset?UserName=${encodeURIComponent(UserName)}&sqlTableName=${encodeURIComponent(sqlTableName)}&IsAppend=${IsAppend}`, data)
                .pipe(
                    catchError(error => {
                        console.error('Error sending chunk', error);
                        return of(null);  // Return a safe value to continue processing
                    })
                );

            observables.push(observable);
        }

        // Return an observable that emits when all chunks are processed
        return forkJoin(observables);  // This combines all observables into one

        // debugger;
        // var data = new FormData();
        // data.append('data', JSON.stringify(dt));
        // return this._http.post(`${apiUrl}/${'api/workflow/ImportTableToDataset?UserName=' + UserName + '&sqlTableName=' + sqlTableName + '&IsAppend=' + IsAppend}`, data);
    }

    validateData(UserName: string, ImportToTable: any, error_dt: any) {
        var data = new FormData();
        data.append('data', JSON.stringify(error_dt));
        return this._http.post(`${apiUrl}/${'api/workflow/ValidateImportData?tableName=' + ImportToTable}`, data)
    }
    downloadTableSchema(tableName, UserName, data, AppId?: number) {
        return this._http.post(`${apiUrl}/${'api/Page/DownloadTableSchema?TableName=' + tableName + '&UserName=' + UserName + '&AppId=' + AppId}`, data, { responseType: 'arraybuffer', headers: { 'Content-Type': 'application/json' } });
    }

    CalculateExcelChanges(MenuID, ModuleID, data1, username, ModuleName) {
        var data = new FormData();
        data.append('data', JSON.stringify(data1));
        return this._http.post(`${apiUrl}/${'api/Page/CalculateExcelChanges?Id=' + ModuleID + '&username=' + username + '&MenuId=' + MenuID + '&ModuleName=' + ModuleName}`, data);
    }

    getDYMfilter(moduleid, data, moduleDetails, ranges) {

        var response = this.dymDataCache.get(Object.values(ranges).join('-'));

        if (response) return of(response);

        var module = new FormData();
        module.append("ModuleDetails", JSON.stringify(moduleDetails));
        module.append('FilterData', JSON.stringify(data))
        return this._http.post(`${apiUrl}${'api/Page/Getdymfilter?moduleId=' + moduleid}`, module).pipe(
            map(response => {
                this.dymDataCache.set(Object.values(ranges).join('-'), response);
                console.log(this.dymDataCache)
                return response;
            })
        );
    }

    GetModuleChartTable(chartId: number, data: any) {
        return this._http.post(`${apiUrl}${'api/Page/GetListOfChartData?ModuleId=' + chartId}`, data);
    }

    GetSubmoduleTileGroupData(username, subModuleId) {
        return this._http.get(`${apiUrl}${'api/Page/GetSubmoduleTileGroupData?UserName=' + username + '&subModuleId=' + subModuleId}`);
    }

    getPivot(index: string, pivot_column: string, value: string, aggregate_: string, input_sp_or_query: string) {
        const data: FormData = new FormData();

        const url = 'http://www.pivotfastapi.datasavi.in/dj';
        const params: {
            url: string,
            input_sp_or_query: string;
            index: string;
            aggregate_?: string;
            pivot_column?: string;
            value?: string;
        } = {
            url: url,
            input_sp_or_query,
            //environment: 'development',
            index: index

        };

        if (aggregate_ !== null) {
            params.aggregate_ = aggregate_;
        }

        if (pivot_column !== null) {
            params.pivot_column = pivot_column;
        }

        if (value !== null) {
            params.value = value;
        }

        let UserName = localStorage.getItem('username');

        // return this._http.post(url, null, { params });
        // return this._http.post(`${apiUrl}api/Page/GetDataFromPythonAPI?apiUrl=${encodeURIComponent(url)}&userName=${UserName}`, params);
        return this._http.post(`${apiUrl}/api/Page/GetDataFromPythonAPI?userName=${UserName}`, params);

    }

    saveViewName(pivotView) {
        return this._http.post(`${apiUrl}${'api/Page/saveview'}`, pivotView, this.headers);
    }
    SaveTreetable1(ModuleID: number, data1: string, username: string, filter: any, treetableModuleIndex?: number, appId?: number): any {
        var data = new FormData();
        data.append('files', data1);
        data.append('Filter', filter);
        return this._http.post(`${apiUrl}/${'api/Page/SaveTreeTable?id=' + ModuleID + '&index=' + treetableModuleIndex + '&username=' + username + '&AppId=' + appId}`, data);
    }

    //susan added start 
    VerifyIfPincodeExists(inputPinCode) {
        const data: FormData = new FormData();
        return this._http.post(`${apiUrl}/${'api/External/VerifyIfPincodeExists?InputPincode=' + inputPinCode}`, data, this.headers);
    }


    GetUserRemark() {
        return this._http.get(`${apiUrl}${'api/Custom/GetUserRemarkMapping'}`)
    }
    GetDataMeasures() {
        return this._http.get(`${apiUrl}${'api/Custom/GetDataMeasure'}`)
    }
    GetFinalSubmitStatus() {
        return this._http.get(`${apiUrl}${'api/Custom/GetFinalSubmitStatus'}`)
    }
    //susan added end 
    
    getPivot1(index: string, pivot_column: string, value: string, aggregate_: string, input_sp_or_query: string, mongo_collection: string = null, sorting_required: boolean = false) {
 
        // const url = 'http://www.pivotfastapi.datasavi.in/dj';
        const url = 'http://127.0.0.1:8000/dj';
 
        var appliedFilters = localStorage.getItem("filterdata");
        // var filterJson = JSON.parse(appliedFilters);
        // console.log(JSON.stringify(filterJson), "DJ Filter JSON")
 
        // // Initialize the result array
        // var result = [{}];
        // // Iterate over each field in filterJson
        // for (var field in filterJson) {
        //     if (filterJson.hasOwnProperty(field)) {
        //     // Filter the array for each field and only keep the "Text" values, ignoring other properties
        //     var filteredValues = filterJson[field]
        //         .filter(item => item.Text) // Remove items with null or missing "Text"
        //         .map(item => item.Text); // Get the "Text" values
       
        //     // If the field has multiple values (e.g., ProductSector), use an array of Text values.
        //     if (filteredValues.length > 1) {
        //         result[0][field] = filteredValues; // For multiple items, keep the array
        //     } else if (filteredValues.length === 1) {
        //         result[0][field] = filteredValues[0]; // If only one item, store as a single value
        //     }
        //     }
        // }
        // console.log(result, "result json dj")
 
        const params: {
            url: string,
            input_sp_or_query?: string;
            index: string;
            aggregate_?: string;
            pivot_column?: string;
            value?: string;
            jsonBody?: string;
            applied_filters?: string;
            mongo_collection?: string;
            webapi_url?: string;
            sorting_required?: boolean;
        } = {
            url: url,
            input_sp_or_query,
            // environment: 'development',
            index: index
        };
 
        if (aggregate_ !== null) {
            params.aggregate_ = aggregate_;
        }
 
        if (pivot_column !== null) {
            params.pivot_column = pivot_column;
        }
 
        if (value !== null) {
            params.value = value;
        }

        if(appliedFilters !== null){
            params.applied_filters = appliedFilters;
        }

        if(mongo_collection !== null){
            params.mongo_collection = mongo_collection;
        }
        
        if(sorting_required){
            params.sorting_required = sorting_required;
        }
        // if(result){
        //     params.jsonBody = JSON.stringify(result);
        // }
        params.webapi_url = apiUrl;
        let UserName = localStorage.getItem('username');
 
        // return this._http.post(url, null, { params });
        // return this._http.post(`${apiUrl}api/Page/GetDataFromPythonAPI?apiUrl=${encodeURIComponent(url)}&userName=${UserName}`, params);
        return this._http.post(`${apiUrl}/api/Page/GetDataFromPythonAPI?userName=${UserName}`, params);
    }

    getProcessFlowData(userName: string, storedProc: string, appId: string) {
        const url = `${apiUrl}/api/Page/GetProcessFlowData?UserName=${userName}&storedProc=${storedProc}&AppId=${appId}`;
        return this._http.get(url);
    }
    //susan added end 

    //Swapnil added start
    GetUserToken(userID, userName) {
        return this._http.get(`${apiUrl}/${'api/Page/GetUserToken?userID=' + userID + '&userName=' + userName}`);
    }
    //Swapnil Added end 

    
    UploadFileForVirusScan(file, username) : Observable<any> {
        debugger ; 
        const data: FormData = new FormData();
        data.append('file', file, file.Name);
        return this._http.post(`${apiUrl}/${'api/Page/UploadFileForVirusScan?username=' + username}`, data)
    }
    //Run the SP On Button In modulewisebutton Config
    RunSPOnButton(SP: string, MenuID: number, username: string, filter: any, appId?: number): any {
        var data = new FormData();
        data.append('Filter', filter);
        return this._http.post(`${apiUrl}/${'api/Workflow/RunSPOnButton?SP=' + SP + '&MenuID=' + MenuID + '&username=' + username + '&AppId=' + appId}`, data);
    }

    SubmitMongoCollection(ModuleID: number, MenuID: number, UserName: string, appId?: number) {
        const data: FormData = new FormData();

        return this._http.post(`${apiUrl}/${'api/Page/SubmitMongoCollection?ModuleID=' + ModuleID + '&MenuID=' + MenuID + '&username=' + UserName + '&AppId=' + appId}`, data);

    }

    FinalSubmit(Username) {
        return this._http.post(`${apiUrl}/${'api/Page/FinalSubmit?Username=' + Username}`, {});

    }

    FinalSubmit4941(ID: number, Username: string, filter: any) {
        var data = new FormData();
        data.append('Filter', filter);
        return this._http.post(`${apiUrl}/${'api/Page/FinalSubmit4941?id=' + ID + '&Username=' + Username}`, data);

    }


    MarkedForReview4941(ID: number, Username: string, filter: any) {
        var data = new FormData();
        data.append('Filter', filter);
        return this._http.post(`${apiUrl}/${'api/Page/MarkedForReview4941?id=' + ID + '&Username=' + Username}`, data);

    }


    MarkedForReview(Username) {
        return this._http.post(`${apiUrl}/${'api/Page/MarkedForReview?Username=' + Username}`, {});

    }



    fetchDataMeasureMapping() {
        return this._http.get<{ DataMeasure: string, Description: string }[]>(`${apiUrl}/api/Page/GetDataMeasureMapping`)
            .subscribe(data => {
                console.log("Received Data MEasures:", data); // Debugging
                data.forEach(item => {
                    console.log("Datameasure:", item.DataMeasure, "Description:", item.Description); // Log each item
                    this.dataMeasureMap.set(item.DataMeasure, item.Description);
                });

                console.log("DataMeasure Map:", this.dataMeasureMap);
            });
    }

    getDescription(header: string): string {
        return this.dataMeasureMap.get(header);
    }

    exporttocsv(menuid, UserName, filter, appID?: number) {
        //console.log("data",JSON.stringify(data));
        //var datasend=JSON.stringify(data);
        //const body = new HttpParams()
        //    .set('data', data);
        var data = {};
        data["Filter"] = filter;
        return this._http.post(`${apiUrl}/${'api/Page/ExportToCSV?MenuId=' + menuid + '&UserName=' + UserName + '&AppId=' + appID}`, data, { responseType: 'arraybuffer', headers: { 'Content-Type': 'application/json' } });
    }

    ValidateFinalSubmit(Username) {
        return this._http.post(`${apiUrl}/${'api/Page/ValidateFinalSubmit?Username=' + Username}`, {});

    }
    ValidateReviewSubmit(Username) {
        return this._http.post(`${apiUrl}/${'api/Page/ValidateReviewSubmit?Username=' + Username}`, {});

    }

    deleteRecord(id: number, tablename: string, username: string) {
        const url = `${apiUrl}/api/Page/DeleteByID?UserName=${username}&Id=${id}&tablename=${tablename}`;
        return this._http.get(url);
    }
    getModuleWithId(moduleId: number, userName: string) {
        const url = `${apiUrl}/api/Page/GetModuleWithId?UserName=${userName}&ModuleId=${moduleId}`;
        return this._http.get(url);
    }




}
