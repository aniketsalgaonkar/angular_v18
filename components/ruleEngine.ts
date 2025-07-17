import { Events } from "../services/events.service";
import { Injectable, OnInit } from "@angular/core";
import { NavigationExtras, NavigationStart, Router } from "@angular/router";
import { Table } from "primeng/table";

// import { WorkFlowService } from "../Services/workflow.service";
import { WorkFlowService } from "../services/workflow.service";
import { UploadFile } from "./uploadFile";
// import { menuService } from "../Services/MainPage.service";
import { MenuService } from "../services/menu.service";
import { MessageService } from "primeng/api";

@Injectable({
    providedIn: 'root'
})

export class RuleEngine implements OnInit {

    RuleJson: any
    highlightcard: number;
    Sys_Menu_ID: number = 1450;
    filterRuleIndex: number;
    ruleErrorData: any[] = [];
    ModulesRuleData: any[] = [];
    Validation: boolean = false;
    previousUrl: string;
    invalidData: any;
    ruleEngineInvalidData:any;
    invalidData_Columns: string[];
    showInvalidData: boolean;
    ModuleId: any;
    public isProceedButtonDisabled: boolean = false;



    ngOnInit(): void {
    }

    constructor(private workflowService: WorkFlowService,
        private router: Router,
        private events: Events,
        private menuService: MenuService,
        private messageService: MessageService) {
        this.showInvalidData=false;
    }

    GetPropertyRule(pkColumn, pkColumnValue, column, ModuleDataWithRuleArray, moduleIndex?: number) {
        let propertyList: string = "";
        if (moduleIndex == null) moduleIndex = 0;
        if (pkColumn == null || pkColumn == "" || pkColumn == undefined)
            return "";
        let dataWithRules = ModuleDataWithRuleArray;
        if (dataWithRules != null && dataWithRules.length > 0) {
            if (column != "") {
                let rowObject = ModuleDataWithRuleArray.find(d => d[pkColumn].Value == pkColumnValue);
                if (rowObject != undefined) {
                    propertyList = rowObject[column].PropertyList;
                    this.RuleJson = rowObject[column];
                }

            }

        }

        return propertyList;
    }

    GetRuleLink(pkColumn, pkColumnValue, column, ModuleDataWithRuleArray, dt_count) {//navigate to menu when rule is applied
        if (pkColumn == null || pkColumn == "" || pkColumn == undefined)
            this.navigate(pkColumnValue, this.Sys_Menu_ID);
        else {

            let ruleLinkMenu: number;
            if (ModuleDataWithRuleArray != null && ModuleDataWithRuleArray.length > 0) {
                ruleLinkMenu = ModuleDataWithRuleArray.find(d => d[pkColumn].Value == pkColumnValue)[column].LinkMenuId;
                if (ruleLinkMenu != 0) {
                    this.Validation = false;
                    setTimeout(() => {
                        this.navigate(pkColumnValue, ruleLinkMenu);
                    }, 2000)
                }
            }
        }
    }

    async hideDialog(): Promise<void> {
        return new Promise((resolve) => {
            this.showInvalidData = false;
            // You can add any logic here to ensure the dialog actually closes if necessary
            resolve();
        });
    }

    async navigate(i: any, LinkedMenu: number, data?: any) {
        if (!this.isProceedButtonDisabled) {
            return; // Prevents execution if the button is somehow clicked when disabled
          }

        this.showInvalidData = false;
        // await this.hideDialog(); // Ensure the dialog is hidden before navigation
        console.log(data);
   
        let qm = {};
        let navigationExtras: NavigationExtras = { queryParams: qm };
        localStorage.setItem('navigationExtras', JSON.stringify(qm));
        this.events.publish('navigationExtras', qm);
        if (LinkedMenu !== 0) {
            this.showInvalidData = false
            this.router.navigateByUrl(`/menu/first/tabs/${LinkedMenu}`, navigationExtras);
        }
        this.isProceedButtonDisabled = !this.isProceedButtonDisabled;
    }

    filterRuleData(count, dt_count, ruleName, ruleMessage, dt: Table, Module, ModuleDataWithRuleArray, primeNgTableArray, totalRecords, firstcount, rowscount) {
        debugger;
        this.filterRuleIndex = dt_count;
        // let filteredData=this.ModuleDataWithRuleArray[dt_count].filter(val=>val[ruleName].PropertyList!=null);
        let filteredData = ModuleDataWithRuleArray[dt_count].filter(val => val[ruleName].Tooltip == ruleMessage);
        let ids = filteredData.map(item => Number(item.ID.Value))
        this.ruleErrorData = ids;

        let dataToFilter = Module[0].moduleList[dt_count].moduleData;
        this.ModulesRuleData = [];
        this.ModulesRuleData = dataToFilter.filter(this.RuleFilterData.bind(this));

        totalRecords[dt_count] = this.ModulesRuleData.length;
        // this.primeNgTableArray[dt_count]=dataToFilter.filter(this.RuleFilterData.bind(this)).slice(this.firstcount,(this.firstcount + this.rowscount))
        primeNgTableArray[dt_count] = <any[]>this.ModulesRuleData.slice(firstcount, (firstcount + rowscount));

    }
    RuleFilterData(data) {
        let reusltArray: boolean = false

        this.ruleErrorData.forEach(errorId => {
            if (data['ID'].toString() === (errorId.toString())) reusltArray = true
        })
        return reusltArray;
    }

    clearFilter(moduleIndex, Module, primeNgTableArray, totalRecords, firstcount, rowscount) {
        let dataToFilter = Module[0].moduleList[moduleIndex].moduleData;

        totalRecords[moduleIndex] = dataToFilter.length;
        primeNgTableArray[moduleIndex] = dataToFilter.slice(firstcount, (firstcount + rowscount))
        this.filterRuleIndex = undefined;
    }

    executeRuleEngine(menuId, table_list?: any) {

        //method executes rule engine to validate imported data
        //it validates the module of above menuid shows the erroneous data with error count
       
        this.menuService.incrementNotificationCount();
        let userName = localStorage.getItem('username');
        let appId: any = null;
        this.messageService.add({ severity: 'success', summary: 'Validation is Started', detail: '' });
        let CurrentApp = JSON.parse(localStorage.getItem("CurrentApp"));
        if (CurrentApp != null || CurrentApp != undefined) appId = CurrentApp.ID;

        this.workflowService.ValidateDataset(menuId, userName, appId, table_list).subscribe(resp => {
            console.log("ExecuteRuleEngine", resp);
            this.messageService.add({ severity: 'success', summary: resp["Message"], detail: '' });
            if(resp["Message"] == "Validation has been completed.")
            {
                this.isProceedButtonDisabled = true;

            }
            // alert("executeRuleEngine")
            this.menuService.incrementNotificationCount();
            //if (menuId != current_menu_id) this.navigate(null, 1450);

        })
    }

    async getInvalidData(ModuleId: any, UserName: string) {
        this.showInvalidData = true;
        const data = await this.workflowService.getInvalidData(ModuleId, UserName).toPromise();
        this.invalidData = data;
        if (this.invalidData && this.invalidData.length > 0) {
            this.invalidData_Columns = Object.keys(this.invalidData[0]).filter(key => key !== '_id');
        }
    }

    getValue(row: any, col: string): any {
        if (typeof row[col] === 'object' && row[col] !== null && 'Value' in row[col]) {
            return row[col].Value;
        }
        return row[col];
    }

    getStyle(row: any, col: string): any {
        if (typeof row[col] === 'object' && row[col] !== null && row[col].PropertyList) {
            // console.log(col, row[col].PropertyList)
            return row[col].PropertyList;  // Return the PropertyList as style object
        }
        return {};  // Return an empty object if no styles are found
    }

    convertToDataTableFormat(tableList: any[]) {
        // Initialize an empty array to store the final objects
        let result: any[] = [];
     
        // Initialize a dynamic data object for the current row
        let dataObj: any = {};
     
        // Loop through the provided tableList (key-value pairs)
        tableList.forEach(([key, value]) => {
          // For fields like RowError, we might want to parse if it's a JSON string
          if (key === 'RowError' && typeof value === 'string') {
            try {
              // Parse the RowError JSON string into an object if it's valid JSON
              dataObj[key] = JSON.parse(value);
            } catch (e) {
              // If parsing fails, leave the RowError as a string (you can handle this case as needed)
              dataObj[key] = value;
            }
          } else {
            // For all other keys, directly assign them as properties in dataObj
            dataObj[key] = value;
          }
        });
     
                result.push(dataObj);
     
        return result;
      }

      saveValidData(dt: any, UserName: string, AppId: number, menuId, table_list) {
        console.log(dt);
        console.log(table_list);
       
        let tableListArray = Object.entries(table_list);
        let tableData = this.convertToDataTableFormat(tableListArray);
        let validData = this.flattenArrayObjects(dt);
       
        this.workflowService.SaveValidData(validData, this.ModuleId, UserName, AppId).subscribe(resp => {
            console.log(resp, "save message");
                this.executeRuleEngine(menuId, tableData);
                window.location.reload();
           
        });
    }

    flattenArrayObjects(arr: any[]): any[] {
        return arr.map(this.flattenObjectValues);
    }

    // Reusing the flattenObjectValues function from before
    flattenObjectValues(obj: any): any {
        const flattenedObj: any = {};

        // Iterate through each property of the object
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];

                // If the property is an object and has a 'Value' property, replace it
                if (typeof value === 'object' && value !== null && 'Value' in value) {
                    flattenedObj[key] = value.Value;  // Assign 'Value' to the parent property
                } else {
                    // Otherwise, keep the original value
                    flattenedObj[key] = value;
                }
            }
        }

        return flattenedObj;
    }

    async filterChipData(moduleList, ruleMessage, ruleEngine, UserName) {
        const module = moduleList.find(m => m.ID === ruleEngine.ModuleId);
        if (!module) return;
   
        const columnNames = module.NotificationParameterList.map(item => item.ColumnName);
        console.log(ruleEngine);
        ruleEngine.ruleEngineInvalidData = Object.values(ruleEngine.invalidData).filter(item =>
            columnNames.some(field => item[field]?.Tooltip === ruleMessage)
        );
        console.log(ruleEngine);
    }
}


