import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse,
  HttpEventType,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  fromEvent,
  merge,
  of,
  from,
  throwError,
  BehaviorSubject,
  forkJoin,
} from 'rxjs';
import { environment } from '../../environments/environment';
import { mapTo, catchError, map } from 'rxjs/operators';

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  apiUrl = environment.apiUrl;
  UserName: any;
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  online$: Observable<boolean>;
  filterData: '"Filter":{"Entity":"2"}';
  columnHeader: any;
  onlineFlag: any;
  Module: any;
  dymDataCache = new Map();
  private dataMeasureMap = new Map<string, string>();

  constructor(private http: HttpClient) {
    this.onlineFlag = navigator.onLine;
    // console.log(this.onlineFlag);
  }

  getMenuList(UserName: string) {
    return this.http.get(
      `${this.apiUrl}` + `api/Menu/GetMenuList?username=${UserName}`
    );
  }

  getAllMenus(UserName: string) {
    return this.http.get(
      `${this.apiUrl}` + `api/Menu/GetAllMenus?username=${UserName}`
    );
  }

  getApps(UserName: string) {
    return this.http.get(
      `${this.apiUrl}` + `api/Menu/GetApps?username=${UserName}`
    );
  }

  getAppMenus(UserName: string, SubGroupID: number) {
    return this.http.get(
      `${this.apiUrl}` +
      `api/Menu/GetAppMenus?username=${UserName}&SubGroupID=${SubGroupID}`
    );
  }

  GetPageWithoutModuleData(MenuID: number, UserName: string, AppId: number, clientCode?: string) {
    let url = `${this.apiUrl}/api/Page/GetPageWithoutModuleData?MenuId=${MenuID}&UserName=${UserName}&AppId=${AppId}`;

    if (clientCode) {
      url += `&ClientCode=${clientCode}`;
    }

    return this.http.get(url);
  }

  getPageMenuDetails(MenuID: any, UserName: any) {
    //alert('call');
    return this.http.get(
      `${this.apiUrl}/${'api/Page/GetPageMenuDetail?UserName=' + UserName + '&MenuNo=' + MenuID
      }`
    );
  }

  populateModuleData(
    moduleId: number,
    menuId: number,
    username: string,
    data: any,
    storedProc: string,
    AppId: number,
    NotificationParameterListCount?: number,
    clientCode?: string // <- new optional param
  ) {
    let url = `${this.apiUrl}/api/Page/PopulateModuleData?ModuleId=${moduleId}&MenuId=${menuId}&UserName=${username}&storedProc=${storedProc}&AppId=${AppId}`;

    if (NotificationParameterListCount !== undefined) {
      url += `&NotificationParameterList=${NotificationParameterListCount}`;
    }

    if (clientCode) {
      url += `&ClientCode=${clientCode}`;
    }

    return this.http.post(url, data);
  }

  Savedata(
    ModuleID: any,
    data: any,
    username: any,
    AppId?: number,
    filter?: any
  ) {
    return this.http.post(
      `${this.apiUrl}/${'api/Page/SaveModules_v1?id=' +
      ModuleID +
      '&username=' +
      username +
      '&AppId=' +
      AppId +
      '&FilterData=' +
      filter
      }`,
      data
    );
  }

  GetModuleChartTable(chartId: number, data: any) {
    return this.http.post(
      `${this.apiUrl}${'api/Page/GetListOfChartData?ModuleId=' + chartId}`,
      data
    );
  }

  exporttoexcelModulewise(
    moduleId: any,
    UserName: any,
    data: any,
    AppId?: number
  ) {
    return this.http.post(
      `${this.apiUrl}/${'api/Page/ExportToexcelModulewise?ModuleId=' +
      moduleId +
      '&UserName=' +
      UserName +
      '&AppId=' +
      AppId
      }`,
      data,
      {
        responseType: 'arraybuffer',
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  getImage(path: string) {
    return this.http.get(`${this.apiUrl}/${'api/Page/GetImage?path=' + path}`, {
      responseType: 'text',
    });
  }

  private notificationCount = new BehaviorSubject<number>(0);
  private badgeValue = 0;
  notificationCount$ = this.notificationCount.asObservable();

  incrementNotificationCount() {
    this.UserName = localStorage.getItem('username');
    // this.GetBadgeValue(this.UserName).subscribe((response: number) => this.badgeValue = response)
    this.GetBadgeValue(this.UserName).subscribe((response: any) => {
      this.notificationCount.next(response);
    });
  }
  GetBadgeValue(UserName: any) {
    return this.http.get(
      `${this.apiUrl}/${'api/Page/GetBadgeValue?username=' + UserName}`
    );
  }

  RunWorkflowTask(ID: any, username: any, data: any) {
    return this.http.post(
      `${this.apiUrl}/api/Page/RunWorkflowTask?RowValue=${ID}&UserName=${username}`,
      data
    );
  }
  uploadFileToBLOB(formData: any) {
    this.http
      .post(`${this.apiUrl}/${'api/AzureBlob/UploadToBLOB'}`, formData)
      .subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * event.loaded) / event.total);
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

  uploadFile(
    file: any,
    username: any,
    columnHeader: any,
    tableName?: string,
    isAppend?: boolean,
    ExcelSheetNames?: string
  ) {
    const data: FormData = new FormData();
    data.append('file', file, file.Name);
    data.append('isAppend', isAppend?.toString() ?? 'false');
    // Uses optional chaining and nullish coalescing to provide a default
    return this.http.post(
      `${this.apiUrl}/${'api/Page/UploadJsonFile?columnHeader=' +
      columnHeader +
      '&UserName=' +
      username +
      '&table_name=' +
      tableName +
      '&ExcelSheetNames=' +
      ExcelSheetNames
      }`,
      data
    );
  }

  SaveTableToDataset(
    UserName: any,
    sqlTableName: any,
    IsAppend: any,
    dt: any,
    chunkSize = 500
  ) {
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
      const observable = this.http
        .post(
          `${this.apiUrl
          }/api/workflow/ImportTableToDataset?UserName=${encodeURIComponent(
            UserName
          )}&sqlTableName=${encodeURIComponent(
            sqlTableName
          )}&IsAppend=${IsAppend}`,
          data
        )
        .pipe(
          catchError((error: any) => {
            console.error('Error sending chunk', error);
            return of(null); // Return a safe value to continue processing
          })
        );

      observables.push(observable);
    }

    // Return an observable that emits when all chunks are processed
    return forkJoin(observables); // This combines all observables into one

    // debugger;
    // var data = new FormData();
    // data.append('data', JSON.stringify(dt));
    // return this._http.post(`${apiUrl}/${'api/workflow/ImportTableToDataset?UserName=' + UserName + '&sqlTableName=' + sqlTableName + '&IsAppend=' + IsAppend}`, data);
  }

  validateData(UserName: string, ImportToTable: any, error_dt: any) {
    var data = new FormData();
    data.append('data', JSON.stringify(error_dt));
    return this.http.post(
      `${this.apiUrl}/${'api/workflow/ValidateImportData?tableName=' + ImportToTable
      }`,
      data
    );
  }
  SavePrimeNgTable1(
    ModuleID: any,
    MenuId: any,
    data: any,
    username: any,
    AppId?: number
  ) {
    return this.http.post(
      `${this.apiUrl}/${'api/Page/SavePrimeNgTable?Id=' +
      ModuleID +
      '&menuId=' +
      MenuId +
      '&UserName=' +
      username +
      '&AppId=' +
      AppId
      }`,
      data
    );
  }

  UploadtoDynamicFolder(
    ModuleID,
    form,
    dt,
    selectedFiles: File[][],
    username,
    AppId?: number
  ) {
    var data = new FormData();
    data.append('Form', JSON.stringify(form));
    data.append('Tables', JSON.stringify(dt));

    selectedFiles.forEach((fileSet, i) => {
      console.log(`Index ${i}:`, fileSet);

      if (fileSet instanceof File) {
        data.append(`files[${i}][0]`, fileSet);
      } else if (Array.isArray(fileSet)) {
        fileSet.forEach((file, index) => {
          data.append(`files[${i}][${index}]`, file);
        });
      } else {
        console.error(
          `Error: fileSet at index ${i} is not a File or an array of Files.`
        );
      }
    });

    return this.http.post(
      `${this.apiUrl}/${'api/Page/UploadtoDynamicFolder?id=' +
      ModuleID +
      '&username=' +
      username +
      '&AppId=' +
      AppId
      }`,
      data
    );
  }
  populateTableSubmoduleData(
    MenuId: any,
    selectedValue: any,
    storedProc: any,
    UserName: string
  ) {
    debugger;
    //to get the submodule data for table
    return this.http.post(
      `${this.apiUrl}/${'api/Page/populateTableSubmoduleData?MenuId=' +
      MenuId +
      '&selectedValue=' +
      selectedValue +
      '&UserName=' +
      UserName +
      '&storedProc=' +
      storedProc
      }`,
      {}
    );
  }
  GenerateDomesticDNN(supplyDate, dt, username) {
    debugger;
    var data = new FormData();
    // username = 'Admin';
    //data.append("Form", JSON.stringify(form));
    data.append('dt', JSON.stringify(dt));
    return this.http.post(
      `${this.apiUrl}/${'api/Page/GenerateDomesticDNN?SupplyDate=' +
      supplyDate +
      '&username=' +
      username
      }`,
      data
    );
    // return this._http.post(`${apiUrl}/${'api/Page/SaveSubmodules?id=' + ModuleID + '&username=' + username }`, data)
  }
  GenerateImportDNN(supplyDate, dt, username) {
    debugger;
    var data = new FormData();
    // username = 'Admin';
    //data.append("Form", JSON.stringify(form));
    data.append('dt', JSON.stringify(dt));
    return this.http.post(
      `${this.apiUrl}/${'api/Page/GenerateImportDNN?SupplyDate=' +
      supplyDate +
      '&username=' +
      username
      }`,
      data
    );
    // return this._http.post(`${apiUrl}/${'api/Page/SaveSubmodules?id=' + ModuleID + '&username=' + username }`, data)
  }
  Savedata1(ModuleID, data, username, httpdata) {
    //debugger;
    //alert("You are in Mainpage.service.ts " +username);
    var formData = new FormData();
    console.log('data :-' + data);
    console.log(
      'File Name :- ' + httpdata.name + ' File Data :-' + httpdata.FileData
    );
    formData.append('data', data);
    formData.append(httpdata.name, httpdata.FileData);
    console.log(JSON.stringify(formData));
    return this.http.post(
      `${this.apiUrl}/${'api/Page/SaveModules?id=' + ModuleID + '&username=' + username
      }`,
      formData
    );
  }
  VerifyIfPincodeExists(inputPinCode) {
    const data: FormData = new FormData();
    return this.http.post(
      `${this.apiUrl}/${'api/External/VerifyIfPincodeExists?InputPincode=' + inputPinCode
      }`,
      data,
      this.headers
    );
  }
  getPivot(
    index: string,
    pivot_column: string,
    value: string,
    aggregate_: string,
    input_sp_or_query: string
  ) {
    const data: FormData = new FormData();

    const url = 'http://www.pivotfastapi.datasavi.in/dj';
    const params: {
      url: string;
      input_sp_or_query: string;
      index: string;
      aggregate_?: string;
      pivot_column?: string;
      value?: string;
    } = {
      url: url,
      input_sp_or_query,
      //environment: 'development',
      index: index,
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
    return this.http.post(
      `${this.apiUrl}/api/Page/GetDataFromPythonAPI?userName=${UserName}`,
      params
    );
  }
  saveViewName(pivotView) {
    return this.http.post(
      `${this.apiUrl}${'api/Page/saveview'}`,
      pivotView,
      this.headers
    );
  }

  UpdateFrequentAndRecentMenus(menuID: number, UserName: string) {
    return this.http.get(`${this.apiUrl}/` + `api/Menu/UpdateFrequentAndRecentMenus?menuId=${menuID}&username=${UserName}`);
  }
}
