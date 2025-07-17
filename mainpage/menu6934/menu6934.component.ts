import { Component, OnInit, ViewChild, ViewChildren, AfterViewChecked, QueryList, ElementRef, HostListener, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationExtras, Params, Router, RouterEvent } from '@angular/router';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { Clipboard } from '@angular/cdk/clipboard';
import { filter, catchError } from 'rxjs/operators';
import { Observable, throwError, firstValueFrom } from 'rxjs';

import { Table } from 'primeng/table';
import { ConfirmationService, LazyLoadEvent, TreeNode, MessageService, MenuItem } from 'primeng/api';
import { TieredMenu } from 'primeng/tieredmenu';

import { Dataview } from '../../components/dataview';
import { WorkFlow } from "../../components/workflow";
import { RuleEngine } from '../../components/ruleEngine';
import { UploadFile } from '../../components/uploadFile';

import { environment } from '../../../environments/environment';
import { saveAs } from 'file-saver';
import { FileSystemNode } from '../../../assets/data/file-system-node';
import * as $ from 'jquery';

import { MainPageService } from '../../services/MainPage.service';
import { Events } from '../../services/events.service';
import { CustomService } from '../../services/custom-service.service';
import { ComponentCanDeactivate } from '../../services/pending-changes.guard';  //added to restrict user unload the current page if page includes changes.
import { ChartsService } from '../../services/charts.service';

import { UserManager } from 'src/app/components/ACS/UserManager';
import { AzureCommunication } from 'src/app/services/AzureCommunication.service';
import { DatabaseService } from "src/app/services/database.service";
import { FilterService } from 'src/app/services/filter.service';

interface FileObject {
    name: string,
    FileData: Blob
}
interface Sku {
    key: string,
    value: number
}

//This variable for set value of Environment
const apiUrl = environment.apiUrl;

@Component({
    selector: 'app-menu6934',
    templateUrl: './menu6934.component.html',
    // styleUrls: ['./menu6934.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class Menu6934Page implements OnInit, ComponentCanDeactivate, AfterViewChecked {
    selectedImage: any; // to select an image to display it in dataview display type
    listviewdata: any;
    listviewsubmoduledata: any;
    filterValues: any[] = []; //filter values to show as chips
    addNew: boolean = false;
    highlightcard: number; //to highlight dataview selected record
    showFooter: boolean = true;     //to show footer in table
    displayDialog: boolean;     // display dialog box in pivotwithdialog if true
    displayDialogArray: any[] = []; // display dialog box of formtable module // used array because of formtable can have multiple submodules and can multiple dialog box
    thisrow: any = {};  // used for cloning and keeping current selected row value from formtable/crudtable/pivottablewithdialog
    selectedrow: any;   // less used current selected row of table variable
    selectedValues: any;   // current selected row of table is stored in this variable
    newrow: boolean;    // to add a new row we check for true of this variable which becomes true when we click on add or plus button of table
    rows: any[];
    Sys_Menu_ID: number =6934;
    first: number = 0;
    fileUploadId: any;//use in listviewsubmodule Display Type

    Module: any;
    ModuleIDList: Array<any> = [];
    ModuleDetailIDList: Array<any> = [];
    hideColumnFilters: boolean = false; //  used to show/hide filters of table either it is global filter or columns filter
    Paginators: boolean = false;    // this variable was added to show/hide paginators in table but in new UI removed
    showfilter: boolean = false;    // used to show/hide filters using button click
    horizontalFilter: boolean = true;   // used to keep filter inputs in horizontal line
    appliedFilters: any;    // temporary var for keeping applied inputs and can be used to show in chip tags
    public searchElementRef: ElementRef;
    //public minDate: any = new Date().toISOString();
    public minDate: any = "";
    public maxDate: any = "2299-12-31";
    FileName: any;//Added
    UserName: string;
    datatableparam: any = {};
    DropDown: any = {};
    PageMenuDetails: any;
    id: any;//Added
    WizardFormValue: any = {};
    isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
    expandedElementArray: Array<any> = [];
    expandedElement: any;
    isLoadingResults = true;
    displayedColumnArray: Array<any> = [];
    //displayedColumns: any[] = [];
    Feedback: any;
    childColumnArray: Array<any> = [];
    //childColumns: any[] = [];
    FileList: Array<File> = [];
    public show: boolean = false;
    public loading: boolean;
    // added for File Download : Sonal
    api_url: string = apiUrl;

    //-accordions-----
    step = 0;
    showContainerEmail: boolean = false;    //for email with otp container
    //--
    //EmailwithOTP
    ValidatedEmail: boolean = false;
    VerifiedEmailId: any;

    //TreeTable
    files: FileSystemNode[] = [];
    cols: any[];
    colsdisplay: any[];
    editableCols: any[];
    totalRecords: any[];
    DisabledArray: any[] = [];
    moduleListData: any[] = [];
    moduleListDataLength: any;
    //primengTableData: any[];    //to store table data with index used in primengtablearray[] with dt_count
    //scrollableCols: any;    //to store list of column or scrollable column name in scrollableColsArray[] which is to be shown in table with dt_count
    //frozenCols: any[];          //to store list of frozen columns name in frozenColsArray[] which is to be shown in table with dt_count
    scrollableColsArray: any[]; // to store scrollabeCols with dt_index
    frozenColsArray: any[]; //to store  frozenCols with dt_index
    primeNgTableArray: any[];   //to store primengTableData with dt index;
    frozenWidthArray: any[];    // to store frozen width property value with dt_index(how much width to provide for all frozen area of table)
    selectedColumnsArray: any[];    // this variable is used for toggle features in pivottable(the list which it contains will be shown only)
    treetabledataArray: any;    // used to store tree table data with dt index
    //filterCols: any[];  // to be passed in global filter(it shows global filter as which columns are to be used when someone serches in global filter)
    filterColsArray: any[]; // to store filterCols for different table with dt_index(data table index)
    validationFilterModules: any[]; // to store the Validation moduleName for filter out in Dataview
    ValidateDataview: any[];
    //headerLevelOne: any[];  // used in multiheader table for first th level
    headerLevelOneArray: any[]; // stores headerLevelOne of different table with dt_index
    reportTableArray: any[];    //created for report table display Type but not used now
    reportTableColumnsArray: any[]; //created for report table display Type but not used now

    //SubmoduleDataSource: any[] = [];    //Used in formtable display type
    //SubmoduleScrollableCols: any[] = [];    // used in pivottablewithdialog displayType
    //SubmoduleFrozenCols: any[] = [];    // used in formtable displayType
    //SubModuleFrozenWidth: any[] = [];// used in formtable displayType
    SubmoduleDataSourceArray: any[] = [];// used in pivottablewithdialog displayType
    SubmoduleScrollableColsArray: any[] = [];// not used right now
    SubmoduleFrozenColsArray: any[] = [];// used in formtable displayType
    SubModuleFrozenWidthArray: any[] = [];// not used right now but was created to be used in pivottablewithdialog displayType
    displayDialogModule: any[] = [];// used in pivottablewithdialog displayType
    displayDialogSubmodule: any[] = [];// used in pivottablewithdialog displayType
    frozenColsSubmoduleArray: any[] = [];// used in pivottablewithdialog displayType
    frozenWidthSubModuleArray: any = [];// used in pivottablewithdialog displayType
    displayedSubmoduleColumnArray: any[] = [];// not used right now but was created to be used in pivottablewithdialog displayType and to be used in pivottablewithdialog displayType to pass column list of different table with dt_index in global filter
    displayedSubmoduleColumns: any[] = [];// used in pivottablewithdialog displayType to store column list of single table

    moduleLoaderArray: any[];
    visitedPagesData: any[];
    ModuleQuickLinks: any[];
    LinksModule: any;

    treeModuleData: TreeNode[];

    timelineData: any;
    timelineTableArray: any;
    timelineTableColumnsArray: any;
    steps: MenuItem[];//use for primeng steps to store data
    ruleErrorData: any[] = [];
    filterRuleIndex: number;
    ModulesRuleData: any[] = [];

    //used for pivottablereview
    UpdatedRows = [];
    RowID: number;
    dropDownArrayDialog: { AppId: null, Selected: boolean, Text: string, Value: number }[];

    //used for listview
    listViewDataComplete: any[] = []; //used to preserve complete list view data
    listViewTotalRecords: number = 0; //count of total number of records in listview data
    expandedRows: any[] = []; // created for dataset history
    datasetHistoryDataArray: any[] = [];

    // commented by Karan on 18-05-21 @ViewChild('slides') slides: IonSlides; // added for wizard slides
    @ViewChildren('LatLong') latlong: QueryList<ElementRef>;
    @ViewChild('cellContextMenu', { static: false }) cellContextMenu: TieredMenu;
    @ViewChild('inputField') inputfield: ElementRef;

    lat: number;
    long: number;
    lat_long: string;

    @ViewChildren('dt') tables: QueryList<Table>;

    @ViewChild('dt', { static: false }) primengTable: Table;
    ModuleDataWithRule: any;
    RuleJson: any;
    routerEventSubscription: any;
    rowval: string;

    Locale: string;
    Currency: string;
    DateFormat: string;
    TimeZone: string;
    hourFormat: number;
    dateTimeFormat: string;

    appid: string;
    CurrentApp: any;

    disable: boolean = false;
    activeTabIndex: number = 0;
    ModuleDataWithRuleArray: any[];
    filterSplitButtonOptions = [    //filter options to keep it horizontal or vertical/ open or hidden
        {
            label: 'Horizontal',
            //icon: 'pi pi-caret-left',
            command: () => {
                this.horizontalFilter = true; this.showfilter = !this.showfilter;
            }
        },
        {
            label: 'Vertical',
            //icon: 'pi pi-caret-down',
            command: () => {
                this.horizontalFilter = false; this.showfilter = !this.showfilter;
            }
        }
    ];
    tableSecondaryOptions = [   // was trying to show table primary option icons in three dot icon for mobile but applied
        {
            label: 'Pagination',
            icon: 'pi pi-align-justify',
            command: () => {
                this.Paginators = !this.Paginators
            }
        },
    ];

    haveChangesOnPage: any;
    temptableArray: any;
    rowGroupMetadata: {};
    applyCSSRuleToRow: boolean;

    RowRightClickOptions: any[] = [];
    RowRightClickOption: any[] = [];
    selectedProduct: any;
    contextMenu_tableIndex: number = 0;
    multichartdata: any[];
    CardViewModuleDetails: any;
    cardViewData: any[];
    paginateData: any;
    selectedCellValue: any;


    editorDisabled = true;
    topicId: number;
    isEditButtonClicked: boolean = true;
    selectedCellHeader: string;
    moduleName: any;
    StepactiveIndex: number = 0;
    activeLinkIndex: any[] = []; //used to set current active tab of linked menu


    showErrorDialog: boolean;//to display error dialog one excel is uploaded
    err_dt: any[]; //plain json of error data to display in tabular format
    err_columns: any[]; //list of columns from excel sheet
    errorList: any[];//nested json format of error list from excel upload(Import Dataset)
    excelDataError: any;//to get the cell error while excel validation(Import daataset)
    multichart_tileGroup: any[];

    // Added For DYM Filter //
    rangeDatesArray = [];
    rangeDates: Date[] = [];
    FilterData: any[] = [];
    firstcount: number = 0;
    rowscount: number = 0;
    DmyData: any = [];
    Skus: Sku[];
    selectedSku: number[] = [];
    gropuedSku: unknown[] = [];
    // End Of DYM Filter //
    //susan added start
    isPincodeValid: boolean = false;
    //susan added end 
    showDataviewImagePreview: boolean;
    dataviewImagePreviewSource: any;
    dataviewImagePreviewCaption: any;
    navigationExtras: string;
    RowErrors: any;
    table_list: any;
    metaData: any;
    variableColumnWidthsArray: [][];
    concatenatedArray: any;
    public isFinalSubmit: boolean = false;
    //processFlowInterval: number | null = null;
    processFlowInterval: ReturnType<typeof setInterval> | null = null;

    constructor(private mainpageservice: MainPageService,
        private customService: CustomService,
        private router: Router,
        private activateRouter: ActivatedRoute,
        private zone: NgZone,//Added
        private events: Events,
        private Dataview: Dataview,
        private ACSUser: UserManager,
        private ACS: AzureCommunication,
        // private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        private workflow: WorkFlow,
        public ruleEngine: RuleEngine,
        private confirmationService: ConfirmationService,
        private database: DatabaseService,
        private messageService: MessageService,
        private clipboard: Clipboard,
        private uploadFile: UploadFile,
        //susan - added start 
        private chartsService: ChartsService,
        //susan - added end
        public cdr: ChangeDetectorRef,
        private filterService: FilterService
    ) {
        this.Skus = [
            { key: "Months", value: 1 },
            { key: "Quarter", value: 2 },
            { key: "Year", value: 3 },
            { key: "Clear", value: 0 }
        ];

        events.subscribe('navigationExtras', (name) => {
            this.show = true;

            // alert('change'+name);
            let data: any;
            data = JSON.stringify(name);
            data = '{Filter:' + data + '}';
            // alert(data);
            this.GetPageWithoutModuleData(name);
        });

        events.subscribe('AppChanged', (app: any) => {
            let appid = localStorage.getItem("CurrentApp");
            this.CurrentApp = JSON.parse(appid);

            this.getPageMenuDetails().then(
                () => this.getModuleDetailIdToHide(),
                () => this.getModulesToShow(),
            )
        });


    }

    //exportExcel(data) {     // not in use //initially added to download primeng table in excel format
    //    var xlsx = require('xlsx');
    //    const worksheet = xlsx.utils.json_to_sheet(data);
    //    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    //    const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    //    this.saveAsExcelFile(excelBuffer, "export");
    //}

    //saveAsExcelFile(buffer: any, fileName: string): void {  // not in use //initially added to download primeng table in excel format
    //    var FileSaver = require('file-saver');
    //    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    //    let EXCEL_EXTENSION = '.xlsx';
    //    const data: Blob = new Blob([buffer], {
    //        type: EXCEL_TYPE
    //    });
    //    FileSaver.saveAs(data, fileName + new Date().getTime() + EXCEL_EXTENSION);
    //}
    //added Sonal - Menu Display Type : Wizard
    Next(ID: any, wizardFormdata: any) {        //next button click of ionic wizard display // very less used
        //debugger;
        this.WizardFormValue = Object.assign(this.WizardFormValue, wizardFormdata);
        // commented by Karan on 18-05-21 this.slides.lockSwipes(false);
        // commented by Karan on 18-05-21 this.slides.slideNext();
        // commented by Karan on 18-05-21 this.slides.lockSwipes(true);
    }

    Prev() {    // click function of ionic wizard display   // very less used
        // commented by Karan on 18-05-21 this.slides.lockSwipes(false);
        // commented by Karan on 18-05-21 this.slides.slidePrev();
        // commented by Karan on 18-05-21 this.slides.lockSwipes(true);
    }
    //ionViewDidEnter() {


    //    this.getPageMenuDetails().then(
    //        () => this.getModuleDetailIdToHide(),
    //        () => this.getModulesToShow(),
    //    )

    //    //this.routerEventSubscription = this.router.events.pipe(filter((event: RouterEvent) => event instanceof NavigationEnd)
    //    //).subscribe(() => {//refresh module on reload/navigation like back or submenu click
    //    //    this.getPageMenuDetails().then(
    //    //        () => this.getModuleDetailIdToHide(),
    //    //        () => this.getModulesToShow(),
    //    //    )
    //    //});//uncomment this if component should reload on every routing

    //    this.uploadFile.showValidationLoader = false;
    //    let menus = JSON.parse(localStorage.getItem("menus"));
    //    let current_menu = menus.find(m => m.ID == this.Sys_Menu_ID);
    //    this.events.publish('PageName', current_menu.MenuName);
    //    this.events.publish('CanActivateNavigation', current_menu.routerLink);
    //    this.events.publish('activeTopMenu', current_menu);
    //}

    public latitude(event: any, fieldName) {////////////returns location latitude

        const found = this.latlong.toArray().find(element => element.nativeElement.id == fieldName);
        found.nativeElement.value = event;
        found.nativeElement.dispatchEvent(new Event('input'));

    }
    public longitude(event: any, fieldName) {///////////////returns location longitude
        const found = this.latlong.toArray().find(element => element.nativeElement.id == fieldName);
        found.nativeElement.value = event;
        found.nativeElement.dispatchEvent(new Event('input'));

    }

    public latitudeLongitude(event: any, fieldName) {////////////////returns latitude and longitude

        const found = this.latlong.toArray().find(element => element.nativeElement.id == fieldName);
        found.nativeElement.value = event;
        //debugger;
        found.nativeElement.dispatchEvent(new Event('input'));
    }


    //resizeColumn(event, index: number) {
    //    let width: number;
    //    width = parseInt(this.frozenWidthArray[index].substring(0, this.frozenWidthArray[index].indexOf("px")));
    //    width = width + event.delta;
    //    this.frozenWidthArray[index] = width + "px";
    //}
    //updated by vikrant for frozenColumn and scrollable 
    resizeColumn(event, index: number) {
        let Original_Width: number;
        let New_Width: number;
        let Changed_Width: number;
        let Final_Width: number;
        Original_Width = parseInt(this.frozenWidthArray[index].substring(0, this.frozenWidthArray[index].indexOf("px")));
        New_Width = Original_Width + event.delta;
        Changed_Width = New_Width - Original_Width;
        Final_Width = Changed_Width + New_Width;
        this.frozenWidthArray[index] = Final_Width + "px";
    }

    formatDropdownValue(value: any) {
        if (value == null || value == undefined)
            return "";
        return value.Text || value;
    }

    assignDDselectedVal(fromvalue) { //used in primeng dropdown to assign selected value for tables
        let ddValue: any;
        if (fromvalue.value == null) {
            ddValue = null;
        }
        else {
            ddValue = fromvalue.value.Value;
        }
        return ddValue;
    }

    getDefaultValue(value1, value2) {   // to show default value in dropdown in table
        let result: any;
        if (value1 != null && value1 != -1 && value2 != null && value2 != -1) {
            value2.forEach(element => {
                if (element.Value == value1) {
                    result = element;
                }
            });
            return result;
        }
        return null;

    }

    onLoadImage(event: any, ColumnName) { //to upload an image for the dataview display type
        debugger;
        this.selectedImage = event;
        //ColumnName = event;
        //console.log(this.selectedImage, 'selectedImage')
        //console.log(event, 'event onLoadImage')
        //console.log(ColumnName, 'this is CN')
    }

    getDefaultText(value1, value2) {    //created to get default text of selected default values in dropdown in table but not used now
        let result: any;
        if (value1 != null && value1 != -1 && value2 != null && value2 != -1) {
            value2.forEach(element => {
                if (element.Value == value1 || element.Text == value1) {
                    result = element.Text;
                }
            });
            return result;
        }
        return null;
    }

    getMultiDropdownText(selectedValues, valueList) {

        let selected: any[] = [];
        if (selectedValues === undefined || selectedValues.trim() == "") {
            return null;
        }
        selected = selectedValues.split(",");
        var selectedText = "";
        selected.forEach(value => {
            var text = valueList.find(v => v.Value == value).Text;
            selectedText = text + ", " + selectedText;
        });
        return selectedText.substring(0, selectedText.length - 1);//returns comma separated values
    }


    isNumber(value: any): boolean {  // check number or not for new input controls in progress bar inputcontrols
        if (value) {
            return !isNaN(value);
        }

        return false;
    }

    removePercentSign(value) {  // used in new input control progress bar
        if (value) {
            value = String(value); // converting to string so that .replace can be used
            return value.replace('%', '');
        }
    }
    isPositiveNumber(value: any) {  // checking positive or negative for progressbar to align left or right
        if (value) {
            value = String(value); // converting to string so that .replace can be used
            value = value.replace('%', '');
            return Math.sign(value);
        }

        return 1; //default is returned as 1
    }

    filterTablesFromTree(node) {
        //console.log(node);
        //debugger;
        let that = this;
        let data = [];
        let tableModules = this.Module[0].moduleList.filter(m => m.DisplayType.toLowerCase().includes("table") || m.DisplayType.toLowerCase() == "" || m.DisplayType.toLowerCase() == "dataview");
        let columns: any = [];
        this.Module[0].moduleList.forEach(module => {
            if (module.DisplayType == '' || module.DisplayType.toLowerCase() == "primeunfrozentable" || module.DisplayType.toLowerCase() == "crudtable" || module.DisplayType.toLowerCase() == 'primengpivottable') {
                let dtIndex = tableModules.indexOf(module);
                let dataToFilter = module.moduleData;
                columns = this.filterColsArray[dtIndex];
                dataToFilter = dataToFilter.filter(filterData);

                if (node.parent != undefined) {
                    dataToFilter = this.filterByParentNode(dataToFilter, columns, node.parent);

                }
                this.totalRecords[dtIndex] = dataToFilter.length;
                data = dataToFilter.slice(0, 10);
                that.primeNgTableArray[dtIndex] = data;//.slice(that.tables.first, (that.tables.first + that.tables.));
            }
        });


        function filterData(data) {//callback function
            let matched: boolean = false;//flag to check if value exist in the row
            columns.forEach(column => {
                if (typeof data[column] == 'string') {//if column datatype is string
                    if (data[column].toLowerCase() === node.label.toLowerCase()) matched = true;//sets flag to true if value matched
                }
                else {//if column datatype is not string(integers,date etc.)
                    if (data[column] != null && data[column] != undefined) {
                        if (data[column].toString() === node.label.toString()) matched = true;//sets flag to true if value matched
                    }

                }
            });
            return matched;
        }


        // this.tables.forEach(dt => {
        //     dt.filterGlobal(node.label, 'equals');
        //     if (node.parent != undefined) {
        //         this.filterByParentNode(dt, node.parent);
        //     }
        // });
    }

    filterByParentNode(dataToFilter, columns, parentNode)//filter by parents till root element
    {
        dataToFilter = dataToFilter.filter(filterData);

        if (parentNode.parent != undefined) {
            this.filterByParentNode(dataToFilter, columns, parentNode.parent);
        }
        return dataToFilter;

        function filterData(data) {//callback function
            let matched: boolean = false;//flag to check if value exist in the row
            columns.forEach(column => {
                if (typeof data[column] == 'string') {//if column datatype is string
                    if (data[column].toLowerCase() === parentNode.label.toLowerCase()) matched = true;//sets flag to true if value matched
                }
                else {//if column datatype is not string(integers,date etc.)
                    if (data[column] != null && data[column] != undefined) {
                        if (data[column].toString() === parentNode.label.toString()) matched = true;//sets flag to true if value matched
                    }

                }
            });
            return matched;
        }


        // dt.filterGlobal(parentNode.label, 'equals')
        // if (parentNode.parent != undefined) {
        //     this.filterByParentNode(dt, parentNode.parent);
        // }
    }

    calculateTotalInRowGroup(data, groupByColumnName, groupByColumnValue, totalOf) {
        //debugger;
        let groupByRows = data.filter(d => d[groupByColumnName] == groupByColumnValue);
        var resultArray = Object.keys(groupByRows).map(function (index) {
            let d = groupByRows[index];
            return d;
        });
        let rows = resultArray;

        let total = rows.map(r => r[totalOf]).reduce((acc, value) => acc + (value / 1), 0);
        return total;
    }

    ///  show  grand total in tree Table 
    calculateTreeTableTotal(columnName, treeData) {
        let data = treeData.value;

        // // Calculate sum of a specific field, for example, 'CY_YTD'
        const sum = data.reduce((sum, item) => sum + parseFloat(item.data[columnName] || 0), 0);
        return sum;
    }


    public calculatePrimengTotal(col: string, primengdata) {
        let columnName = col;
        let footerTotal: Array<any> = [];

        let data = [];
        let mymodule;
        if (primengdata.hasFilter()) {
            if (primengdata.filteredValue)
                mymodule = primengdata.filteredValue;
            else
                mymodule = primengdata.value;
        }
        else {
            mymodule = primengdata.value;
        }

        var resultArray = Object.keys(mymodule).map(function (index) {
            let data = mymodule[index];
            return data;
        });
        data = resultArray;
        footerTotal[columnName] = data.map(t => t[columnName]).reduce((acc, value) => acc + (value / 1), 0)
        if (isNaN(footerTotal[columnName]) || footerTotal[columnName] == 0) {
            footerTotal[columnName] = "";
        }

        return footerTotal[columnName];
    }

    public onSubmoduleSubmit(form: any, dt, ID: any, LinkedMenu: any, moduleIndex: number): void {
        let formObject: any = form;
        let appId: any = null;
        if (this.CurrentApp != null || this.CurrentApp != undefined) appId = this.CurrentApp.ID;
        form = form.value;
        var submodules = this.Module[0].moduleList[moduleIndex].submodule;
        submodules.forEach(submodule => {
            var dateColumns = [];
            var datetimeColumns = [];
            var checkboxColumns = [];
            dateColumns = submodule.subModuleDetails.filter(md => md.DataType == "date");
            datetimeColumns = submodule.subModuleDetails.filter(md => md.DataType == "datetime");
            checkboxColumns = submodule.subModuleDetails.filter(md => md.InputControls == "Checkbox");

            if (submodule.DisplayType == "Form") {
                dateColumns.forEach(column => {
                    if (form[column.ColumnName] != null) {
                        let adate = new Date(form[column.ColumnName]);
                        var ayear = adate.getFullYear();
                        var amonth: any = adate.getMonth() + 1;
                        var adt: any = adate.getDate();
                        if (adt < 10) { adt = '0' + adt; }
                        if (amonth < 10) { amonth = '0' + amonth; }
                        form[column.ColumnName] = ayear + '-' + amonth + '-' + adt;
                    }
                })
                datetimeColumns.forEach(column => {

                    if (form[column.ColumnName] != null) {

                        let adate = new Date(form[column.ColumnName]);

                        var ayear = adate.getFullYear();

                        var amonth: any = adate.getMonth() + 1;

                        var adt: any = adate.getDate();

                        var aHour: any = adate.getHours();

                        var aMin: any = adate.getMinutes();

                        if (adt < 10) { adt = '0' + adt; }

                        if (amonth < 10) { amonth = '0' + amonth; }

                        form[column.ColumnName] = ayear + '-' + amonth + '-' + adt + ' ' + aHour + ':' + aMin;

                    }

                });

                checkboxColumns.forEach(column => {
                    if (form[column.ColumnName] == null || form[column.ColumnName] == "") {
                        form[column.ColumnName] = false;
                    }
                });

            }
            else if (submodule.DisplayType == "" || submodule.DisplayType == "PrimeUnfrozenTable") {
                dt.forEach(table => {

                    table.map(d => {
                        dateColumns.forEach(column => {
                            if (d[column.ColumnName] != null) {
                                let adate = new Date(d[column.ColumnName]);
                                var ayear = adate.getFullYear();
                                var amonth: any = adate.getMonth() + 1;
                                var adt: any = adate.getDate();
                                if (adt < 10) { adt = '0' + adt; }
                                if (amonth < 10) { amonth = '0' + amonth; }
                                d[column.ColumnName] = ayear + '-' + amonth + '-' + adt;
                            }
                        })
                        checkboxColumns.forEach(column => {
                            if (d[column.ColumnName] == null || d[column.ColumnName] == "") {
                                d[column.ColumnName] == false;
                            }
                        })
                        datetimeColumns.forEach(column => {

                            if (d[column.ColumnName] != null) {

                                let adate = new Date(d[column.ColumnName]);

                                var ayear = adate.getFullYear();

                                var amonth: any = adate.getMonth() + 1;

                                var adt: any = adate.getDate();

                                var aHour: any = adate.getHours();

                                var aMin: any = adate.getMinutes();

                                if (adt < 10) { adt = '0' + adt; }

                                if (amonth < 10) { amonth = '0' + amonth; }

                                if (aHour < 10) { aHour = '0' + aHour; }

                                if (aMin < 10) { aMin = '0' + aMin; }

                                d[column.ColumnName] = ayear + '-' + amonth + '-' + adt + ' ' + aHour + ':' + aMin;

                            }

                        });
                    });
                })

            }
        });


        let filter1 = localStorage.getItem('navigationExtras');

        // this.routerEventSubscription = this.router.events.pipe(filter((event: RouterEvent) => event instanceof NavigationEnd)
        // ).subscribe(() => {//refresh module on reload/navigation like back or submenu click
        //     this.GetPageWithoutModuleData(filter1);
        // });

        //updated by Atharva from above code for v18 needed to be tested
        this.routerEventSubscription = this.router.events
            .pipe(
                filter((event): event is NavigationEnd => event instanceof NavigationEnd)
            )
            .subscribe(() => {
                this.GetPageWithoutModuleData(filter1);
            });


        this.UserName = localStorage.getItem('username');
        this.show = true;

        this.mainpageservice.SaveSubmodules(ID, form, dt, this.UserName, appId).subscribe(resp => {
            //console.log(JSON.stringify(resp["Message"]));
            // let toast = this.toastController.create({
            //     message: resp["Message"],
            //     duration: 8000,
            //     position: 'bottom',
            //     //closeButtonText: 'Ok',

            // });
            if (resp["Message"] == "Record saved successfully!!") {
                this.getPageMenuDetails();

                if (LinkedMenu != 0 && LinkedMenu != '' && LinkedMenu != null) {
                    this.navigateOnFormSubmit(LinkedMenu);
                }
            }

            // toast.then(toast => toast.present());
            this.show = false;
            formObject.reset();
        });
    }

    loadNodes(event) {
        this.loading = true;
        this.GetPaginatedTreeTable(event);
    }

    calculateRowWiseTotalPrimeNG(rowData, dtIndex) {

        var columnsForSum = this.Module[0].moduleList[dtIndex].ColumnsForSum;
        var ShowSumIn = this.Module[0].moduleList[dtIndex].GetSumIn;
        let rowWiseTotal: number = 0;
        if (columnsForSum) {
            columnsForSum.forEach(element => {
                rowWiseTotal = rowWiseTotal + parseInt(rowData[element]);
            });
        }
        rowData[ShowSumIn] = rowWiseTotal;
    }

    hasRowsInTable(tables) {//Disables submit button when table is empty in FormTable Display type
        let hasRow: boolean = false;
        tables.forEach(table => {
            if (table.length > 0)
                hasRow = true;
            else
                hasRow = false;
        });
        return hasRow;
    }
    showDialogToAddInCrudTable(dt_count) {  // add new row in crudtable
        this.newrow = true;
        this.thisrow = {};
        this.disable = false;
        this.displayDialogModule[dt_count] = true;
    }
    showDialogToAdd(module_dt_count: number, submodule_dt_count: number) {  // add new row in formtable
        this.newrow = true;
        this.thisrow = {};
        this.disable = false;
        this.displayDialogModule[module_dt_count][submodule_dt_count] = true;
    }
    resetDialogInCrudTable(module_dt_count: number) {   //reset dialog box input fields in crudtable
        this.thisrow = {};
        this.disable = false;
        this.displayDialogModule[module_dt_count] = true;
    }
    resetDialog(module_dt_count: number, submodule_dt_count: number) {  //resetDialog in formtbale
        this.thisrow = {};
        this.disable = false;
        this.displayDialogModule[module_dt_count][submodule_dt_count] = true;
    }
    PivotDialogReset() {    // used in pivottablewithdialog reset
        this.thisrow = {};
        this.disable = false;
        this.displayDialog = true;
    }

    //dialog save for pivottablereview
    PivotReviewDialogSave(subModuleIndex: number) {
        //debugger;
        let updationColumnNames = null;
        let thisrows = [...this.SubmoduleDataSourceArray[subModuleIndex]];
        let ReviewData = thisrows;
        ReviewData.forEach((data, index) => {
            data.id = index + 1;
        })
        //console.log(ReviewData);
        let reviewRow = ReviewData[this.RowID];
        //console.log(reviewRow)

        var row = this.thisrow;
        //console.log(this.scrollableCols);
        //console.log(row);

        Object.keys(row).forEach(key => {
            if (row[key].constructor === Array) {
                updationColumnNames = key;
                console.log(updationColumnNames);
            }
        });

        let rowToUpdate = this.thisrow;
        if (row[updationColumnNames].length > 0) {
            row[updationColumnNames].forEach(month => {
                if (row.DirectValue != undefined && row.DirectValue != "")
                    rowToUpdate[month.Text] = row.DirectValue;
            });

        }
        this.thisrow = rowToUpdate;
        if (this.newrow)
            thisrows.push(this.thisrow);
        else
            thisrows[this.SubmoduleDataSourceArray[subModuleIndex].indexOf(this.selectedValues)] = this.thisrow;
        if (this.UpdatedRows.length != 0) {
            let filterrow = this.UpdatedRows.filter(data => data.id == reviewRow.id)
            if (filterrow != null && filterrow.length != 0) {
                this.UpdatedRows.forEach(data => {
                    if (data.id == filterrow[0].id) {
                        data = filterrow[0]
                    }
                })
            }
            else {
                this.UpdatedRows.push(reviewRow);
            }
        }
        else {
            this.UpdatedRows.push(reviewRow);
        }
        this.SubmoduleDataSourceArray[subModuleIndex] = thisrows;
        console.log(this.SubmoduleDataSourceArray[subModuleIndex]);
        this.thisrow = null;
        this.displayDialog = false;
    }

    PivotDialogSave(subModuleIndex: number) {   // save record in pivottablewithdialog table dispalytype
        let thisrows = [...this.SubmoduleDataSourceArray[subModuleIndex]];
        var row = this.thisrow;
        Object.keys(row).map(function (key, index) {
            if (row[key] != null) {
                if (row[key].hasOwnProperty("Text"))
                    row[key] = row[key].Text;

                if (typeof (row[key]) == "object" && !(row[key] instanceof Date)) {
                    let multiDropdownValues: string = "";
                    row[key].forEach(element => {
                        multiDropdownValues = element.Value + "," + multiDropdownValues;
                    });
                    multiDropdownValues = multiDropdownValues.substring(0, multiDropdownValues.length - 1);
                    row[key] = multiDropdownValues;
                }
            }

        })
        this.thisrow = row;
        //console.log(this.thisrow);
        if (this.newrow)
            thisrows.push(this.thisrow);
        else
            thisrows[this.SubmoduleDataSourceArray[subModuleIndex].indexOf(this.selectedValues)] = this.thisrow;

        this.SubmoduleDataSourceArray[subModuleIndex] = thisrows;
        //console.log(this.SubmoduleDataSourceArray[subModuleIndex]);
        this.thisrow = null;
        this.displayDialog = false;
    }

    //saveRecordInCrudTable(module_dt_count: number) {    //Temporary save of record in crudtable for browser app only// data is not added to database until submit button is clicked
    //    let thisrows = [...this.primeNgTableArray[module_dt_count]];
    //    var row = this.thisrow;
    //    Object.keys(row).map(function (key, index) {
    //        if (row[key] != null) {
    //            if (row[key].hasOwnProperty("Text"))
    //                row[key] = row[key].Text;

    //            if (typeof (row[key]) == "object" && !(row[key] instanceof Date) && (Array.isArray(row[key]))) {
    //                let multiDropdownValues: string = "";
    //                row[key].forEach(element => {
    //                    multiDropdownValues = element.Text + "," + multiDropdownValues;

    //                });
    //                multiDropdownValues = multiDropdownValues.substring(0, multiDropdownValues.length - 1);
    //                row[key] = multiDropdownValues;
    //            }
    //            // Added for FileUpload
    //            if (typeof (row[key]) == "object" && (Array.isArray(row[key]))) {

    //                if (row[key][0] instanceof File) {
    //                    var fileNames = "";

    //                    row[key].forEach(file => {
    //                        fileNames = file["name"] + "," + fileNames;
    //                    });
    //                    row[key] = fileNames.substring(0, fileNames.length - 1);
    //                    ////console.log(row[key],'rowkey');
    //                }
    //            }
    //        }

    //    })
    //    this.thisrow = row;
    //    //console.log(this.thisrow, 'rowdata');
    //    if (this.newrow) {
    //        thisrows.push(this.thisrow);
    //        ////console.log(this.thisrow,'newrowdata');
    //    }
    //    else {
    //        thisrows[this.primeNgTableArray[module_dt_count].indexOf(this.selectedValues)] = this.thisrow;
    //        ////console.log(this.thisrow,'editeddata');
    //    }

    //    this.primeNgTableArray[module_dt_count] = thisrows;
    //    //console.log(this.primeNgTableArray[module_dt_count]);
    //    this.thisrow = null;
    //    this.displayDialogModule[module_dt_count] = false;
    //    ////console.log(this.thisrow,'newrowdata');
    //}
    //UPDATED BY VIKRANT
    saveRecordInCrudTable(module_dt_count: number) {
        let thisrows = [...(this.primeNgTableArray[module_dt_count] || [])];
        var row = this.thisrow || {}; // Ensure row is initialized

        if (typeof row !== 'object' || row === null) {
            console.error("Invalid row:", row);
            return;
        }

        try {
            Object.keys(row).map(function (key, index) {
                console.log("Processing key:", key, "Value:", row[key]);

                if (row[key] && typeof row[key] === "object") {
                    if (row[key].hasOwnProperty("Text")) {
                        row[key] = row[key].Text;
                    }
                }

                if (typeof row[key] === "object" && Array.isArray(row[key])) {
                    let multiDropdownValues: string = "";
                    row[key].forEach(element => {
                        if (element && typeof element.Text === "string") {
                            multiDropdownValues = element.Text + "," + multiDropdownValues;
                        } else {
                            console.warn("Invalid element in array:", element);
                        }
                    });
                    multiDropdownValues = multiDropdownValues.substring(0, multiDropdownValues.length - 1);
                    row[key] = multiDropdownValues;
                }
            });
        } catch (error) {
            console.error("Error processing row keys:", error);
            return;
        }

        this.thisrow = row;

        if (this.newrow) {
            thisrows.push(this.thisrow);
        } else {
            const index = this.primeNgTableArray[module_dt_count].indexOf(this.selectedValues);
            thisrows[index] = this.thisrow;
        }

        this.primeNgTableArray[module_dt_count] = thisrows;
        this.thisrow = null;
        this.displayDialogModule[module_dt_count] = false;
    }

    save(module_dt_count: number, submodule_dt_count: number) {         //save record in formtable It is not saved in database until sumbit button is clicked
        //debugger;
        let thisrows = [...this.primeNgTableArray[module_dt_count][submodule_dt_count]];
        var row = this.thisrow;
        Object.keys(row).map(function (key, index) {
            if (row[key] != null) {
                if (row[key].hasOwnProperty("Value"))
                    row[key] = row[key].Text; //added for dropdown text

                if (typeof (row[key]) == "object" && !(row[key] instanceof Date) && !(Array.isArray(row[key]))) {
                    let multiDropdownValues: string = "";
                    row[key].forEach(element => {
                        multiDropdownValues = element.Value + "," + multiDropdownValues;

                    });
                    multiDropdownValues = multiDropdownValues.substring(0, multiDropdownValues.length - 1);
                    row[key] = multiDropdownValues;
                }
                // Added for FileUpload
                if (typeof (row[key]) == "object" && (Array.isArray(row[key]))) {

                    if (row[key][0] instanceof File) {
                        var fileNames = "";

                        row[key].forEach(file => {
                            fileNames = file["name"] + "," + fileNames;
                        });
                        row[key] = fileNames.substring(0, fileNames.length - 1);
                        ////console.log(row[key],'rowkey');
                    }
                }
            }

        })
        this.thisrow = row;
        //console.log(this.thisrow, 'rowdata');
        if (this.newrow) {
            thisrows.push(this.thisrow);
            ////console.log(this.thisrow,'newrowdata');
        }
        else {
            thisrows[this.primeNgTableArray[module_dt_count][submodule_dt_count].indexOf(this.selectedValues)] = this.thisrow;
            ////console.log(this.thisrow,'editeddata');
        }

        this.primeNgTableArray[module_dt_count][submodule_dt_count] = thisrows;
        //console.log(this.primeNgTableArray[module_dt_count][submodule_dt_count]);
        this.thisrow = null;
        this.displayDialogModule[module_dt_count][submodule_dt_count] = false;
        ////console.log(this.thisrow,'newrowdata');
    }

    // SubModuleTabel : FileUpload : Sonal
    isString(value: any) {
        if (typeof value == "string")
            return true;
        else
            return false;
    }

    deleteRecordFromCrudTable(module_dt_count: number) {    //record will be deleted after submitting the table
        let index = this.primeNgTableArray[module_dt_count].indexOf(this.selectedValues);
        this.primeNgTableArray[module_dt_count] = this.primeNgTableArray[module_dt_count].filter((val, i) => i != index);
        this.thisrow = null;
        this.displayDialogModule[module_dt_count] = false;
    }
    delete(module_dt_count: number, submodule_dt_count: number) {   //used in formtable
        let index = this.primeNgTableArray[module_dt_count][submodule_dt_count].indexOf(this.selectedValues);
        this.primeNgTableArray[module_dt_count][submodule_dt_count] = this.primeNgTableArray[module_dt_count][submodule_dt_count].filter((val, i) => i != index);
        this.thisrow = null;
        this.displayDialogModule[module_dt_count][submodule_dt_count] = false;
    }
    duplicateRecordInCrudTable(module_dt_count: number) {   // crudtable
        let thisrows = [...this.primeNgTableArray[module_dt_count]];
        var row = this.thisrow;
        Object.keys(row).map(function (key, index) {
            if (row[key] != null) {
                if (row[key].hasOwnProperty("Text"))
                    row[key] = row[key].Text;
            }
            if (key == "ID") {
                row[key] = null;
            }
        })
        this.thisrow = row;
        //console.log(thisrows);
        if (this.newrow)
            thisrows.push(this.thisrow);
        else
            thisrows.push(this.thisrow);

        this.primeNgTableArray[module_dt_count] = thisrows;
        //console.log(this.primeNgTableArray[module_dt_count]);
        this.thisrow = null;
        this.displayDialogModule[module_dt_count] = false;
    }
    duplicate(module_dt_count: number, submodule_dt_count: number) {    //used in formtbale
        let thisrows = [...this.primeNgTableArray[module_dt_count][submodule_dt_count]];
        var row = this.thisrow;
        Object.keys(row).map(function (key, index) {
            if (row[key] != null) {
                if (row[key].hasOwnProperty("Value"))
                    row[key] = row[key].Value;
            }
        })
        this.thisrow = row;
        //console.log(thisrows);
        if (this.newrow)
            thisrows.push(this.thisrow);
        else
            thisrows.push(this.thisrow);

        this.primeNgTableArray[module_dt_count][submodule_dt_count] = thisrows;
        //console.log(this.primeNgTableArray[module_dt_count][submodule_dt_count]);
        this.thisrow = null;
        this.displayDialogModule[module_dt_count][submodule_dt_count] = false;
    }
    onRowSelectInCrudTable(event, SelectableRowKey, SelectableRowKeyValue, cloneRow: boolean, moduleIndex: number, module_dt_count: number) {   // as name suggest
        //console.log(this.thisrow);
        this.newrow = false;
        if (cloneRow == true)
            this.thisrow = this.clonerowOfCrudTable(event.data, moduleIndex);
        else
            this.thisrow = event.data;

        //this.disable = true;

        if (SelectableRowKey != "" && SelectableRowKey != null) {
            if (this.thisrow[SelectableRowKey] == SelectableRowKeyValue)
                this.displayDialogModule[module_dt_count] = true;
        }
        else {
            this.displayDialogModule[module_dt_count] = true;
        }
    }

    onRowSelect(event, SelectableRowKey, SelectableRowKeyValue, cloneRow: boolean, moduleIndex: number, subModuleIndex: number, module_dt_count: number, submodule_dt_count: number) { // on row select in formtable
        //console.log(this.thisrow);
        this.newrow = false;
        if (cloneRow == true)
            this.thisrow = this.clonerow(event.data, moduleIndex, subModuleIndex);
        else
            this.thisrow = event.data;

        this.filterDropdownValues(moduleIndex, subModuleIndex);//filter dependent dropdowns on dialog load
        this.disable = true;

        if (SelectableRowKey != "" && SelectableRowKey != null) {
            if (this.thisrow[SelectableRowKey] == SelectableRowKeyValue)
                this.displayDialogModule[module_dt_count][submodule_dt_count] = true;
        }
        else {
            this.displayDialogModule[module_dt_count][submodule_dt_count] = true;
        }

    }

    clonerowOfCrudTable(c: any, moduleIndex: number) {  //this clone is used for duplicating and copying rowdata from crudtable/cardview to dialog box
        let row = {};
        var ModuleDetails = this.Module[0].moduleList[moduleIndex].moduleDetails;
        for (let prop in c) {
            row[prop] = c[prop];
            var ModuleDetail = ModuleDetails.find(smd => smd.ColumnName == prop);
            if (c[prop] != null && ModuleDetail != undefined) {
                if (ModuleDetail.InputControls == "DropDownList" || ModuleDetail.InputControls == "DependentDropdownList") {
                    if (typeof c[prop] == "string") {
                        row[prop] = ModuleDetail.DropDownValues.find(v => v.Text == c[prop]);
                    }
                    else if (typeof c[prop] == "object") {
                        row[prop] = ModuleDetail.DropDownValues.find(v => v.Text == c[prop].Text);
                    }
                    else if (typeof c[prop] == "number") {
                        row[prop] = ModuleDetail.DropDownValues.find(v => v.Value == c[prop]);
                    }
                }
                else if (ModuleDetail.InputControls == "MultiDropDownList") {
                    if (typeof c[prop] == "string") {

                        // if (c[prop].indexOf(',') > -1) {
                        //   let selected = c[prop];
                        //   selected = c[prop].split(",");
                        //   row[prop] = [];
                        //   selected.forEach(value => {
                        //     row[prop].push(ModuleDetail.DropDownValues.find(v => v.Text == value));
                        //   });
                        // }

                        //updated for v18 by atharva needed to be tested
                        if (c[prop] && c[prop].indexOf(',') > -1) {
                            const selected = c[prop].split(','); // split the string
                            row[prop] = [];

                            selected.forEach(value => {
                                const matched = ModuleDetail.DropDownValues.find(v => v.Text === value.trim());
                                if (matched) {
                                    row[prop].push(matched);
                                }
                            });
                        }
                        else {
                            row[prop] = [];
                            row[prop].push(ModuleDetail.DropDownValues.find(v => v.Text == c[prop]));
                        }
                    }
                    else if (Array.isArray(c[prop])) {
                        row[prop] = [];
                        c[prop].forEach(element => {
                            row[prop].push(ModuleDetail.DropDownValues.find(v => v.Text == element));
                        });
                    }
                }
                else if (ModuleDetail.DataType == "date" || ModuleDetail.DataType == "datetime") {
                    if (typeof c[prop] == "string" && c[prop] != "") {
                        var dateObject = new Date();
                        dateObject = new Date(c[prop]);
                        row[prop] = dateObject;
                    }
                }
            }


        }
        return row;
    }


    clonerow(c: any, moduleIndex: number, subModuleIndex: number): any {    // formtable
        let row = {};
        var subModuleDetails = this.Module[0].moduleList[moduleIndex].submodule[subModuleIndex].subModuleDetails;
        for (let prop in c) {
            row[prop] = c[prop];
            var subModuleDetail = subModuleDetails.find(smd => smd.ColumnName == prop);
            if (c[prop] != null && subModuleDetail != undefined) {
                if (subModuleDetail.InputControls == "DropDownList") {
                    row[prop] = subModuleDetail.DropDownValues.find(v => v.Text == c[prop]);
                }
                else if (subModuleDetail.InputControls == "MultiDropDownList") {
                    let selected: any[] = [];
                    selected = c[prop].split(",");
                    row[prop] = [];
                    selected.forEach(value => {
                        row[prop].push(subModuleDetail.DropDownValues.find(v => v.Text == value));
                    });

                }
            }
        }
        return row;
    }

    PivotWithDialogRowSelect(event, SelectableRowKey, SelectableRowKeyValue, cloneRow: boolean, moduleIndex: number, subModuleIndex: number) {  //as name suggest
        this.RowID = event.index;
        this.newrow = false;

        var SplitVariable = [];
        let StringSplit = SelectableRowKeyValue;
        SplitVariable = StringSplit.split(",");
        //console.log(SplitVariable);


        if (cloneRow == true)
            this.thisrow = this.PivotWithDialogclonerow(event.data, moduleIndex, subModuleIndex);
        else
            this.thisrow = event.data;

        this.disable = true;

        if (!SelectableRowKeyValue.includes(",")) {
            if (SelectableRowKey != "" && SelectableRowKey != null) {
                if (this.thisrow[SelectableRowKey] == SelectableRowKeyValue)
                    this.displayDialog = true;
            }
            else {
                this.displayDialog = true;
            }
        }
        else if (SplitVariable.length > 0) {//for multiple keywords

            SplitVariable.forEach(element => {
                if (this.thisrow[SelectableRowKey] == element)
                    this.displayDialog = true;
            });
        }
    }


    PivotWithDialogclonerow(c: any, moduleIndex: number, subModuleIndex: number): any { //as name suggest
        let row = {};
        var subModuleDetails = this.Module[0].moduleList[moduleIndex].submodule[subModuleIndex].subModuleDetails;
        for (let prop in c) {
            row[prop] = c[prop];
            var subModuleDetail = subModuleDetails.find(smd => smd.ColumnName == prop);
            if (c[prop] != null && subModuleDetail != undefined) {
                if (subModuleDetail.InputControls == "DropDownList") {
                    row[prop] = subModuleDetail.DropDownValues.find(v => v.Text == c[prop]);
                }
                else if (subModuleDetail.InputControls == "MultiDropDownList") {
                    let selected: any[] = [];
                    selected = c[prop].split(",");
                    row[prop] = [];
                    selected.forEach(value => {
                        row[prop].push(subModuleDetail.DropDownValues.find(v => v.Text == value));
                    });

                }
            }
        }
        return row;
    }

    GetPageWithoutModuleData(filter)//function to retrieve only the page structure
    //breadcrumb,filter details,module,module details
    //moduledata will not be retrieved
    {
        //alert("GetPageWithoutModuleData");
        let filterData = {};
        filterData["Filter"] = filter;
        this.show = true;

        this.applyCSSRuleToRow = false;

        let appId: any = null;

        this.CurrentApp = JSON.parse(localStorage.getItem("currentApp"));
        if (this.CurrentApp != null || this.CurrentApp != undefined) appId = this.CurrentApp.ID;

        this.frozenColsArray = [];
        this.scrollableColsArray = [];
        this.selectedColumnsArray = [];
        this.filterColsArray = [];
        this.displayDialogModule = [];
        this.frozenWidthArray = [];
        this.totalRecords = [];
        this.primeNgTableArray = [];
        this.visitedPagesData = [];
        this.moduleLoaderArray = [];
        this.ModuleDataWithRuleArray = [];
        this.temptableArray = [];

        this.getPage(appId, filterData);//returns page structure without data

    }


    EditCard(pkColumnValue, pkColumn, Moduleindex) {
        let data = this.Module[0].moduleList[Moduleindex].moduleData;
        let row = data.find(r => r[pkColumn] == pkColumnValue);
        this.thisrow = row;
        this.thisrow = this.clonerowOfCrudTable(this.thisrow, Moduleindex);

    }
    closeCardDialog() {
        this.addNew = false;
        this.thisrow = {}
    }
    expandTreeRecursive(node: TreeNode, isExpand: boolean) {    //Created to expand the current node as well as all the child node of current node.

        node.expanded = isExpand;

        if (node.children) {

            node.children.forEach(childNode => {

                this.expandTreeRecursive(childNode, false);

            });

        }

    }
    modelChange(event, dtcount) {                       // Created to toggle the columns of pivot table and restore it with orderby
        //console.log(this.selectedColumnsArray[dtcount])
        this.selectedColumnsArray[dtcount] = event;
        this.selectedColumnsArray[dtcount].sort(
            function compare(a, b) {
                if (a.OrderBy < b.OrderBy)
                    return -1;
                if (a.OrderBy > b.OrderBy)
                    return 1;
                return 0;
            }

        );
        //console.log(this.selectedColumnsArray[dtcount]);
    }
    GetPaginatedTreeTable(filter: any) {
        this.expandedElementArray = [];
        filter = JSON.stringify(filter);
        this.show = true;

        this.mainpageservice.GetPaginatedTreeTable(this.Sys_Menu_ID, this.UserName, '{Filter:' + filter + '}').subscribe(data => {
            //console.log("Moduleapi", data);
            this.Module = data;
            var columns = [];
            columns = data["moduleDetails"];
            var treedata = [];
            treedata = data["TreeOutputDataRoot"];
            var moduleDetails = data["moduleDetails"];
            var temp = [];
            if (moduleDetails != null && typeof (moduleDetails) != undefined) {
                moduleDetails.forEach((column) => {
                    if (column.InputControls != 'HiddenField')
                        temp.push(column);
                });
            }
            this.cols = temp;

            let file: FileSystemNode[] = [];

            for (let i = 0; i < (<any>treedata).data.length; i++) {

                let rootObj = (<any>treedata).data[i];
                let node = new FileSystemNode(rootObj, null, columns);
                file.push(node);
            }
            this.files = file;
            //console.log("treedata", this.files);
        });
    }
    nestedFilterCheck(search, data, key) {
        if (typeof data[key] === 'object') {
            for (const k in data[key]) {
                if (data[key][k] !== null) {
                    search = this.nestedFilterCheck(search, data[key], k);
                }
            }
        } else {
            search += data[key];
        }
        return search;
    }//searching nested object array
    showInFilter(ParameterName) {//to show/hide filter fields userwise(userwise menu detail mapping)
        if (this.PageMenuDetails != undefined && this.PageMenuDetails != null)
            return this.PageMenuDetails.filter(menudetail => menudetail.ParameterName == ParameterName)[0].ShowInFilter;
    }
    getPageMenuDetails() {
        let appid = localStorage.getItem("CurrentApp");
        this.CurrentApp = JSON.parse(appid);

        var appliedFilters = localStorage.getItem("filterdata");
        var filterJson = JSON.parse(appliedFilters);
        let promise = new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                let filter1 = localStorage.getItem('navigationExtras');
                this.mainpageservice.getPageMenuDetails(this.Sys_Menu_ID, this.UserName).toPromise().then(filter => {
                    this.PageMenuDetails = filter;
                    if (filterJson != null && filterJson != undefined && Object.keys(filterJson).length !== 0) {
                        //apply default value to all menus with same menudetails
                        if (this.PageMenuDetails != undefined && this.PageMenuDetails.length > 0) {
                            Object.keys(filterJson).forEach(key => {
                                var pagemenudetail = this.PageMenuDetails.find(pgm => pgm.ParameterName == key);
                                if (pagemenudetail != undefined && pagemenudetail != null && filterJson[key] != null) {
                                    if (typeof (filterJson[key]) == "object" && pagemenudetail.InputControl.toLowerCase() == "dropdownlist" && filterJson[key].hasOwnProperty("Value"))
                                        pagemenudetail.DefaultValue = filterJson[key].Value;
                                    else
                                        pagemenudetail.DefaultValue = filterJson[key];
                                }

                            });
                        }
                    }
                    this.show = false;
                    if (this.PageMenuDetails != undefined && this.PageMenuDetails.length > 0) {
                        if (this.PageMenuDetails[0].ParameterName != "rowval") {
                            //get default value from database if parameter name is not rowval
                            var pageFilter = {};
                            this.PageMenuDetails.forEach(menudetail => {
                                if (menudetail.MinDate != "" && menudetail.MaxDate != "") {
                                    var MinDateObject = new Date();

                                    var DDObject = new Date(menudetail.MinDate);
                                    var mon = DDObject.getMonth();
                                    var day = DDObject.getDate();
                                    var year = DDObject.getFullYear();
                                    var hour = DDObject.getHours();
                                    var minutes = DDObject.getMinutes();

                                    MinDateObject = new Date(year, mon, day, hour, minutes);
                                    menudetail.MinDate = MinDateObject;

                                    var MaxDateObject = new Date();

                                    var DObject = new Date(menudetail.MaxDate);
                                    var mon = DObject.getMonth();
                                    var day = DObject.getDate();
                                    var year = DObject.getFullYear();
                                    var hour = DObject.getHours();
                                    var minutes = DObject.getMinutes();

                                    MaxDateObject = new Date(year, mon, day, hour, minutes);
                                    menudetail.MaxDate = MaxDateObject;
                                }

                                if (menudetail.DataType == "month") {//convert default date string to date object
                                    var dateObject = new Date();
                                    if (menudetail.DefaultValue.toLowerCase() == "last") {
                                        dateObject.setMonth(dateObject.getMonth() - 1);

                                        menudetail.DefaultValue = dateObject;
                                        pageFilter[menudetail.ParameterName] = "" + (dateObject.getMonth() + 1) + "/" + dateObject.getFullYear();

                                    }
                                    else if (menudetail.DefaultValue.toLowerCase() == "current" || menudetail.DefaultValue.toLowerCase() == "") {
                                        dateObject.setMonth(dateObject.getMonth());

                                        menudetail.DefaultValue = dateObject;
                                        pageFilter[menudetail.ParameterName] = "" + (dateObject.getMonth() + 1) + "/" + dateObject.getFullYear();

                                    }
                                    else if (menudetail.DefaultValue.toLowerCase() != "last" && menudetail.DefaultValue.toLowerCase() != "" && menudetail.DefaultValue.toLowerCase() != "current") {
                                        var dateArray = menudetail.DefaultValue.split("/");

                                        dateObject.setMonth(dateArray[0] - 1);
                                        dateObject.setFullYear(dateArray[1]);

                                        menudetail.DefaultValue = dateObject;
                                        if (dateArray[0] < 10)
                                            pageFilter[menudetail.ParameterName] = "0" + (dateObject.getMonth() + 1) + "/" + dateObject.getFullYear();
                                        else
                                            pageFilter[menudetail.ParameterName] = "" + (dateObject.getMonth() + 1) + "/" + dateObject.getFullYear();
                                    }

                                }
                                else if (menudetail.DataType == "date" || menudetail.DataType == "datetime") {//convert default date string to date object
                                    var dateObject = new Date();
                                    if (menudetail.DefaultValue != "") {
                                        dateObject = new Date(menudetail.DefaultValue);
                                    }

                                    menudetail.DefaultValue = dateObject;
                                    var month;
                                    if ((dateObject.getMonth() + 1) < 10)
                                        month = "0" + (dateObject.getMonth() + 1);
                                    else
                                        month = dateObject.getMonth() + 1;
                                    pageFilter[menudetail.ParameterName] = "" + dateObject.getFullYear() + "-" + month + "-" + (dateObject.getDate());
                                }
                                else if (menudetail.InputControl.toLowerCase() == "dropdownlist") {
                                    let defaultValue = menudetail.DropDownValues.find(v => v.Value == parseInt(menudetail.DefaultValue));
                                    menudetail.DefaultValue = defaultValue;
                                    pageFilter[menudetail.ParameterName] = defaultValue;
                                }
                                else if (menudetail.InputControl.toLowerCase() == "multidropdownlist") {
                                    let defaultValue = menudetail.DropDownValues.find(v => v.Value == Number(menudetail.DefaultValue));
                                    menudetail.DefaultValue = defaultValue;
                                    pageFilter[menudetail.ParameterName] = defaultValue;
                                }
                                else {
                                    pageFilter[menudetail.ParameterName] = menudetail.DefaultValue;//to create filter json
                                }
                            });
                            //this.GetModulewithFilter(pageFilter);
                            this.GetPageWithoutModuleData(pageFilter);
                            //console.log("PageMenuDetails", this.PageMenuDetails);
                            //console.log("PageFilter", pageFilter);
                        }
                        else {
                            //get modules when rowval exist
                            //this.GetModulewithFilter(filter1);
                            this.GetPageWithoutModuleData(filter1);
                        }
                    }
                    else {
                        //get modules when menu without menu details/filters
                        let tempFilter = localStorage.setItem('navigationExtras', "");
                        //this.GetModulewithFilter(filter1);
                        this.GetPageWithoutModuleData(tempFilter);
                    }
                    this.appliedFilters = JSON.parse(localStorage.getItem("filterdata"));
                    this.filterValues = [];
                    this.PageMenuDetails.forEach((item) => {
                        if (Array.isArray(item)) {
                            item['DefaultValue'].forEach(elm => {
                                this.filterValues.push(elm.Text)
                                // this.appliedFilters.push(elm)
                            })
                        }
                        else if (item.DefaultValue !== null && typeof item.DefaultValue == 'object' && item.DefaultValue.hasOwnProperty('Text')) {
                            //console.log(item)
                            this.filterValues.push(item.DefaultValue.Text)
                            // this.appliedFilters.push(item.DefaultValue)
                        }
                        else if (typeof item.DefaultValue == 'string' && item.DefaultValue !== '') {
                            let pattern = /(0[1-9]|10|11|12)\/[0-9]{4}/;
                            if (pattern.test(item.DefaultValue)) {
                                let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                                let monthInFilter = months[Number(item.DefaultValue.slice(-7, -5)) - 1];
                                // //console.log(month3 + " " + item.slice(-4),'month3')
                                this.filterValues.push(monthInFilter + " " + item.DefaultValue.slice(-4))
                            }
                            else {
                                this.filterValues.push(item.DefaultValue)
                            }
                            // this.filterValues.push(item.DefaultValue)
                            // this.appliedFilters.push(item.DefaultValue)
                        }
                    })

                });

                resolve();
            }, 100)

        });
        return promise;

    }
    getModulesToShow() {//to get modules list to show userwise
        this.mainpageservice.getModulesToShow(this.Sys_Menu_ID, this.UserName).subscribe(data => {
            let dataArray: Array<any> = [];
            for (let item in data) {
                dataArray = data[item];
                this.ModuleIDList.push(dataArray)
            }

        })
    }
    getModuleDetailIdToHide() {
        //To get ModuledetailIDTo hide
        this.mainpageservice.getModuleDetailIdToHide(this.Sys_Menu_ID, this.UserName).subscribe(data => {
            let dataArray: Array<any> = [];
            for (let item in data) {
                dataArray = data[item];
                this.ModuleDetailIDList.push(dataArray)
            }
            this.getFeedback();
        })
    }

    getFeedback() {
        this.mainpageservice.GetFeedback(this.Sys_Menu_ID, this.UserName, undefined).subscribe(data => {
            this.Feedback = data;
        });
    }

    @HostListener('window:beforeunload')    //before unloading a page it checks if page include changes if true then alert a popup to save changes
    canDeactivate(): Observable<boolean> | boolean {
        // insert logic to check if there are pending changes here;
        // returning true will navigate without confirmation
        // returning false will show a confirm dialog before navigating away
        if (this.haveChangesOnPage) {
            return confirm('You have unsaved changes. Discard and leave?');
        }
        else {
            return true;
        }
    }

    ngAfterViewChecked() {
        if (this.Module) {
            let tableModules;
            if (this.Module && this.Module.length > 0) {
                tableModules = this.Module[0].moduleList.filter(m => m.DisplayType.toLowerCase().includes("table") || m.DisplayType.toLowerCase() == "" || m.DisplayType.toLowerCase() == "dataview");
                if (this.primeNgTableArray && this.temptableArray && tableModules && tableModules.length > 0)//to detect changes before leaving the page
                {
                    const data = this.temptableArray.map(a => ({ ...a }));
                    const tempdata = this.temptableArray;
                    const tableCount = this.primeNgTableArray.length;

                    for (var i = 0; i < tableCount; i++) {
                        //console.log("tableModules", tableModules, tableModules[i], this.primeNgTableArray)
                        if (tableModules[i].DisplayType.toLowerCase() != "treetable" && tableModules[i].DisplayType.toLowerCase() != "tree") {
                            if (JSON.stringify(this.primeNgTableArray[i]) != JSON.stringify(tempdata[i])) {
                                this.haveChangesOnPage = true;
                            }
                        }
                        else {
                            if (tableModules[i].DisplayType.toLowerCase() == "treetable") {
                                var updateData = this.files.filter(element => element.data.Updated == true)
                                if (updateData.length > 0) {
                                    this.haveChangesOnPage = true;
                                    //console.log(this.haveChangesOnPage);
                                }
                            }
                        }
                    }
                }
            }

        }

    }
    ngOnInit() {
        this.getPageMenuDetails().then(
            () => this.getModuleDetailIdToHide(),
            () => this.getModulesToShow(),
        )

        //this.routerEventSubscription = this.router.events.pipe(filter((event: RouterEvent) => event instanceof NavigationEnd)
        //).subscribe(() => {//refresh module on reload/navigation like back or submenu click
        //    this.getPageMenuDetails().then(
        //        () => this.getModuleDetailIdToHide(),
        //        () => this.getModulesToShow(),
        //    )
        //});//uncomment this if component should reload on every routing

        this.uploadFile.showValidationLoader = false;
        let menus = JSON.parse(localStorage.getItem("menus"));
        let current_menu = menus.find(m => m.ID == this.Sys_Menu_ID);
        this.events.publish('PageName', current_menu.MenuName);
        this.events.publish('CanActivateNavigation', current_menu.routerLink);
        this.events.publish('activeTopMenu', current_menu);

        this.show = true;
        this.loading = true;
        this.haveChangesOnPage = false;
        let filter1 = localStorage.getItem('navigationExtras');
        this.Locale = localStorage.getItem("Locale");
        this.Currency = localStorage.getItem("Currency");
        this.DateFormat = localStorage.getItem("DateFormat");
        this.TimeZone = localStorage.getItem("TimeZone");
        this.hourFormat = parseInt(localStorage.getItem("HourFormat"));
        if (this.hourFormat == 24) {
            this.dateTimeFormat = this.DateFormat + " HH:mm";
        }
        else
            this.dateTimeFormat = this.DateFormat + " hh:mm";
        // this.router.events.pipe(filter((event: RouterEvent) => event instanceof NavigationEnd)
        // ).subscribe(() => {//refresh module on reload/navigation like back or submenu click
        //     this.GetModulewithFilter(filter1);
        // });

        this.routerEventSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.rowval = this.activateRouter.snapshot.queryParamMap.get('rowval');
            }
        });
        //this.database.getTopic(1).subscribe((response) => {
        //    this.topicId = 1;
        //    this.html = response.Content;
        //    this.editorDisabled = true;
        //    this.isEditButtonClicked = true;
        //});
        this.UserName = localStorage.getItem('username');

        //this.getPageMenuDetails().then(
        //    () => this.getModuleDetailIdToHide(),
        //    () => this.getModulesToShow(),
        //)
        //this.database.getTopic(1).subscribe((response) => {

        //    this.topicId = 1;

        //    this.html = response.Content;

        //    this.editorDisabled = true;

        //    this.isEditButtonClicked = true;

        //});
    }
    GetDependentFilterDropDown(ParameterId, event, index) {
        //debugger;
        var IDvalue = event.value.Value == undefined ? event.value.Value : event.value.Value;
        this.mainpageservice.getDependentFilterDropDownValue(ParameterId, IDvalue).subscribe(response => {
            //debugger;
            //console.log(response);
            var pagemenudetail = this.PageMenuDetails.find(pgm => pgm.ParameterName == index);
            pagemenudetail.DropDownValues = <any>(response)["Table"];
        }, err => {
            //console.log(err);
        });

    }
    filterDropdownValues(moduleIndex, subModuleIndex) {//filter dependent dropdowns on dialog load
        let moduleDetails = this.Module[0].moduleList[moduleIndex].submodule[subModuleIndex].subModuleDetails;

        let mdWithDependentOn = moduleDetails.filter(md => md.DependentOn != 0 && md.AutoPopulateSP == null)//moduledetails with dependentOn and without autoPopulateSP

        if (mdWithDependentOn != null) {
            mdWithDependentOn.forEach(md => {
                let dependentOnID = md.DependentOn;
                let moduleDetail = moduleDetails.find(md => md.ID == dependentOnID);
                let filterValue = this.thisrow[moduleDetail.ColumnName];
                let that = this;
                this.mainpageservice.populateDropdown(moduleDetail.ColumnName, filterValue, md.DropDownSP, this.UserName).subscribe(resp => {
                    //console.log(md.ColumnName, resp);
                    let submoduleDetailIndex = that.Module[0].moduleList[moduleIndex].submodule[subModuleIndex].subModuleDetails.indexOf(md);
                    that.Module[0].moduleList[moduleIndex].submodule[subModuleIndex].subModuleDetails[submoduleDetailIndex].DropDownValues = resp;
                })
            });
        }
    }
    DropdownChange(ModuleDetailId, event, index) {

        if (event.value.Value != '') {
            this.mainpageservice.getDependentDropDownValue(ModuleDetailId, event.value.Value).subscribe(response => {

                ////console.log(response);
                this.DropDown[index] = <any>(response)["Table"];
            }, err => {

            });
        }

    }

    //susan added - start
    GetDependentDropDown(ParameterId, event, index, moduleIndex) {
        //debugger;
        var IDvalue = event.value.Value == undefined ? event.value.Value : event.value.Value;
        //var IDvalue = event.detail.value.Value == undefined ? event.detail.value.Value : event.detail.value.Value;
        var trimValue = $.trim(IDvalue);
        this.mainpageservice.getDependentDropDownValue(ParameterId, trimValue).subscribe(response => {
            //debugger;
            ////console.log(response);
            var moduledetail = this.Module[0].moduleList[moduleIndex].moduleDetails.find(md => md.ColumnName == index);
            moduledetail.DropDownValues = <any>(response)["Table"];
            // var DropDown = document.getElementsByName(index)
            // this.DropDown[index] = <any>(response)["Table"];
        }, err => {
            ////console.log(err);
        });
    }
    //susan added - end
    GetDependentDropDownThroughValue(ParameterId, event, index) {
        //var IDvalue = event.detail.value.Text == undefined ? event.detail.value.Text : event.detail.value.Text;
        var IDvalue = event.value.Text == undefined ? event.value.Text : event.value.Text;
        var trimValue = $.trim(IDvalue);
        this.mainpageservice.GetDependentDropDownThroughValue(ParameterId, trimValue).subscribe(response => {
            //debugger;
            ////console.log(response);
            var DropDown = document.getElementsByName(index)
            this.DropDown[index] = <any>(response)["Table"];
        }, err => {
            //////console.log(err);
        });
    }
    navigateOnFormSubmit(LinkedMenu) {
        let filter = localStorage.getItem("navigationExtras");
        this.events.publish('navigationExtras', JSON.parse(filter));
        let navigationExtras: NavigationExtras = {
            queryParams: JSON.parse(filter)

        };
        this.router.navigateByUrl("/menu/first/tabs/" + LinkedMenu, navigationExtras);

    }

    //Button config save/update FormTable
    UpdateSubmodule(form: any, dt, ID, ButtonId, moduleIndex) {
        var submodules = this.Module[0].moduleList[moduleIndex].submodule;
        submodules.forEach(submodule => {
            var dateColumns = [];
            dateColumns = submodule.subModuleDetails.filter(md => md.DataType == "date");
            if (submodule.DisplayType == "Form") {
                dateColumns.forEach(column => {
                    if (form[column.ColumnName] != null) {
                        let adate = new Date(form[column.ColumnName]);
                        var ayear = adate.getFullYear();
                        var amonth: any = adate.getMonth() + 1;
                        var adt: any = adate.getDate();
                        if (adt < 10) { adt = '0' + adt; }
                        if (amonth < 10) { amonth = '0' + amonth; }
                        form[column.ColumnName] = ayear + '-' + amonth + '-' + adt;
                    }
                })
            }
            else if (submodule.DisplayType == "" || submodule.DisplayType == "PrimeUnfrozenTable") {
                //dt.toArray().foreach(table => {
                dt[0].map(d => {
                    dateColumns.forEach(column => {
                        if (d[column.ColumnName] != null) {
                            let adate = new Date(d[column.ColumnName]);
                            var ayear = adate.getFullYear();
                            var amonth: any = adate.getMonth() + 1;
                            var adt: any = adate.getDate();
                            if (adt < 10) { adt = '0' + adt; }
                            if (amonth < 10) { amonth = '0' + amonth; }
                            d[column.ColumnName] = ayear + '-' + amonth + '-' + adt;
                        }
                    })
                });
                // })

            }
        });


        let filter1 = localStorage.getItem('navigationExtras');
        // this.routerEventSubscription = this.router.events.pipe(filter((event: RouterEvent) => event instanceof NavigationEnd)
        // ).subscribe(() => {//refresh module on reload/navigation like back or submenu click
        //   this.GetPageWithoutModuleData(filter1);
        // });
        this.routerEventSubscription = this.router.events
            .pipe(
                filter((event): event is NavigationEnd => event instanceof NavigationEnd)
            )
            .subscribe(() => {
                this.GetPageWithoutModuleData(filter1);
            });

        this.UserName = localStorage.getItem('username');
        this.show = true;

        this.mainpageservice.UpdateSubmodules(ID, form, dt, ButtonId, this.UserName).subscribe(resp => {
            //console.log(JSON.stringify(resp["Message"]));
            // let toast = this.toastController.create({
            //     message: resp["Message"],
            //     duration: 8000,
            //     position: 'bottom',
            //     //closeButtonText: 'Ok',

            // });
            this.GetPageWithoutModuleData(filter1);

            // toast.then(toast => toast.present());
            this.show = false;

        });
    }

    //Button config save for form
    UpdateData(form: any, ID: any, ButtonId: any, LinkedMenu: any) {
        let filter1 = localStorage.getItem('navigationExtras');
        // this.routerEventSubscription = this.router.events.pipe(filter((event: RouterEvent) => event instanceof NavigationEnd)
        // ).subscribe(() => {
        //   this.GetPageWithoutModuleData(filter1);
        // });
        this.routerEventSubscription = this.router.events
            .pipe(
                filter((event): event is NavigationEnd => event instanceof NavigationEnd)
            )
            .subscribe(() => {
                this.GetPageWithoutModuleData(filter1);
            });
        const that = this;
        let Mess = undefined;
        this.UserName = localStorage.getItem('username');
        this.show = true;

        //Form Without FileUpload
        this.mainpageservice.UpdateData(ID, ButtonId, form, this.UserName).subscribe(resp => {
            ////console.log(JSON.stringify(resp["Message"]));
            // let toast = this.toastController.create({
            //     message: resp["Message"],
            //     duration: 8000,
            //     position: 'bottom',
            //     //closeButtonText: 'Ok',

            // });
            this.GetPageWithoutModuleData(filter1);
            if (LinkedMenu != 0 && LinkedMenu != '' && LinkedMenu != null) {
                this.navigateOnFormSubmit(LinkedMenu);
            }

            // toast.then(toast => toast.present());
            this.show = false;

        });
    }
    //Button config save for table/pivottable
    UpdateDatatable(ID: any, ButtonId: any, index: number, dt, filter: any, LinkedMenu: any) {
        //debugger;
        if (this.rowval != "" && this.rowval != null)
            filter = { 'rowval': this.rowval };

        this.show = true;
        /*type cast date to string*/
        var dateColumns = [];
        dateColumns = this.Module[0].moduleList[index].moduleDetails.filter(md => md.DataType == "date");
        dt.value.map(d => {
            dateColumns.forEach(column => {
                if (d[column.ColumnName] != null) {
                    let adate = new Date(d[column.ColumnName]);
                    var ayear = adate.getFullYear();
                    var amonth: any = adate.getMonth() + 1;
                    var adt: any = adate.getDate();
                    if (adt < 10) { adt = '0' + adt; }
                    if (amonth < 10) { amonth = '0' + amonth; }
                    d[column.ColumnName] = ayear + '-' + amonth + '-' + adt;
                }
                //        if (d[column.ColumnName] != null) {

                //            d[column.ColumnName] = d[column.ColumnName].toISOString();
                //        }
            })
        });

        var datetimeColumns = [];
        datetimeColumns = this.Module[0].moduleList[index].moduleDetails.filter(md => md.DataType == "datetime");
        dt.value.map(d => {
            datetimeColumns.forEach(column => {
                if (d[column.ColumnName] != null) {
                    let adate = new Date(d[column.ColumnName]);
                    var ayear = adate.getFullYear();
                    var amonth: any = adate.getMonth() + 1;
                    var ahour: any = adate.getHours();
                    var aminute: any = adate.getMinutes();
                    var adt: any = adate.getDate();
                    if (adt < 10) { adt = '0' + adt; }
                    if (amonth < 10) { amonth = '0' + amonth; }
                    d[column.ColumnName] = ayear + '-' + amonth + '-' + adt + " " + ahour + ":" + aminute + ":00";
                }
            })
        });

        //var dropdowns = [];
        //dropdowns = this.Module[0].moduleList[index].moduleDetails.filter(md => md.InputControls.includes("DropDownList"));
        //dt.value.map(d => {
        //    dropdowns.forEach(column => {
        //        if (d[column.ColumnName] != null) {
        //            if (d[column.ColumnName].Text != undefined)
        //                d[column.ColumnName] = d[column.ColumnName].Text;
        //            else
        //                d[column.ColumnName] = d[column.ColumnName];
        //        }
        //    })
        //})

        filter = JSON.stringify(filter);
        var data = {};
        if (dt.hasFilter()) {
            data["data"] = dt.filteredValue.slice(0, parseInt(dt.rows) + parseInt(dt.first))
        }
        else {
            data["data"] = dt.value.slice(0, parseInt(dt.rows) + parseInt(dt.first));
        }
        data["filter"] = filter;

        //Form Without FileUpload
        this.mainpageservice.UpdateDatatablewithfilter(ID, this.Sys_Menu_ID, ButtonId, data, this.UserName).subscribe(resp => {
            ////console.log(JSON.stringify(resp["Message"]));
            // let toast = this.toastController.create({
            //     message: resp["Message"],
            //     duration: 8000,
            //     position: 'bottom',
            //     //closeButtonText: 'Ok',

            // });
            this.GetPageWithoutModuleData(filter);
            if (LinkedMenu != 0 && LinkedMenu != '' && LinkedMenu != null) {
                this.navigateOnFormSubmit(LinkedMenu);
            }

            // toast.then(toast => toast.present());
            this.show = false;

        });
    }

    public GetPivotTableModule(ID: number, dt: any, filter: any, dtIndex: number) {
        this.mainpageservice.GetPivotTableModule(this.Sys_Menu_ID, ID, this.UserName, filter).subscribe(res => {
            var val = res;
            if (val["moduleDetails"] != null && typeof (val["moduleDetails"]) != undefined) {
                let primengTableData = val["moduleData"];
                this.primeNgTableArray[dtIndex] = primengTableData;
            }


            if (dt.hasFilter()) {
                //console.log(dt.filters);
                this.primengTable.filters = dt.filters
            }

        });

    }

    //SubmitPrimeNgTable(ID: any, filter: any, dt: any, index: number, dtIndex?: number) {
    //    //debugger;
    //    let filter1 = localStorage.getItem('navigationExtras');
    //    let appId: any = null;
    //    if (this.CurrentApp != null || this.CurrentApp != undefined) appId = this.CurrentApp.ID;
    //    var navigationExtras = {};
    //    if (filter1 != "" && filter1 != undefined && filter1 != null) {
    //        navigationExtras = JSON.parse(filter1);
    //    }

    //    //var navigationExtras = (filter1);
    //    if (filter == null)//dt filter
    //        filter = {};
    //    if (navigationExtras != null && navigationExtras != undefined) {//navigation filters like rowval
    //        Object.keys(navigationExtras).forEach(key => {
    //            filter[key] = navigationExtras[key];
    //        });
    //    }
    //    let appliedFilters = JSON.parse(sessionStorage.getItem('filterdata'));//page menu filters
    //    if (appliedFilters != null && appliedFilters != undefined) {
    //        Object.keys(appliedFilters).forEach(key => {
    //            filter[key] = appliedFilters[key];
    //        });
    //    }

    //    this.show = true;
    //    /*type cast date to string*/
    //    var dateColumns = [];
    //    dateColumns = this.Module[0].moduleList[index].moduleDetails.filter(md => md.DataType == "date");
    //    dt.value.map(d => {
    //        dateColumns.forEach(column => {
    //            if (d[column.ColumnName] != null) {
    //                let adate = new Date(d[column.ColumnName]);
    //                var ayear = adate.getFullYear();
    //                var amonth: any = adate.getMonth() + 1;
    //                var adt: any = adate.getDate();
    //                if (adt < 10) { adt = '0' + adt; }
    //                if (amonth < 10) { amonth = '0' + amonth; }
    //                d[column.ColumnName] = ayear + '-' + amonth + '-' + adt;
    //            }
    //        })
    //    });

    //    var datetimeColumns = [];
    //    datetimeColumns = this.Module[0].moduleList[index].moduleDetails.filter(md => md.DataType == "datetime");
    //    dt.value.map(d => {
    //        datetimeColumns.forEach(column => {
    //            if (d[column.ColumnName] != null) {
    //                let adate = new Date(d[column.ColumnName]);
    //                var ayear = adate.getFullYear();
    //                var amonth: any = adate.getMonth() + 1;
    //                var ahour: any = adate.getHours();
    //                var aminute: any = adate.getMinutes();
    //                var adt: any = adate.getDate();
    //                if (adt < 10) { adt = '0' + adt; }
    //                if (amonth < 10) { amonth = '0' + amonth; }
    //                d[column.ColumnName] = ayear + '-' + amonth + '-' + adt + " " + ahour + ":" + aminute + ":00";
    //            }
    //        })
    //    });

    //    var checkboxColumns = [];
    //    checkboxColumns = this.Module[0].moduleList[index].moduleDetails.filter(md => md.InputControls == "Checkbox");
    //    dt.value.map(d => {
    //        checkboxColumns.forEach(column => {
    //            if (d[column.ColumnName] == null || d[column.ColumnName] == "") {
    //                d[column.ColumnName] = false;
    //            }
    //        })
    //    });

    //    filter = JSON.stringify(filter);
    //    var data = {};
    //    if (!dt.lazy) {
    //        if (dt.hasFilter()) {
    //            data["data"] = dt.filteredValue.slice(0, parseInt(dt.rows) + parseInt(dt.first))
    //        }
    //        else {
    //            dt.totalRecords = dt.value.length;
    //            data["data"] = dt.value.slice(0, parseInt(dt.totalRecords) + parseInt(dt.first));
    //        }
    //    }
    //    else {
    //        if (dt.first == 0) {//to add changes made on first page
    //            this.visitedPagesData[dtIndex] = this.primeNgTableArray[dtIndex];
    //        }
    //        this.visitedPagesData[dtIndex] = this.getMergedArray(this.visitedPagesData[dtIndex], dt.value, this.Module[0].moduleList[index].PrimaryKey);
    //        data["data"] = this.visitedPagesData[dtIndex];
    //    }

    //    data["filter"] = filter;

    //    this.mainpageservice.SavePrimeNgTable1(ID, this.Sys_Menu_ID, data, this.UserName, appId).subscribe(resp => {
    //        let toast = this.toastController.create({
    //            message: resp["Message"],
    //            duration: 8000,
    //            position: 'bottom',
    //            //closeButtonText: 'Ok',

    //        });
    //        if (resp["Message"] == "Record saved successfully!!") {
    //            this.getPageMenuDetails();
    //        }
    //        toast.then(toast => toast.present());
    //        this.show = false;
    //    });
    //}
    //To submit Form

    async SubmitPrimeNgTable(ID: any, filter: any, dt: any, index: number, dtIndex?: number) {
        let filter1 = localStorage.getItem('navigationExtras');
        let appId: any = null;
        if (this.CurrentApp != null || this.CurrentApp != undefined) appId = this.CurrentApp.ID;
        var navigationExtras = {};
        if (filter1 != "" && filter1 != undefined && filter1 != null) {
            navigationExtras = JSON.parse(filter1);
        }

        if (filter == null) filter = {};
        if (navigationExtras != null && navigationExtras != undefined) {
            Object.keys(navigationExtras).forEach(key => {
                filter[key] = navigationExtras[key];
            });
        }
        let appliedFilters = JSON.parse(sessionStorage.getItem('filterdata'));
        if (appliedFilters != null && appliedFilters != undefined) {
            Object.keys(appliedFilters).forEach(key => {
                filter[key] = appliedFilters[key];
            });
        }

        this.show = true;

        // Processing date columns, datetime columns, and checkbox columns
        var dateColumns = this.Module[0].moduleList[index].moduleDetails.filter(md => md.DataType == "date");
        dt.value.map(d => {
            dateColumns.forEach(column => {
                if (d[column.ColumnName] != null) {
                    let adate = new Date(d[column.ColumnName]);
                    var ayear = adate.getFullYear();
                    var amonth: any = adate.getMonth() + 1;
                    var adt: any = adate.getDate();
                    if (adt < 10) { adt = '0' + adt; }
                    if (amonth < 10) { amonth = '0' + amonth; }
                    d[column.ColumnName] = ayear + '-' + amonth + '-' + adt;
                }
            })
        });

        var datetimeColumns = this.Module[0].moduleList[index].moduleDetails.filter(md => md.DataType == "datetime");
        dt.value.map(d => {
            datetimeColumns.forEach(column => {
                if (d[column.ColumnName] != null) {
                    let adate = new Date(d[column.ColumnName]);
                    var ayear = adate.getFullYear();
                    var amonth: any = adate.getMonth() + 1;
                    var ahour: any = adate.getHours();
                    var aminute: any = adate.getMinutes();
                    var adt: any = adate.getDate();
                    if (adt < 10) { adt = '0' + adt; }
                    if (amonth < 10) { amonth = '0' + amonth; }
                    d[column.ColumnName] = ayear + '-' + amonth + '-' + adt + " " + ahour + ":" + aminute + ":00";
                }
            })
        });

        var checkboxColumns = this.Module[0].moduleList[index].moduleDetails.filter(md => md.InputControls == "Checkbox");
        dt.value.map(d => {
            checkboxColumns.forEach(column => {
                if (d[column.ColumnName] == null || d[column.ColumnName] == "") {
                    d[column.ColumnName] = false;
                }
            })
        });

        filter = JSON.stringify(filter);
        var data = {};
        if (!dt.lazy) {
            if (dt.hasFilter()) {
                data["data"] = dt.filteredValue.slice(0, parseInt(dt.rows) + parseInt(dt.first));
            } else {
                dt.totalRecords = dt.value.length;
                data["data"] = dt.value.slice(0, parseInt(dt.totalRecords) + parseInt(dt.first));
            }
        } else {
            if (dt.first == 0) {
                this.visitedPagesData[dtIndex] = this.primeNgTableArray[dtIndex];
            }
            this.visitedPagesData[dtIndex] = this.getMergedArray(this.visitedPagesData[dtIndex], dt.value, this.Module[0].moduleList[index].PrimaryKey);
            data["data"] = this.visitedPagesData[dtIndex];
        }

        data["filter"] = filter;

        try {
            const resp = await this.mainpageservice.SavePrimeNgTable1(ID, this.Sys_Menu_ID, data, this.UserName, appId).toPromise();
            // let toast = await this.toastController.create({
            //     message: resp["Message"],
            //     duration: 8000,
            //     position: 'bottom',
            // });

            // await toast.present();
            this.show = false;

            // If the record is saved successfully, process the modules
            if (resp["Message"] == "Record saved successfully!!") {
                // Loop through moduleList and process each module sequentially
                let moduleList = this.Module[0].moduleList;

                // Use async function and 'for...of' to iterate over the module list sequentially
                const processModules = async () => {
                    for (let val of moduleList) {
                        if (val.DisplayType.toLowerCase() == "multichart") {
                            this.getMultiChart(val, moduleList.indexOf(val), filter1, appId);
                        }
                        if ((val.DisplayType.toLowerCase() == 'primengpivottable' || val.DisplayType.toLowerCase() == 'primeunfrozentable' || val.DisplayType.toLowerCase() == 'crudtable') && (val.collectionName != "" && val.collectionName != null)) {
                            await this.saveData(ID, val, appId); // Ensures sequential execution
                        }
                    }
                };

                await processModules();

            }
        } catch (error) {
            console.error("Error while saving data:", error);
            this.show = false;
        }
    }
    // save function cretae mongo collection in background
    async saveData(ID: any, val: any, appId: any) {
        try {
            const resp = await this.mainpageservice.SubmitMongoCollection(ID, this.Sys_Menu_ID, this.UserName, appId).toPromise();
            console.log('Data saved successfully:', resp);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    onSubmit(form: any, ID: any, LinkedMenu: any, moduleIndex): void {

        form = form.value;
        let appId: any = null;
        if (this.CurrentApp != null || this.CurrentApp != undefined) appId = this.CurrentApp.ID;
        let filter1 = localStorage.getItem('navigationExtras');

        // Added by Mayuri - to pass AppId as Filter
        let FilterData = {};
        try {
            if (filter1 != null && filter1.trim() !== '') {
                FilterData = JSON.parse(filter1);
            }
        } catch (error) {
            //console.error('Error parsing JSON:', error);
        }
        FilterData["AppId"] = this.CurrentApp.ID;
        filter1 = JSON.stringify(FilterData);


        var moduledetails = this.Module[0].moduleList[moduleIndex].moduleDetails;

        Object.keys(form).forEach(key => {
            var v = moduledetails.filter(md => md.ColumnName == key);

            if (v.length > 0 && v != undefined) {
                if (v[0].DataType == "date") {
                    if (form[key] != null) {
                        let adate = new Date(form[key]);
                        var ayear = adate.getFullYear();
                        var amonth: any = adate.getMonth() + 1;
                        var adt: any = adate.getDate();
                        if (adt < 10) { adt = '0' + adt; }
                        if (amonth < 10) { amonth = '0' + amonth; }
                        form[key] = ayear + '-' + amonth + '-' + adt;
                    }
                }
                else if (v[0].DataType == "month") {
                    if (form[key] != null) {
                        let adate = new Date(form[key]);
                        var ayear = adate.getFullYear();
                        var amonth: any = adate.getMonth() + 1;
                        if (amonth < 10) { amonth = '0' + amonth; }
                        form[key] = amonth + "/" + ayear;
                    }
                }
                if (v[0].InputControls == "Checkbox") {
                    if (form[key] == null || form[key] == "") {
                        form[key] == false;
                    }
                }
            }
        })
        // this.routerEventSubscription = this.router.events.pipe(filter((event: RouterEvent) => event instanceof NavigationEnd)
        // ).subscribe(() => {//refresh module on reload/navigation like back or submenu click
        //   this.GetPageWithoutModuleData(filter1);
        // });
        //updated by Atharva from above code for v18 needed to be tested
        this.routerEventSubscription = this.router.events
            .pipe(
                filter((event): event is NavigationEnd => event instanceof NavigationEnd)
            )
            .subscribe(() => {
                this.GetPageWithoutModuleData(filter1);
            });

        this.UserName = localStorage.getItem('username');
        this.show = true;

        Object.keys(form).map(function (key, index) {//with file upload
            if (Array.isArray(form[key]))// convert file object to file name string
            {
                if (form[key][0] instanceof File) {
                    var fileNames = "";

                    form[key].forEach(file => {
                        fileNames = file["name"] + "," + fileNames;
                    });
                    form[key] = fileNames.substring(0, fileNames.length - 1);
                }
            }
        });

        this.saveForm(ID, moduleIndex, form, LinkedMenu, appId, filter1);

    }

    async saveForm(ID, moduleIndex, form, LinkedMenu, appId, filter1) {
        //Form Without FileUpload
        let formObject = form;
        const resp = await this.mainpageservice.Savedata(ID, form, this.UserName, appId, filter1).toPromise();
        // let toast = this.toastController.create({
        //     message: resp["Message"],
        //     duration: 8000,
        //     position: 'bottom',
        //     //closeButtonText: 'Ok',

        // });
        if (LinkedMenu != 0 && LinkedMenu != '' && LinkedMenu != null) {
            this.navigateOnFormSubmit(LinkedMenu);
        }

        // toast.then(toast => toast.present());
        this.show = false;
        if (resp["Message"] == "Record saved successfully!!") {
            //this.GetModulewithFilter(filter1);
            this.activeTabIndex = (this.activeTabIndex === this.moduleListDataLength - 1) ? 0 : this.activeTabIndex + 1;
            if (this.Module != undefined) {
                if (moduleIndex + 1 < this.Module[0].moduleList.length) {
                    let i = this.Module[0].moduleList[moduleIndex + 1].TabModuleDependency;
                    this.DisabledArray[i + 1] = false;
                    //console.log("updatedDisabledData", this.DisabledArray)
                    this.StepactiveIndex = this.StepactiveIndex + 1
                    // this.stepTabDisable=false;
                }

            }
            this.getPageMenuDetails();
            var moduledetails = this.Module[0].moduleList[moduleIndex].moduleDetails;
            if (moduledetails.filter(md => md.InputControls.toLowerCase() == 'fileupload').length > 0)//only if the form has file upload
                this.uploadFile.uploadFile();//upload file to azure blob storage----> Added by Ruchita 18/7/2024

            let module = this.Module[0].moduleList.find(m => m.ID == ID)//if module is for create new User 
            if (module.ModuleName.toLowerCase() == "create new user")
                this.createACSUserId(form.UserName);//assigns ACS userid to newly created user

            formObject.reset();
        }
    }

    handleChange(event) {
        this.StepactiveIndex = event.index;
    }

    GetFileSelected(files: Array<File>) {
        //debugger;
        this.FileList = files;

    }
    //For Saving The FeedBack of the ccustomers
    onSubmitFeedback(form: any): void {

        const that = this;

        let Mess = undefined;

        this.UserName = localStorage.getItem('username');

        this.show = true;

        //Form Without FileUpload

        this.mainpageservice.SaveFeedback(this.Sys_Menu_ID, form, this.UserName).subscribe(resp => {

            ////console.log(JSON.stringify(resp["Message"]));

            // let toast = this.toastController.create({

            //     message: resp["Message"],

            //     duration: 8000,

            //     position: 'bottom',

            //     //closeButtonText: 'Ok',

            // });

            // toast.then(toast => toast.present());

            this.show = false;

            this.mainpageservice.GetFeedback(this.Sys_Menu_ID, this.UserName, undefined).subscribe(data => {

                ////console.log("Moduleapi", data);

                this.Feedback = data;

                this.show = false;



            });

        });

    }

    Savedatatable(form: any, ID: any): void {

        const that = this;
        let Mess = undefined;
        let appId: any = null;
        if (this.CurrentApp != null || this.CurrentApp != undefined) appId = this.CurrentApp.ID;
        this.UserName = localStorage.getItem('username');
        this.show = true;
        let filter = localStorage.getItem('navigationExtras');

        //Form Without FileUpload
        this.mainpageservice.SaveDatatable(ID, form, this.UserName, appId).subscribe(resp => {
            ////console.log(JSON.stringify(resp["Message"]));
            // let toast = this.toastController.create({
            //     message: resp["Message"],
            //     duration: 8000,
            //     position: 'bottom',
            //     //closeButtonText: 'Ok',

            // });
            this.GetPageWithoutModuleData(filter);
            // toast.then(toast => toast.present());
            this.show = false;

        });

    }

    onSubmitFilter(formdata: any): void {

        this.displayedColumnArray = [];

        this.appliedFilters = formdata;

        Object.keys(formdata).forEach(key => {
            var v = this.PageMenuDetails.filter(md => md.ParameterName == key);
            if (v[0].DataType == "month") {
                if (formdata[key] != null) {
                    let adate = new Date(formdata[key]);
                    if (adate != undefined && adate.toString() != "Invalid Date") {
                        var ayear = adate.getFullYear();
                        var amonth: any = adate.getMonth() + 1;
                        if (amonth < 10) { amonth = '0' + amonth; }
                        formdata[key] = amonth + "/" + ayear;
                    }
                }
            }
            else if (v[0].DataType == "date") {
                if (formdata[key] != null) {
                    let adate = new Date(formdata[key]);
                    if (adate != undefined && adate.toString() != "Invalid Date") {
                        var ayear = adate.getFullYear();
                        var amonth: any = adate.getMonth() + 1;
                        var adt: any = adate.getDate();
                        if (adt < 10) { adt = '0' + adt; }
                        if (amonth < 10) { amonth = '0' + amonth; }
                        formdata[key] = ayear + '-' + amonth + '-' + adt;
                    }
                }
            }
            else if (v[0].DataType == "datetime") {
                if (formdata[key] != null) {
                    let adate = new Date(formdata[key]);
                    if (adate != undefined && adate.toString() != "Invalid Date") {
                        var ayear = adate.getFullYear();
                        var amonth: any = adate.getMonth() + 1;
                        var adt: any = adate.getDate();
                        var hour: any = adate.getHours();
                        var min: any = adate.getMinutes();
                        var sec: any = adate.getSeconds();
                        if (adt < 10) { adt = '0' + adt; }
                        if (amonth < 10) { amonth = '0' + amonth; }
                        formdata[key] = ayear + '-' + amonth + '-' + adt + ' ' + hour + ':' + min + ':' + sec;
                    }
                }
            }
        })
        this.filterValues = []

        Object.values(formdata).forEach((item) => {
            if (Array.isArray(item)) {
                item.forEach(elm => {
                    this.filterValues.push(elm.Text)
                })
            }
            else if (item !== null && typeof item == 'object' && item.hasOwnProperty('Text')) {
                this.filterValues.push(item['Text'])
            }
            else if (typeof item == 'string' && item !== '') {
                let pattern = /(0[1-9]|10|11|12)\/[0-9]{4}/;
                if (pattern.test(item)) { //for the date and month filter
                    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    let monthInFilter = months[Number(item.slice(-7, -5)) - 1];
                    // //console.log(month3 + " " + item.slice(-4),'month3')
                    this.filterValues.push(monthInFilter + " " + item.slice(-4))
                }
                else {
                    this.filterValues.push(item)
                }
            }
        })

        //console.log('you submitted value in Filter:', formdata);
        let data: any;
        data = JSON.stringify(formdata);
        //data = '{"Filter":' + data + '}';
        ////console.log(data);
        this.UserName = localStorage.getItem('username');
        localStorage.setItem('filterdata', data);
        this.datatableparam = sessionStorage.getItem('datatableparameter');
        ////console.log(this.datatableparam);
        this.GetPageWithoutModuleData(formdata);
        this.showfilter = false;
        if (this.showfilter == false && this.horizontalFilter == false) {
            this.showfilter = true;
        }

    }

    //removing the filter values from chips
    remove(i) {
        ////console.log(this.appliedFilters, 'in remove before loop')
        ////console.log(this.PageMenuDetails, 'PageMenuDetails before remove loop')
        // let filterData = localStorage.getItem("filterdata");
        // this.appliedFilters = filterData;
        ////console.log(this.appliedFilters, 'in remove before loop after local storage')
        Object.keys(this.appliedFilters).forEach(item => {
            if (typeof this.appliedFilters[item] === 'object' &&
                !Array.isArray(this.appliedFilters[item]) &&
                this.appliedFilters[item] !== null && this.appliedFilters[item]['Text'] == i) {
                //console.log(item)
                this.PageMenuDetails.filter(elem => elem.ParameterName === item)[0].DefaultValue = ''
                // elem.DefaultValue.Text === i)[0].DefaultValue = ''
                this.appliedFilters[item] = ''
            }
            else if (Array.isArray(this.appliedFilters[item])) {
                this.appliedFilters[item].forEach((elm, index) => {
                    if ((elm['Text'] == i)) {
                        this.PageMenuDetails.find(elem => elem.ParameterName === item).DefaultValue.splice(index, 1)
                    }
                })
            }
            else if (typeof this.appliedFilters[item] == 'string' && this.appliedFilters[item] == i) {

                this.PageMenuDetails.find(elem => elem.ParameterName === item).DefaultValue = ''
                this.appliedFilters[item] = ''
            }
        })
        ////console.log(this.filterValues, 'remove')
        ////console.log(this.PageMenuDetails, 'this is a pageMenuDetails in remove')
        ////console.log(this.appliedFilters, 'this.appliedFilters in remove')
    }
    //end of removing the filter

    downloadreport(): void {
        //alert(menuid);
        this.show = true;

        let filter: any;
        this.UserName = localStorage.getItem('username');
        filter = localStorage.getItem('filterdata');
        this.mainpageservice.exporttoexcel(this.Sys_Menu_ID, this.UserName, filter).subscribe(resp => {
            ////console.log(resp);

            //  application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
            var blob = new Blob([resp], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            var filename = 'download_report.xlsx';

            saveAs(blob, filename);
            this.show = false;
        })


    }

    downloadModuleReport(moduleId, moduleName) {
        //debugger;
        this.show = true;

        let filters: any;
        let data: any = {};
        this.UserName = localStorage.getItem('username');
        let filter = localStorage.getItem('navigationExtras');
        var param = {};
        if (filter != "" && filter != undefined && filter != null) {
            param = JSON.parse(filter);
        }

        filters = localStorage.getItem('filterdata');
        if (filters == null) data.Filter = {};
        else {
            data["Filter"] = JSON.parse(filters);
        }
        if (filter != null && filter != undefined && filter != "")
            data.Filter["rowval"] = param["rowval"];
        //debugger;

        this.mainpageservice.exporttoexcelModulewise(moduleId, this.UserName, JSON.stringify(data), this.CurrentApp.ID).subscribe(resp => {
            ////console.log(resp);

            //  application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
            var blob = new Blob([resp], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            var filename = moduleName + '.xlsx';

            saveAs(blob, filename);

        })
        this.show = false;
    }

    downloadTableSchema(tableName) {
        //debugger;
        this.show = true;
        let appId: any = null;
        if (this.CurrentApp != null || this.CurrentApp != undefined) appId = this.CurrentApp.ID;
        let filters: any;
        let data: any = {};
        this.UserName = localStorage.getItem('username');
        let filter = localStorage.getItem('navigationExtras');
        var param = {};
        if (filter != "" && filter != undefined && filter != null) {
            param = JSON.parse(filter);
        }

        filters = localStorage.getItem('filterdata');
        if (filters == null) data.Filter = {};
        else {
            data["Filter"] = JSON.parse(filters);
        }
        if (filter != null && filter != undefined && filter != "")
            data.Filter["rowval"] = param["rowval"];

        this.mainpageservice.downloadTableSchema(tableName, this.UserName, JSON.stringify(data), appId).subscribe(resp => {
            //debugger;
            //console.log(resp);
            // var blob = new Blob([resp], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            var blob = new Blob([resp], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            if (tableName == null || tableName == '' || tableName == "" || tableName == undefined) {
                var filename = 'DownloadAll.xlsx';
            }
            else {
                var filename = tableName + '.xlsx';
            }
            saveAs(blob, filename);

        })
        this.show = false;
    }

    navigatePath(i, LinkedMenu, moduleIndex) {
        var ModuleDetails = this.Module[0].moduleList[moduleIndex].moduleDetails;
        let navigate = ModuleDetails.forEach((data) => {
            if (data.InputControls == 'Link') {
                var key = Object.keys(i)
                var findKey = key.find(v => v == data.ColumnName);
                i = i[findKey]
            }
        })
        this.navigate(i, LinkedMenu);
    }

    ngAfterViewInit(): void {
        // this.slides.lockSwipes(true);
    }

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        this.routerEventSubscription.unsubscribe();
        this.events.destroy('navigationExtras');
        clearInterval(this.processFlowInterval);
    }

    //ionViewDidLeave(): void {
    //    //localStorage.removeItem("navigationExtras");

    //    // Do not forget to unsubscribe the event
    //    this.routerEventSubscription.unsubscribe();
    //    this.events.destroy('navigationExtras');
    //}
    onWizardSubmit(ID: any): void {
        //debugger;
        this.UserName = localStorage.getItem('username');
        this.show = true;
        let form = JSON.stringify(this.WizardFormValue)
        //Form Without FileUpload
        this.mainpageservice.Savedata(ID, form, null).subscribe(resp => {
            ////console.log(JSON.stringify(resp["Message"]));
            // let toast = this.toastController.create({
            //     message: resp["Message"],
            //     duration: 8000,
            //     position: 'bottom',
            //     //closeButtonText: 'Ok',

            // });
            // toast.then(toast => toast.present());
            this.show = false;

        });

    }
    selectFile(id) {
        //to reset file upload control in listview display type
        this.fileUploadId = id

    }

    doAsyncGenerateReport(Rowval, ModuleId, ModuleDetailId, ReportType) {
        let promise = new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                let data: any
                this.UserName = localStorage.getItem('username');
                data = '{Rowval:"' + Rowval + '",' + 'ModuleDetailId:"' + ModuleDetailId + '",ModuleId:"' + ModuleId + '"}';


                this.mainpageservice.GenerateReport(ReportType, this.UserName, JSON.stringify(data)).subscribe(resp => {

                    //  application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
                    var blob = new Blob([resp], { type: 'application/pdf' });
                    var d = new Date();
                    var montharr = d.getMonth() + 1;
                    var month = (montharr < 10 ? '0' : '') + montharr;
                    var day = ((d.getDate()) < 10 ? '0' : '') + (d.getDate());
                    var year = d.getFullYear();
                    var x = year + '-' + month + '-' + day;
                    var filename = ReportType + x + '.pdf';

                    saveAs(blob, filename);
                    this.show = false;
                });
                resolve();
            }, 1000);
        });

        //debugger;
        return promise;
    }

    GenerateReport(Rowval, ModuleId, ModuleDetailId, ReportType) {
        if (Rowval == '' || typeof (Rowval) === undefined || Rowval == null) {
            let filter = localStorage.getItem("navigationExtras");
            let param = JSON.parse(filter);
            Rowval = param["rowval"];
        }


        this.doAsyncGenerateReport(Rowval, ModuleId, ModuleDetailId, ReportType).then(
            () => this.show = true,
            // () => ////console.log("Task Errored!"),
        );

    }
    SendReport(Rowval, ModuleId, ModuleDetailId, ReportType) {
        let data: any
        this.UserName = localStorage.getItem('username');
        data = '{Rowval:"' + Rowval + '",' + 'ModuleDetailId:"' + ModuleDetailId + '",ModuleId:"' + ModuleId + '"}';


        this.mainpageservice.SendReport(ReportType, this.UserName, JSON.stringify(data)).subscribe(resp => {

            // let toast = this.toastController.create({
            //     message: "Mail sent successfully!",
            //     duration: 8000,
            //     position: 'bottom',
            //     //closeButtonText: 'Ok',

            // });
            // toast.then(toast => toast.present());
            this.show = false;

        })
    }

    toggleOTPEmail(email: any) {
        this.VerifiedEmailId = email;
        this.showContainerEmail = true;
        this.mainpageservice.GenerateOTPEmail(email).subscribe(resp => {
            alert(JSON.stringify(resp));
            let OTP = resp["OTP"];
            localStorage.setItem('OTP', OTP);

        });
    }
    CheckOTP(OTP: any) {
        let OTPValue = localStorage.getItem('OTP');
        if (OTP == OTPValue) {
            alert("Email validated");
            localStorage.removeItem('OTP');
            this.showContainerEmail = false;
            this.ValidatedEmail = true;
        }
        else {
            alert("OTP not valid");
        }
    }

    setStep(index: number) {
        this.step = index;
    }

    nextStep() {
        this.step++;
    }

    prevStep() {
        this.step--;
    }

    //pivottablereview navigation
    nextReview() {
        this.StepactiveIndex = (this.StepactiveIndex === 2) ? 0 : this.StepactiveIndex + 1;
    }

    prevReview() {
        this.StepactiveIndex = (this.StepactiveIndex === 0) ? 2 : this.StepactiveIndex - 1;
    }

    multipleDependantDropdown(moduleDetailId, value, dependantSP, moduleIndex, subModuleIndex) {
        var dd = this.Module[0].moduleList[moduleIndex].submodule[subModuleIndex].subModuleDetails.filter(md => md.DependentOn == moduleDetailId);
        //console.log(dd);
        this.mainpageservice.MultipleDependentDropdown(moduleDetailId, value, dependantSP, this.UserName).subscribe(resp => {
            //console.log(resp);
            var i = 0;
            dd.forEach(md => {
                var index = "";
                var dependentDropdown = this.Module[0].moduleList[moduleIndex].submodule[0].subModuleDetails.find(smd => smd.ID == md.ID);
                if (i != 0)
                    index = "" + i;
                dependentDropdown.DropDownValues = resp["Table" + index];
                i++;
            });
        })
    }


    autoPopulateMultipleFields(moduleDetailId, filterByValue, auotoPopulateSP, moduleIndex, subModuleIndex) {
        //For FormTableSubmodule only
        var dd = this.Module[0].moduleList[moduleIndex].submodule[subModuleIndex].subModuleDetails.filter(md => md.DependentOn == moduleDetailId);
        if (this.Module[0].moduleList[moduleIndex].submodule[subModuleIndex].DisplayType == "Form") {
            var tableSubmoduleIndex = this.Module[0].moduleList[moduleIndex].submodule.findIndex(sm => sm.DisplayType == "PrimeUnfrozenTable");
            var tableDropdown = this.Module[0].moduleList[moduleIndex].submodule[tableSubmoduleIndex].subModuleDetails.filter(md => md.InputControls.toLowerCase() == "dropdownlist")
            tableDropdown.forEach(element => {
                this.GetValuesForDependentDropdown(element.ID, filterByValue, moduleIndex, subModuleIndex);//Form to table dependent dropdown
            });
        }
        this.mainpageservice.AutoPopulateMultipleFields(filterByValue.Text, auotoPopulateSP, this.UserName).subscribe(resp => {
            //console.log(resp);
            var value = "";
            dd.forEach(md => {
                var fieldToBePopulated = this.Module[0].moduleList[moduleIndex].submodule[subModuleIndex].subModuleDetails.find(smd => smd.ID == md.ID);
                if (fieldToBePopulated.InputControls.toLowerCase() == "dropdownlist")
                    value = fieldToBePopulated.DropDownValues.find(o => o.Text == resp[0][md.ColumnName]);
                else ///other input controls
                    value = resp[0][md.ColumnName];

                if (this.Module[0].moduleList[moduleIndex].submodule[subModuleIndex].DisplayType != "Form")
                    this.thisrow[md.ColumnName] = value;//for dialog box fields
                else
                    this.Module[0].moduleList[moduleIndex].submodule[subModuleIndex].subModuleDetails.find(f => f.ColumnName == md.ColumnName).value = value;//for Form fields

                this.disable = true;//to disable auto populated fields
            });
        })
    }


    setImportPanel(importPanel) {//To show file upload modulewise on Upload button click
        importPanel.hidden = !importPanel.hidden;
    }

    async Run(i) {
        let qm = { "rowval": i };
        this.UserName = localStorage.getItem('username');
        this.show = true;

        this.mainpageservice.RunWorkflowTask(i, this.UserName, undefined).subscribe(async resp => {

            //console.log(JSON.stringify(resp["Message"]));
            //To display loader
            // let toast = this.toastController.create({
            //     message: resp["Message"],
            //     duration: 8000,
            //     position: 'bottom',
            //     //closeButtonText: 'Ok',

            // });
            // toast.then(toast => toast.present());
            this.show = false;
            await this.events.publish('Notification');
            this.events.publish('PopUp');
        });

    }

    GetValuesForDependentDropdown(DDModuleDetailID, filterByValue, moduleIndex, subModuleIndex?: number) {
        if (subModuleIndex != null && subModuleIndex != undefined) {
            var dd = this.Module[0].moduleList[moduleIndex].submodule[subModuleIndex].subModuleDetails.filter(md => md.ID == DDModuleDetailID);
            //console.log(dd);
            this.mainpageservice.MultipleDependentDropdown(DDModuleDetailID, filterByValue.Text, dd[0].DropDownSP, this.UserName).subscribe(resp => {
                //console.log(resp);
                var i = 0;
                dd.forEach(md => {
                    var index = "";
                    var dependentDropdown = this.Module[0].moduleList[moduleIndex].submodule[subModuleIndex].subModuleDetails.find(smd => smd.ID == md.ID);
                    if (i != 0)
                        index = "" + i;
                    dependentDropdown.DropDownValues = resp["Table"];
                    i++;
                });
            })
        }
    }

    GetDependentDropDownFormtable(mdID, event, dependentDropdown, moduleIndex, subModuleIndex) {
        //debugger;
        let moduledetail = this.Module[0].moduleList[moduleIndex].submodule[subModuleIndex].subModuleDetails.find(md => md.ID == parseInt(mdID));
        let submoduleDetailIndex = this.Module[0].moduleList[moduleIndex].submodule[subModuleIndex].subModuleDetails.indexOf(moduledetail);
        let dependentDropdowns = this.Module[0].moduleList[moduleIndex].submodule[subModuleIndex].subModuleDetails.filter(md => md.DependentOn == moduledetail.ID);
        let isPresentInDependentOn = dependentDropdowns.length > 0 ? true : false;

        if (isPresentInDependentOn) {
            this.filterDependentDropdownvalues(moduleIndex, subModuleIndex, submoduleDetailIndex);
        }
        else {
            var selectedValue = event.value.Value == undefined ? event.value.Value : event.value.Value;
            var filterByValue = $.trim(selectedValue);

            this.mainpageservice.GetDependentDropDownFormtable(mdID, filterByValue).subscribe(response => {
                var moduledetail = this.Module[0].moduleList[moduleIndex].submodule[subModuleIndex].subModuleDetails.find(md => md.ColumnName == dependentDropdown);
                moduledetail.DropDownValues = <any>(response)["Table"];
            }, err => {
            });
        }

    }


    filterDependentDropdownvalues(moduleIndex, subModuleIndex, submoduleDetailIndex) {
        //debugger;
        let currentModuleDetail = this.Module[0].moduleList[moduleIndex].submodule[subModuleIndex].subModuleDetails[submoduleDetailIndex];

        //to get all dependent dropdowns
        let dependentDropdowns = this.Module[0].moduleList[moduleIndex].submodule[subModuleIndex].subModuleDetails.filter(md => md.DependentOn == currentModuleDetail.ID);
        let filterByList = [];

        if (currentModuleDetail.DependentOn != 0 && currentModuleDetail.DependentOn != null) {
            filterByList = this.findDependentOnModuleDetail(currentModuleDetail, []);//check all dependent fields recursively

            dependentDropdowns.forEach(dropdown => {
                this.mainpageservice.FilterDropdownValues(filterByList, dropdown.DropDownSP, this.UserName).subscribe(response => {
                    dropdown.DropDownValues = response;
                }, err => {
                });
            });
        }

    }


    findDependentOnModuleDetail(moduleDetail, filterByList) {//recursively gets all the field with its value and returns the array
        /* e.g.
         State->District->Tehsil->City
         then Parameters for District will be State, Parameters for Tehsil will be State and District, Paramters for City will be State,District and Tehsil.
         */
        let currentModuleDetail = moduleDetail;

        let filterByValue = this.thisrow[currentModuleDetail.ColumnName];
        let filterByKey = currentModuleDetail.ColumnName;

        let filterBy = {};
        filterBy["key"] = filterByKey;

        if (typeof filterByValue == "string")//for non dropdown fields
            filterBy["value"] = filterByValue
        else if (filterByValue.hasOwnProperty("Text"))//for dropdown
            filterBy["value"] = filterByValue.Text;

        filterByList.push(filterBy);
        currentModuleDetail = this.Module[0].moduleList[0].submodule[1].subModuleDetails.find(md => md.ID == currentModuleDetail.DependentOn);

        if (currentModuleDetail != undefined)
            this.findDependentOnModuleDetail(currentModuleDetail, filterByList);

        return filterByList;
    }

    TimeStamp(value) {
        let todaysDate = new Date()
        let NotifDate = new Date(value)
        let timeStamp = todaysDate.getTime() - NotifDate.getTime()
        let todaysMonth = todaysDate.getMonth()
        let NotifMonth = NotifDate.getMonth()
        let monthDiff = Math.abs(NotifMonth - todaysMonth)
        let cd = 24 * 60 * 60 * 1000;
        let ch = 60 * 60 * 1000;
        let cm = 60 * 1000
        let d = Math.floor(timeStamp / cd);
        let h = Math.floor((timeStamp - d * cd) / ch);
        let m = Math.floor((timeStamp - d * cd - h * ch) / 60000);
        //   let pad = function(n){ return n < 10 ? '0' + n : n; };
        if (m === 60) {
            h++;
            m = 0;
        }
        if (h === 24) {
            d++;
            h = 0;
        }
        return ((m == 0) ? 'few sec ago'
            : (d == 0 && h == 0) ? m + ' min ago'
                : (d == 0 && h != 0) ? h + ' hours ago'
                    : (monthDiff == 0 && todaysDate.getFullYear() == NotifDate.getFullYear()) ? d + ' days ago'
                        : (d > 1 && todaysDate.getFullYear() == NotifDate.getFullYear()) ? monthDiff + ' months ago'
                            : value.slice(0, 10));
    }


    //SubmitTreeTable(ID: any) {
    //    this.show = true;
    //    var filter1 = localStorage.getItem('navigationExtras');
    //    let appId: any = null;
    //    if (this.CurrentApp != null || this.CurrentApp != undefined) appId = this.CurrentApp.ID;
    //    var updateData = this.files.filter(element => element.data.Updated == true)
    //    //console.log(updateData);
    //    var dataObject = JSON.stringify(updateData, this.uploadFile.replacer);
    //    let treetableModuleIndex: number;
    //    var treetableModule = this.Module[0].moduleList.find(m => m.DisplayType.toLowerCase() == "treetable");
    //    treetableModuleIndex = this.Module[0].moduleList.indexOf(treetableModule);

    //    this.mainpageservice.SaveTreetable(ID, dataObject, this.UserName, treetableModuleIndex, appId).subscribe(resp => {
    //        let toast = this.toastController.create({
    //            message: resp["Message"],
    //            duration: 8000,
    //            position: 'bottom',
    //            //closeButtonText: 'Ok',

    //        });
    //        toast.then(toast => toast.present());
    //        this.show = false;
    //        updateData.forEach((node) => {
    //            node.data.Updated = false;
    //        });
    //    });
    //}

    //SubmitTreeTable(ID: any) {
    //    debugger;
    //    this.show = true;
    //    var filter1 = localStorage.getItem('filterdata');
    //    filter1 = JSON.stringify(filter1);

    //    let appId: any = null;
    //    if (this.CurrentApp != null || this.CurrentApp != undefined) appId = this.CurrentApp.ID;
    //    this.files = this.primeNgTableArray[0]; //Added by Digvijay
    //    // console.log(this.files, 'DJ Files')
    //    //var updateData = this.files.filter(element => element.Updated == true)
    //    var updateData = this.files.filter(element => element.Updated == true || element.data.Updated == true)
    //    console.log(updateData);
    //    var dataObject = JSON.stringify(updateData, this.uploadFile.replacer);
    //    let treetableModuleIndex: number;
    //    var treetableModule = this.Module[0].moduleList.find(m => m.DisplayType.toLowerCase() == "treetable");
    //    treetableModuleIndex = this.Module[0].moduleList.indexOf(treetableModule);

    //    this.mainpageservice.SaveTreetable(ID, dataObject, this.UserName, filter1, treetableModuleIndex, appId).subscribe(resp => {
    //        let toast = this.toastController.create({
    //            message: resp["Message"],
    //            duration: 8000,
    //            position: 'bottom',

    //            //closeButtonText: 'Ok',

    //        });
    //        toast.then(toast => toast.present());
    //        this.show = false;
    //        updateData.forEach((node) => {
    //            node.data.Updated = false;

    //        });

    //        this.getPageMenuDetails();
    //    });
    //}


    async SubmitTreeTable(ID: any) {
        this.show = true;
        const filter1 = localStorage.getItem('navigationExtras');
        let appId: any = null;

        if (this.CurrentApp != null || this.CurrentApp != undefined) {
            appId = this.CurrentApp.ID;
        }

        const updateData = this.files.filter(element => element.data.Updated == true);
        const dataObject = JSON.stringify(updateData, this.uploadFile.replacer);

        const treetableModule = this.Module[0].moduleList.find(m => m.DisplayType.toLowerCase() == "treetable");
        const treetableModuleIndex = this.Module[0].moduleList.indexOf(treetableModule);

        try {
            const resp = await this.mainpageservice.SaveTreetable(ID, dataObject, this.UserName, treetableModuleIndex, appId).toPromise();

            // const toast = await this.toastController.create({
            //     message: resp["Message"],
            //     duration: 8000,
            //     position: 'bottom'
            // });
            // toast.present();

            updateData.forEach((node) => {
                node.data.Updated = false;
            });
            this.show = false;

            if (resp["Message"] == "Record saved successfully.") {
                const moduleList = this.Module[0].moduleList;

                for (let val of moduleList) {
                    if (val.DisplayType.toLowerCase() == "multichart") {
                        this.getMultiChart(val, moduleList.indexOf(val), filter1, appId);
                    }
                    if
                        (val.DisplayType.toLowerCase() == 'treetable' && (val.collectionName != "" && val.collectionName != null)) {
                        await this.saveData(val.ID, val, appId);
                    }
                }
            }

        } catch (error) {
            console.error("Error saving tree table:", error);
            this.show = false;
        }
    }
    treetable(filter, scrollableCols) {
        let treeNodes: Array<FileSystemNode> = [];
        treeNodes = filter.serializedValue;
        var filteredNodes = treeNodes.filter(x => x.parent != null)

        filteredNodes.forEach(treenode => {

            let node = new FileSystemNode(null, null, scrollableCols, treenode);

        });
    }

    /////RowGroup highlight
    updateRowGroupMetaData(data, groupByColumnName, sortColumnName) {
        //alert();
        this.rowGroupMetadata = {};
        if (data) {
            let groupIndex = 1;
            for (let i = 0; i < data.length; i++) {
                let rowData = data[i];
                let sortColumnValue = rowData[sortColumnName];
                let groupbyColumnValue = rowData[groupByColumnName];
                //this.rowGroupMetadata[sortColumnValue]={};
                if (i == 0) {
                    this.rowGroupMetadata[groupbyColumnValue] = {};
                    this.rowGroupMetadata[groupbyColumnValue][sortColumnValue] = { index: 0, size: 1, GroupIndex: groupIndex };
                }
                else {
                    let previousRowData = data[i - 1];
                    let previousRowGroup = previousRowData[groupByColumnName];
                    if (groupbyColumnValue === previousRowGroup) {
                        if (rowData[sortColumnName] == previousRowData[sortColumnName]) {
                            this.rowGroupMetadata[groupbyColumnValue][sortColumnValue].size++;
                        }
                        else {
                            groupIndex++;
                            this.rowGroupMetadata[groupbyColumnValue][sortColumnValue] = { index: i, size: 1, GroupIndex: groupIndex };
                        }
                    }
                    else {
                        if (!this.rowGroupMetadata.hasOwnProperty(groupbyColumnValue)) {
                            this.rowGroupMetadata[groupbyColumnValue] = {};
                        }
                        groupIndex++;
                        this.rowGroupMetadata[groupbyColumnValue][sortColumnValue] = { index: i, size: 1, GroupIndex: groupIndex };
                    }
                }
            }
        }
        //console.log(this.rowGroupMetadata, 'Sandeep');
    }

    updateRowGroupMetaDataSingle(data, groupByColumnName) {//table with row grouping
        this.rowGroupMetadata = {};
        //debugger;
        if (data) {
            for (let i = 0; i < data.length; i++) {
                let rowData = data[i];
                let groupByColumnName_value = rowData[groupByColumnName];
                if (i == 0) {
                    this.rowGroupMetadata[groupByColumnName_value] = { index: 0, size: 1 };
                }
                else {
                    let previousRowData = data[i - 1];
                    let previousRowGroup = previousRowData[groupByColumnName];
                    if (groupByColumnName_value === previousRowGroup)
                        this.rowGroupMetadata[groupByColumnName_value].size++;
                    else
                        this.rowGroupMetadata[groupByColumnName_value] = { index: i, size: 1 };
                }
            }
        }
        //console.log("rowGroupMetadata", this.rowGroupMetadata);
    }

    isEven(groupIndex) {
        if (groupIndex % 2 == 0)
            return { "background-color": "#F4F4F4", };
        else
            return { "background-color": "white" };
    }

    onSort(data, groupByColumnName, sortColumnName) {
        if (groupByColumnName == sortColumnName)
            this.updateRowGroupMetaDataSingle(data, groupByColumnName);
        else
            this.updateRowGroupMetaData(data, groupByColumnName, sortColumnName);
    }

    onContextMenuSelect(tableIndex) {
        this.contextMenu_tableIndex = tableIndex;
    }

    loadTableData(event: LazyLoadEvent, dtIndex, moduleIndex) {
        this.loading = true;
        var that = this;
        this.firstcount = event.first;
        this.rowscount = event.rows;
        setTimeout(() => {
            if (event.first == this.rowscount) {//to add changes made on first page
                that.visitedPagesData[dtIndex] = that.primeNgTableArray[dtIndex];
            }
            else {
                // that.visitedPagesData[dtIndex].splice(that.visitedPagesData[dtIndex].length,5, ...that.primeNgTableArray[dtIndex])
                that.visitedPagesData[dtIndex] = [that.visitedPagesData[dtIndex].slice(0, -this.rowscount), ...that.primeNgTableArray[dtIndex]];
                that.visitedPagesData[dtIndex] = [].concat(...that.visitedPagesData[dtIndex]);
            }
            if (this.Module[0].moduleList[moduleIndex].moduleData) {
                if (this.primeNgTableArray[dtIndex].length > 0 &&
                    this.primeNgTableArray[dtIndex] != undefined &&
                    this.primeNgTableArray[dtIndex] != null) {
                    this.Module[0].moduleList[moduleIndex].moduleData = this.getMergedArray(this.Module[0].moduleList[moduleIndex].moduleData, this.primeNgTableArray[dtIndex], this.Module[0].moduleList[moduleIndex].PrimaryKey)
                }
                let data: any;
                if (event.filters && Object.keys(event.filters).length > 0)//when column filters applied
                {
                    if (!event.filters.hasOwnProperty("global")) {//if filter doesn't have global filters
                        let filters = Object.keys(event.filters).map(function (fieldName) {
                            if (fieldName != "global") {//to exclude global filter from column filters
                                let filter: any = {};
                                filter = event.filters[fieldName];
                                filter.key = fieldName;
                                return filter;
                            }
                        });

                        let dataToFilter = this.Module[0].moduleList[moduleIndex].moduleData;
                        filters.forEach(filter => {
                            if (filter.length != 1) {
                                dataToFilter = this.filterService.columnFilter(dataToFilter, filter);
                            }
                            else if (filter.length == 1 && filter[0].value != null) {
                                dataToFilter = this.filterService.columnFilter(dataToFilter, filter);
                            }

                        });
                        this.totalRecords[dtIndex] = dataToFilter.length;
                        data = dataToFilter.slice(event.first, (event.first + event.rows));
                    }
                    else if (event.filters.hasOwnProperty("global")) {//for global filter
                        let dataToFilter = this.Module[0].moduleList[moduleIndex].moduleData;
                        dataToFilter = this.filterService.globalFilter(this.filterColsArray[dtIndex], dataToFilter, event.filters['global'].value)
                        this.totalRecords[dtIndex] = dataToFilter.length;
                        data = dataToFilter.slice(event.first, (event.first + event.rows));
                    }
                }

                else {//without column filters or global filter
                    if ((this.Module[0].moduleList[moduleIndex].ErrorCount != null || this.Module[0].moduleList[moduleIndex].ErrorCount != 0) && this.ruleEngine.filterRuleIndex == moduleIndex && this.ModulesRuleData != undefined) {
                        // data=this.ruleErrorData[moduleIndex].slice(event.first,(event.first + event.rows));
                        // this.customSort(data, event.sortField, event.sortOrder)
                        data = this.ruleEngine.ModulesRuleData.slice(event.first, (event.first + event.rows));
                        this.customSort(data, event.sortField, event.sortOrder);
                    }
                    else {
                        data = that.Module[0].moduleList[moduleIndex].moduleData.slice(event.first, (event.first + event.rows));
                        that.totalRecords[dtIndex] = that.Module[0].moduleList[moduleIndex].moduleData.length;
                        this.customSort(data, event.sortField, event.sortOrder)
                    }
                }
                that.primeNgTableArray[dtIndex] = data;
                let dataArray = Object.keys(data).map(function (index) {//convert Object to array
                    let row = data[index];
                    return row;
                });

                let arr1 = that.visitedPagesData[dtIndex];
                that.visitedPagesData[dtIndex] = this.getMergedArray(arr1, dataArray, this.Module[0].moduleList[moduleIndex].PrimaryKey);
                if (event.sortField === event.sortOrder.toString())
                    this.updateRowGroupMetaDataSingle(data, event.sortField);
                else
                    this.updateRowGroupMetaData(data, event.sortField, event.sortOrder.toString());
                this.loading = false;
            }
        }, 100);
    }

    isDisplayColumn(colName, moduleIndex) {
        let groupColumns = this.Module[0].moduleList[moduleIndex].PrimaryKey.split(',');
        return groupColumns.includes(colName);
    }

    getMergedArray(arr1, arr2, PrimaryKey) {

        //     const map = new Map();
        //     console.log(arr1, arr2, "Array");
        //     if (arr1 != undefined && arr2 != undefined) {
        //         if (PrimaryKey != "" && PrimaryKey != null) {
        //             if (arr1 != 0) {
        //                 arr1.forEach(item => map.set(item[PrimaryKey], item));
        //             }
        //             if (arr2 != null) {
        //                 arr2.forEach(item => map.set(item[PrimaryKey], { ...map.get(item[PrimaryKey]), ...item }));
        //             }
        //         }
        //         else {
        //             arr1.forEach(item => map.set(item.ID, item));
        //             arr2.forEach(item => map.set(item.ID, { ...map.get(item.ID), ...item }));
        //         }

        //         const mergedArr = Array.from(map.values());
        //         console.log(mergedArr);
        //         return mergedArr;
        //     }
        //     else
        //         return 0;
        const map = new Map();
        if (arr1 !== undefined && arr2 !== undefined) {
            if (PrimaryKey && PrimaryKey !== "") {
                // Process arr1
                arr1.forEach(item => {
                    if (item[PrimaryKey] !== undefined) {
                        map.set(item[PrimaryKey], item); // Use PrimaryKey for unique identification
                    }
                });

                // Process arr2
                arr2.forEach(item => {
                    if (item[PrimaryKey] !== undefined) {
                        const existingItem = map.get(item[PrimaryKey]);
                        map.set(item[PrimaryKey], { ...existingItem, ...item }); // Merge with existing data
                    }
                });
            } else {
                // Default to "ID" if no PrimaryKey is provided
                arr1.forEach(item => {
                    if (item.ID !== undefined) {
                        map.set(item.ID, item);
                    }
                });

                arr2.forEach(item => {
                    if (item.ID !== undefined) {
                        const existingItem = map.get(item.ID);
                        map.set(item.ID, { ...existingItem, ...item });
                    }
                });
            }

            // Handle objects with undefined PrimaryKey or ID
            const undefinedKeysSet = new Set(); // Track unique objects with undefined keys
            const addUniqueUndefinedKey = (item) => {
                const itemString = JSON.stringify(item);
                if (!undefinedKeysSet.has(itemString)) {
                    undefinedKeysSet.add(itemString);
                    map.set(Symbol(), item); // Add uniquely using Symbol
                }
            };

            arr1.forEach(item => {
                if (PrimaryKey && item[PrimaryKey] === undefined) {
                    addUniqueUndefinedKey(item);
                } else if (!PrimaryKey && item.ID === undefined) {
                    addUniqueUndefinedKey(item);
                }
            });

            arr2.forEach(item => {
                if (PrimaryKey && item[PrimaryKey] === undefined) {
                    addUniqueUndefinedKey(item);
                } else if (!PrimaryKey && item.ID === undefined) {
                    addUniqueUndefinedKey(item);
                }
            });

            // Convert map values to array
            const mergedArr = Array.from(map.values());
            return mergedArr;
        } else {
            return 0;
        }
    }

    columnFilter(data, filterObject)//column filter for lazy loading
    {
        //debugger;
        if (filterObject.length != 1) {
            return data.filter(filterColumnwiseData);
        }
        else if (filterObject[0].matchMode == 'notEquals') {
            return data.filter(filternotEqualsColumnwiseData)
        }
        else if (filterObject[0].matchMode == 'notContains') {
            return data.filter(filternotContainsColumnwiseData)
        }
        else if (filterObject[0].matchMode == 'equals' && filterObject[0].operator == 'and') {
            return data.filter(filterEqualsColumnWiseData)
        }
        else if (filterObject[0].matchMode == 'startsWith') {
            return data.filter(filterStartWithColumnwiseData)
        }
        else if (filterObject[0].matchMode == 'endsWith') {
            return data.filter(filterEndsWithColumnwiseData)
        }
        else if (filterObject[0].matchMode == 'lt' || filterObject[0].matchMode == 'lte') {
            return data.filter(filterLessThanColumWiseData)
        }
        else if (filterObject[0].matchMode == 'gt' || filterObject[0].matchMode == 'gte') {
            return data.filter(filterGreaterThanColumWiseData)
        }
        else if (filterObject[0].matchMode == 'dateIs' || filterObject[0].matchMode == 'dateIsNot' || filterObject[0].matchMode == 'dateBefore' || filterObject[0].matchMode == 'dateAfter') {
            return data.filter(filterDateisColumWiseData)
        }
        else {
            return data.filter(filterColumnwiseData);
        }
        function filternotContainsColumnwiseData(data) { //callback function
            if (typeof data[filterObject.key] == 'string') {
                if (filterObject.length == 1) {
                    return !data[filterObject.key].toLowerCase().includes(filterObject[0].value.toLowerCase());
                }
                else if (filterObject[1].matchMode == 'contains') {
                    return !data[filterObject.key].toLowerCase().includes(filterObject[0].value.toLowerCase()) &&
                        data[filterObject.key].toLowerCase().includes(filterObject[1].value.toLowerCase())
                }
                else if (filterObject[1].matchMode == 'startsWith') {
                    return !data[filterObject.key].toLowerCase().includes(filterObject[0].value.toLowerCase()) &&
                        new RegExp("^" + filterObject[1].value.toLowerCase()).test(data[filterObject.key].toLowerCase())
                }
                else if (filterObject[1].matchMode == 'endsWith') {
                    return !data[filterObject.key].toLowerCase().includes(filterObject[0].value.toLowerCase()) &&
                        new RegExp(filterObject[1].value.toLowerCase() + "$").test(data[filterObject.key].toLowerCase())
                }
                else if (filterObject[1].matchMode == 'equals') {
                    return !data[filterObject.key].toLowerCase().includes(filterObject[0].value.toLowerCase()) &&
                        data[filterObject.key].toLowerCase() === (filterObject[1].value.toLowerCase());
                }
                else if (filterObject[1].matchMode == 'notEquals') {
                    return !data[filterObject.key].toLowerCase().includes(filterObject[0].value.toLowerCase()) &&
                        !data[filterObject.key].toLowerCase().includes(filterObject[0].value.toLowerCase())
                }
            }
            else if (data[filterObject.key] != null)
                return !data[filterObject.key].toString().includes(filterObject[0].value.toString());
        }
        function filterEqualsColumnWiseData(data) {
            if (typeof filterObject[0].value == 'string') {
                if (filterObject.length == 1) {
                    return data[filterObject.key].toLowerCase() === (filterObject[0].value.toLowerCase());
                }
                else if (filterObject[1].matchMode == 'contains') {
                    return data[filterObject.key].toLowerCase() === (filterObject[0].value.toLowerCase()) &&
                        data[filterObject.key].toLowerCase().includes(filterObject[1].value.toLowerCase())
                }
                else if (filterObject[1].matchMode == 'startsWith') {
                    return data[filterObject.key].toLowerCase() === (filterObject[0].value.toLowerCase()) &&
                        new RegExp("^" + filterObject[1].value.toLowerCase()).test(data[filterObject.key].toLowerCase())
                }
                else if (filterObject[1].matchMode == 'endsWith') {
                    return data[filterObject.key].toLowerCase() === (filterObject[0].value.toLowerCase()) &&
                        new RegExp(filterObject[1].value.toLowerCase() + "$").test(data[filterObject.key].toLowerCase())
                }
                else if (filterObject[1].matchMode == 'notContains' || filterObject[1].matchMode == 'notEquals') {
                    return data[filterObject.key].toLowerCase() === (filterObject[0].value.toLowerCase()) &&
                        !data[filterObject.key].toLowerCase().includes(filterObject[1].value.toLowerCase())
                }
            }
            // return filterObject[0].value.toLowerCase().includes(data[filterObject.key].toLowerCase());
            else if (typeof filterObject[0].value == 'number') {
                if (filterObject.length == 1) {
                    return data[filterObject.key] === filterObject[0].value;
                }
                else if (filterObject[1].matchMode == 'notEquals') {
                    return data[filterObject.key] === filterObject[0].value &&
                        data[filterObject.key] != filterObject[1].value;
                }
                else if (filterObject[1].matchMode == 'lt') {
                    return data[filterObject.key] === filterObject[0].value &&
                        data[filterObject.key] < filterObject[1].value;
                }
                else if (filterObject[1].matchMode == 'gt') {
                    return data[filterObject.key] === filterObject[0].value &&
                        data[filterObject.key] > filterObject[1].value
                }
                else if (filterObject[1].matchMode == 'lte') {
                    return data[filterObject.key] === filterObject[0].value &&
                        data[filterObject.key] <= filterObject[1].value;
                }
                else if (filterObject[1].matchMode == 'gte') {
                    return data[filterObject.key] === filterObject[0].value &&
                        data[filterObject.key] >= filterObject[1].value;
                }
            }
            else if (data[filterObject.key] != null)
                return !data[filterObject.key].toString().includes(filterObject[0].value.toString());
        }
        function filternotEqualsColumnwiseData(data) { //callback function
            if (typeof data[filterObject.key] == 'string') {
                if (filterObject.length == 1) {
                    return !data[filterObject.key].toLowerCase().includes(filterObject[0].value.toLowerCase());
                }
                else if (filterObject[1].matchMode == 'startsWith') {
                    return !data[filterObject.key].toLowerCase().includes(filterObject[0].value.toLowerCase()) &&
                        new RegExp("^" + filterObject[1].value.toLowerCase()).test(data[filterObject.key].toLowerCase())
                }
                else if (filterObject[1].matchMode == 'endsWith') {
                    return !data[filterObject.key].toLowerCase().includes(filterObject[0].value.toLowerCase()) &&
                        new RegExp(filterObject[1].value.toLowerCase() + "$").test(data[filterObject.key].toLowerCase())
                }
                else if (filterObject[1].matchMode == 'contains') {
                    return !data[filterObject.key].toLowerCase().includes(filterObject[0].value.toLowerCase()) &&
                        data[filterObject.key].toLowerCase().includes(filterObject[1].value.toLowerCase());
                }
                else if (filterObject[1].matchMode == 'equals') {
                    return !data[filterObject.key].toLowerCase().includes(filterObject[0].value.toLowerCase()) &&
                        data[filterObject.key].toLowerCase() === (filterObject[1].value.toLowerCase())
                }
                else if (filterObject[1].matchMode == 'notContains') {
                    return !data[filterObject.key].toLowerCase().includes(filterObject[0].value.toLowerCase()) &&
                        !data[filterObject.key].toLowerCase().includes(filterObject[1].value.toLowerCase())

                }
            }
            else if (typeof filterObject[0].value == 'number') {
                if (filterObject.length == 1) {
                    return data[filterObject.key] != filterObject[0].value
                }
                else if (filterObject[1].matchMode == 'equals') {
                    return data[filterObject.key] != filterObject[0].value &&
                        data[filterObject.key] === filterObject[1].value
                }
                else if (filterObject[1].matchMode == 'lt') {
                    return data[filterObject.key] != filterObject[0].value &&
                        data[filterObject.key] < filterObject[1].value;
                }
                else if (filterObject[1].matchMode == 'gt') {
                    return data[filterObject.key] != filterObject[0].value &&
                        data[filterObject.key] > filterObject[1].value;
                }
                else if (filterObject[1].matchMode == 'lte') {
                    return data[filterObject.key] != filterObject[0].value &&
                        data[filterObject.key] <= filterObject[1].value;
                }
                else if (filterObject[1].matchMode == 'gte') {
                    return data[filterObject.key] != filterObject[0].value &&
                        data[filterObject.key] >= filterObject[1].value;
                }
            }
            else if (data[filterObject.key] != null) {
                return !data[filterObject.key].toString().includes(filterObject[0].value.toString());
            }
        }
        function filterStartWithColumnwiseData(data) { //callback function
            if (typeof data[filterObject.key] == 'string') {


                if (filterObject.length == 1) {
                    return new RegExp("^" + filterObject[0].value.toLowerCase()).test(data[filterObject.key].toLowerCase())
                }
                else if (filterObject[1].matchMode == 'contains') {
                    return new RegExp("^" + filterObject[0].value.toLowerCase()).test(data[filterObject.key].toLowerCase()) &&
                        data[filterObject.key].toLowerCase().includes(filterObject[1].value.toLowerCase())
                }
                else if (filterObject[1].matchMode == 'endsWith') {
                    return new RegExp("^" + filterObject[0].value.toLowerCase()).test(data[filterObject.key].toLowerCase()) &&
                        new RegExp(filterObject[1].value.toLowerCase() + "$").test(data[filterObject.key].toLowerCase())
                }
                else if (filterObject[1].matchMode == 'equals') {
                    return new RegExp("^" + filterObject[0].value.toLowerCase()).test(data[filterObject.key].toLowerCase()) &&
                        data[filterObject.key].toLowerCase() === (filterObject[1].value.toLowerCase());
                }
                else if (filterObject[1].matchMode == 'notContains' || filterObject[1].matchMode == 'notEquals') {
                    return new RegExp("^" + filterObject[0].value.toLowerCase()).test(data[filterObject.key].toLowerCase()) &&
                        !data[filterObject.key].toLowerCase().includes(filterObject[1].value.toLowerCase())
                }
                //return data[filterObject.key].toLowerCase().includes(filterObject[0].value.toLowerCase());
                //  return filterObject[0].value.toLowerCase().includes(data[filterObject.key].toLowerCase())
            }
            else if (data[filterObject.key] != null)
                // return data[filterObject.key].toString().includes(filterObject[0].value.toString());
                return new RegExp("^" + filterObject[0].value.toLowerCase()).test(data[filterObject.key].toLowerCase())

        }
        function filterEndsWithColumnwiseData(data) {
            if (typeof data[filterObject.key] == 'string') {
                if (filterObject.length == 1) {
                    return new RegExp(filterObject[0].value.toLowerCase() + "$").test(data[filterObject.key].toLowerCase())
                }
                else if (filterObject[1].matchMode == 'contains') {
                    return new RegExp(filterObject[0].value.toLowerCase() + "$").test(data[filterObject.key].toLowerCase()) &&
                        data[filterObject.key].toLowerCase().includes(filterObject[1].value.toLowerCase())
                }
                else if (filterObject[1].matchMode == 'startsWith') {
                    return new RegExp(filterObject[0].value.toLowerCase() + "$").test(data[filterObject.key].toLowerCase()) &&
                        new RegExp("^" + filterObject[1].value.toLowerCase()).test(data[filterObject.key].toLowerCase())
                }
                else if (filterObject[1].matchMode == 'equals') {
                    return new RegExp(filterObject[0].value.toLowerCase() + "$").test(data[filterObject.key].toLowerCase()) &&
                        data[filterObject.key].toLowerCase() === (filterObject[1].value.toLowerCase());
                }
                else if (filterObject[1].matchMode == 'notContains' || filterObject[1].matchMode == 'notEquals') {
                    return new RegExp(filterObject[0].value.toLowerCase() + "$").test(data[filterObject.key].toLowerCase()) &&
                        !data[filterObject.key].toLowerCase().includes(filterObject[1].value.toLowerCase())
                }
            }
            else if (data[filterObject.key] != null) {
                return new RegExp(filterObject[0].value.toLowerCase() + "$").test(data[filterObject.key].toLowerCase())
                // return data[filterObject.key].toString().includes(filterObject[0].value.toString());
            }
        }
        function filterLessThanColumWiseData(data) {
            if (typeof data[filterObject.key] == 'number' && filterObject[0].matchMode == 'lt') {
                if (filterObject.length == 1) {
                    return data[filterObject.key] < filterObject[0].value
                }
                else if (filterObject[1].matchMode == 'equals') {
                    return data[filterObject.key] < filterObject[0].value &&
                        data[filterObject.key] === filterObject[1].value
                }
                else if (filterObject[1].matchMode == 'notEquals') {
                    return data[filterObject.key] < filterObject[0].value &&
                        data[filterObject.key] != filterObject[1].value
                }
                else if (filterObject[1].matchMode == 'lte') {
                    return data[filterObject.key] < filterObject[0].value &&
                        data[filterObject.key] <= filterObject[1].value
                }
                else if (filterObject[1].matchMode == 'gt') {
                    return data[filterObject.key] < filterObject[0].value &&
                        data[filterObject.key] > filterObject[1].value
                }
                else if (filterObject[1].matchMode == 'gte') {
                    return data[filterObject.key] < filterObject[0].value &&
                        data[filterObject.key] >= filterObject[1].value
                }
            }
            else if (typeof data[filterObject.key] == 'number' && filterObject[0].matchMode == 'lte') {
                if (filterObject.length == 1) {
                    return data[filterObject.key] <= filterObject[0].value
                }
                else if (filterObject[1].matchMode == 'equals') {
                    return data[filterObject.key] <= filterObject[0].value &&
                        data[filterObject.key] === filterObject[1].value
                }
                else if (filterObject[1].matchMode == 'notEquals') {
                    return data[filterObject.key] <= filterObject[0].value &&
                        data[filterObject.key] != filterObject[1].value;
                }
                else if (filterObject[1].matchMode == 'lt') {
                    return data[filterObject.key] <= filterObject[0].value &&
                        data[filterObject.key] < filterObject[1].value
                }
                else if (filterObject[1].matchMode == 'gt') {
                    return data[filterObject.key] <= filterObject[0].value &&
                        data[filterObject.key] > filterObject[1].value
                }
                else if (filterObject[1].matchMode == 'gte') {
                    return data[filterObject.key] <= filterObject[0].value &&
                        data[filterObject.key] >= filterObject[1].value
                }
            }

            return '';
        }
        function filterGreaterThanColumWiseData(data) {
            if (typeof data[filterObject.key] == 'number' && filterObject[0].matchMode == 'gt') {
                if (filterObject.length == 1) {
                    return data[filterObject.key] > filterObject[0].value;
                }
                else if (filterObject[1].matchMode == 'equals') {
                    return data[filterObject.key] > filterObject[0].value &&
                        data[filterObject.key] === filterObject[1].value;
                }
                else if (filterObject[1].matchMode == 'notEquals') {
                    return data[filterObject.key] > filterObject[0].value &&
                        data[filterObject.key] != filterObject[1].value;
                }
                else if (filterObject[1].matchMode == 'lt') {
                    return data[filterObject.key] > filterObject[0].value &&
                        data[filterObject.key] < filterObject[1].value;
                }
                else if (filterObject[1].matchMode == 'lte') {
                    return data[filterObject.key] > filterObject[0].value &&
                        data[filterObject.key] <= filterObject[1].value;
                }
                else if (filterObject[1].matchMode == 'gte') {
                    return data[filterObject.key] > filterObject[0].value &&
                        data[filterObject.key] >= filterObject[1].value;
                }
            }
            else if (typeof data[filterObject.key] == 'number' && filterObject[0].matchMode == 'gte') {
                if (filterObject.length == 1) {
                    return data[filterObject.key] >= filterObject[0].value
                }
                else if (filterObject[1].matchMode == 'equals') {
                    return data[filterObject.key] >= filterObject[0].value &&
                        data[filterObject.key] === filterObject[1].value;
                }
                else if (filterObject[1].matchMode == 'notEquals') {
                    return data[filterObject.key] >= filterObject[0].value &&
                        data[filterObject.key] != filterObject[1].value;
                }
                else if (filterObject[1].matchMode == 'lt') {
                    return data[filterObject.key] >= filterObject[0].value &&
                        data[filterObject.key] < filterObject[1].value;
                }
                else if (filterObject[1].matchMode == 'lte') {
                    return data[filterObject.key] >= filterObject[0].value &&
                        data[filterObject.key] <= filterObject[1].value;
                }
                else if (filterObject[1].matchMode == 'gt') {
                    return data[filterObject.key] >= filterObject[0].value &&
                        data[filterObject.key] > filterObject[1].value;
                }
            }

            return '';
        }
        function filterDateisColumWiseData(data) {
            var filterDate = filterObject[0].value;
            //console.log(filterDate)
            var month = filterDate.getMonth();
            month++;
            if (month < 10) month = "0" + month;
            //console.log(month);
            var dateOfMonth = filterDate.getDate();
            if (dateOfMonth < 10) dateOfMonth = "0" + dateOfMonth;
            var getFullYear = filterDate.getFullYear();
            var format = dateOfMonth + "/" + month + "/" + getFullYear;
            //console.log("filterdate " + format);

            var tableDate = data[filterObject.key];
            //console.log(tableDate);
            var tableMonth = tableDate.getMonth();
            tableMonth++;
            if (tableMonth < 10) tableMonth = "0" + tableMonth;
            var tableMonthDate = tableDate.getDate();
            if (tableMonthDate < 10) tableMonthDate = "0" + tableMonthDate;
            var tableYear = tableDate.getFullYear();
            var dateFormat = tableMonthDate + "/" + tableMonth + "/" + tableYear;
            //console.log("tabledate " + dateFormat);

            if (filterObject.length > 1) {
                var filterDate1 = filterObject[1].value;
                //console.log(filterDate1);
                var month1 = filterDate1.getMonth();
                month1++;
                if (month1 < 10) month1 = "0" + month1;
                //console.log(month1);
                var dateOfMonth1 = filterDate1.getDate();
                if (dateOfMonth1 < 10) dateOfMonth1 = "0" + dateOfMonth1;
                var getFullYear1 = filterDate1.getFullYear();
                var format1 = dateOfMonth1 + "/" + month1 + "/" + getFullYear1;
                //console.log("filterdate1 " + format1)
            }

            if (filterObject[0].matchMode == 'dateIs') {

                if (filterObject.length == 1) {
                    return dateFormat === format;
                }
                else if (filterObject[1].matchMode == 'dateIsNot') {

                    return dateFormat === format && dateFormat != format1
                }
                else if (filterObject[1].matchMode == 'dateBefore') {
                    return dateFormat === format || data[filterObject.key].getTime() < filterObject[0].value.getTime();
                }
                else if (filterObject[1].matchMode == 'dateAfter') {
                    return dateFormat === format || data[filterObject.key].getTime() > filterObject[0].value.getTime();
                }
            }
            else if (filterObject[0].matchMode == 'dateIsNot') {
                if (filterObject.length == 1) {
                    // return data[filterObject.key].getDate() != filterObject[0].value.getDate();
                    return dateFormat != format
                }
                else if (filterObject[1].matchMode == 'dateIs') {
                    return dateFormat != format && dateFormat === format1
                }
                else if (filterObject[1].matchMode == 'dateBefore') {
                    return dateFormat != format && data[filterObject.key].getTime() < filterObject[0].value.getTime();
                }
                else if (filterObject[1].matchMode == 'dateAfter') {
                    return dateFormat != format && data[filterObject.key].getTime() > filterObject[0].value.getTime();
                }
            }
            else if (filterObject[0].matchMode == 'dateBefore') {
                if (filterObject.length == 1) {
                    return data[filterObject.key].getTime() < filterObject[0].value.getTime();
                }
                else if (filterObject[1].matchMode == 'dateIs') {
                    return data[filterObject.key].getTime() < filterObject[0].value.getTime() && dateFormat === format1
                }
                else if (filterObject[1].matchMode == 'dateIsNot') {
                    return data[filterObject.key].getTime() < filterObject[0].value.getTime() && dateFormat != format1
                }
                else if (filterObject[1].matchMode == 'dateAfter') {
                    return data[filterObject.key].getTime() < filterObject[0].value.getTime() &&
                        data[filterObject.key].getTime() > filterObject[1].value.getTime();
                }
            }
            else if (filterObject[0].matchMode == 'dateAfter') {
                if (filterObject.length == 1) {
                    return data[filterObject.key].getTime() > filterObject[0].value.getTime();
                }
                else if (filterObject[1].matchMode == 'dateIs') {
                    return data[filterObject.key].getTime() > filterObject[0].value.getTime() && dateFormat === format1
                }
                else if (filterObject[1].matchMode == 'dateIsNot') {
                    return data[filterObject.key].getTime() > filterObject[0].value.getTime() && dateFormat != format1
                }
                else if (filterObject[1].matchMode == 'dateBefore') {
                    return data[filterObject.key].getTime() > filterObject[0].value.getTime() &&
                        data[filterObject.key].getTime() < filterObject[1].value.getTime();
                }
            }

            return '';
        }
        function filterColumnwiseData(data) { //callback function
            if (typeof data[filterObject.key] == 'number') {
                return data[filterObject.key].toString().includes(filterObject.value.toString())
            }
            if (typeof data[filterObject.key] == 'string') {
                if (filterObject.length != 1 && filterObject.matchMode == 'contains') {
                    return data[filterObject.key].toLowerCase().includes(filterObject.value.toLowerCase());
                }
                else if (filterObject.length == 1 && filterObject[0].matchMode == 'contains') {
                    return data[filterObject.key].toLowerCase().includes(filterObject[0].value.toLowerCase());
                }
                else if (filterObject[1].matchMode == 'startsWith') {
                    return data[filterObject.key].toLowerCase().includes(filterObject[0].value.toLowerCase()) &&
                        new RegExp("^" + filterObject[1].value.toLowerCase()).test(data[filterObject.key].toLowerCase())
                }
                else if (filterObject[1].matchMode == 'endsWith') {
                    return data[filterObject.key].toLowerCase().includes(filterObject[0].value.toLowerCase()) &&
                        new RegExp(filterObject[1].value.toLowerCase() + "$").test(data[filterObject.key].toLowerCase())
                }
                else if (filterObject[1].matchMode == 'equals') {
                    return data[filterObject.key].toLowerCase().includes(filterObject[0].value.toLowerCase()) &&
                        data[filterObject.key].toLowerCase() === (filterObject[1].value.toLowerCase());
                }
                else if (filterObject[1].matchMode == 'notContains' || filterObject[1].matchMode == 'notEquals') {
                    return data[filterObject.key].toLowerCase().includes(filterObject[0].value.toLowerCase()) &&
                        !data[filterObject.key].toLowerCase().includes(filterObject[1].value.toLowerCase())
                }
                //  return filterObject[0].value.toLowerCase().includes(data[filterObject.key].toLowerCase())
            }
            else if (data[filterObject.key] != null) {
                let dateformat = new Date(data[filterObject.key])
                let date = dateformat.getDate();
                return date.toString().includes(filterObject.value.toString());
            }
        }
    }

    //clear(table: Table) {
    //    table.clear();
    //    this.inputfield.nativeElement.value = '';
    //}
    //updated by vikrant
    clear(table: Table, inputField: HTMLInputElement): void {
        // Clear the data table filter
        // table.filterGlobal('', 'contains'); 
        table.clear();

        // Reset the specific input field
        inputField.value = '';
    }


    globalFilter(columns, data, value)//global filter for lazy loading
    {
        return data.filter(globalFilterData);

        function globalFilterData(data) {//callback function
            let matched: boolean = false;//flag to check if value exist in the row
            columns.forEach(column => {
                if (typeof data[column] == 'string') {//if column datatype is string
                    if (data[column].toLowerCase().includes(value.toLowerCase())) matched = true;//sets flag to true if value matched
                }
                else {//if column datatype is not string(integers,date etc.)
                    if (data[column].toString().includes(value.toString())) matched = true;//sets flag to true if value matched
                }
            });
            return matched;
        }

    }

    disableMultiSelection(formObject, checkboxName)//disable multi selection of checkbox in card view display type
    {
        let array = formObject.value[checkboxName];
        let latestItem = array[array.length - 1];
        array.length = 0;
        array.push(latestItem);
    }

    async createACSUserId(username) {
        var connectionString = "endpoint=https://chatapptest.communication.azure.com/;accesskey=05tg2gMhjPpht5w+x9KftqZpLiRCFiiyrJUdTvOdWlzLZs23B9OHHafoqzEPQrfxqKVUa+4TJ4MV+AcB24pfRA==";
        var userId = await this.ACSUser.createUser(connectionString);
        this.ACS.assignACSUserID(username, userId).subscribe(resp => {
            //console.log("assignACSUserID", resp);
            // let toast = this.toastController.create({
            //     message: resp.toString(),
            //     duration: 8000,
            //     position: 'bottom',
            //     //closeButtonText: 'Ok',

            // });
            // toast.then(toast => toast.present());
        })
    }

    downloadpdf(filename) {
        //debugger;
        this.show = true;
        var file = filename.substr(filename.lastIndexOf('\\') + 1);
        file = file.substr(0, file.lastIndexOf('.'));
        this.UserName = localStorage.getItem('username');
        this.mainpageservice.downloadpdf(this.UserName, filename).subscribe((resp) => {

            //console.log(resp);
            //console.log(filename);
            //console.log(file);
            saveAs(resp, file);

        });
        this.show = false;
    }

    onEdit() {
        this.isEditButtonClicked = false;
        this.editorDisabled = false;
    }

    calculateExcelChanges(data: any, MenuID: string, ModuleID: string, ModuleName: any) {
        //debugger;
        this.show = true;
        this.mainpageservice.CalculateExcelChanges(MenuID, ModuleID, data, localStorage.getItem('username'), ModuleName).subscribe(data => {
            let filter1 = localStorage.getItem('navigationExtras');
            this.show = true;
            //debugger;
            for (let key of Object.keys(data)) {
                if (+key == 0) {
                    this.Module[0].moduleList[0].multichartdata = data[key];
                }
                else {
                    this.primeNgTableArray[parseInt(key)] = data[parseInt(key)];
                }
            }
            //this.primeNgTableArray[2]=data;
            // this.GetModulewithFilter(filter1);
            this.show = false;
        });
    }

    //    downloadExcel(filename) {

    //        //debugger;

    //        this.show = true;

    //        //console.log(filename);

    //        var file = filename.substr(filename.lastIndexOf('\\') + 1);

    //        //console.log(file);

    //        //  file = file.substr(0, file.lastIndexOf('.'));

    //        this.UserName = localStorage.getItem('username');

    //        this.mainpageservice.downloadExcel(this.UserName, filename).subscribe((resp) => {

    //            saveAs(resp, file);

    //        });

    //        this.show = false;

    //    }

    AutocompleteFilter(event, dropdownvalue) {
        //console.log(event, dropdownvalue)
        let filtered: any = [];
        let query = event.query;
        for (let i = 0; i < dropdownvalue.length; i++) {
            let value = dropdownvalue[i]
            if (value.Text.toLowerCase().indexOf(query.toLowerCase() == 0)) {
                filtered.push(value)
            }
        }
        this.Module[0].moduleList[0].moduleDetails[1].DropDownValues = filtered;
        //console.log(filtered)
    }

    customSort(data, field, order) {
        //debugger;
        let sortOrder = order === 1 ? 1 : -1;
        data.sort((data1, data2) => {
            let value1 = data1[field];
            let value2 = data2[field];
            let result = null;

            if (value1 == null && value2 != null)
                result = -1;
            else if (value1 != null && value2 == null)
                result = 1;
            else if (value1 == null && value2 == null)
                result = 0;
            else if (typeof value1 === 'string' && typeof value2 === 'string')
                result = value1.localeCompare(value2);
            else
                result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

            //console.log(sortOrder * result);
            return (sortOrder * result);
        });
    }

    onCopy(data) {
        //console.log(data);
        let a = Object.values(data);
        //console.log(a);
        let finalData = a.join(', ');
        //console.log(finalData)
        this.clipboard.copy(finalData)

    }

    paginate(event) {
        //debugger;
        this.first = event.first;
        //console.log(event);
        this.paginateData = [];
        this.paginateData = <any[]>this.cardViewData.slice(event.first, (event.first + event.rows));
        //console.log(this.paginateData);

    }
    navigate_links(i, moduleindex) {
        let dependentModuleData = this.Module[0].moduleList[moduleindex].RelatedModules[i];
        this.router.navigate(['/menu/first/tabs/' + dependentModuleData.MenuId], {
            queryParams: {
                moduleName: dependentModuleData.DependentModuleName
            }
        });
    }

    getTileGroupName(primaryKey, tileId, moduledata) {
        return moduledata.find(d => d[primaryKey] == tileId)["Group"];
    }

    Validation: boolean = false;
    ValidModuleId;
    ValidModuleName;
    async openTable(ModuleId, product) {
        console.log(product);
        //opens dialog to validate table module
        let module = this.Module[0].moduleList.find(m => m.ID == ModuleId);
        if (!Array.isArray(product.RowError) && product.RowError && product.RowError !== "undefined") {
            this.RowErrors = JSON.parse(product.RowError);
        }

        // let moduleIndex = this.Module[0].moduleList.indexOf(module);
        // let tableModuleList = this.Module[0].moduleList.filter(m => m.DisplayType == '' || m.DisplayType.toLowerCase() == "primeunfrozentable" || m.DisplayType.toLowerCase() == "crudtable"
        //     || m.DisplayType.toLowerCase() == 'primengpivottable' || m.DisplayType.toLowerCase() == 'dataview' || m.DisplayType.toLowerCase() == "formtablesubmodule");


        let appId: any = null;
        this.CurrentApp = JSON.parse(localStorage.getItem("CurrentApp"));
        if (this.CurrentApp != null || this.CurrentApp != undefined) appId = this.CurrentApp.ID;

        this.ruleEngine.ModuleId = ModuleId;
        //this.getTableModule(module, moduleIndex, tableModuleList, null, appId);
        await this.ruleEngine.getInvalidData(ModuleId, this.UserName);

        this.ruleEngine.Validation = true;
        // this.ValidModuleName = ModuleName;
    }

    //////////////////////////////////Module component code////////////////////////////////
    getTableModule(val, moduleIndex, tableModuleList, filterData, appId) {
        //start loading 
        this.loading = true;

        let frozenCols = [];
        let scrollableCols = [];
        let childColumns = [];
        let displayedColumns = [];
        let filterCols = [];
        let headerLevelOne = [];

        let dtIndex = tableModuleList.indexOf(val);

        this.frozenColsArray[dtIndex] = [];
        this.scrollableColsArray[dtIndex] = [];
        this.selectedColumnsArray[dtIndex] = [];
        this.filterColsArray[dtIndex] = [];
        this.primeNgTableArray[dtIndex] = [];
        this.visitedPagesData[dtIndex] = [];
        this.ModuleDataWithRuleArray[dtIndex] = [];
        this.displayDialogModule[dtIndex] = [];

        if (val.moduleDetails != null && typeof (val.moduleDetails) != undefined) {
            val.moduleDetails.forEach((column) => {
                ///frozen and scrollable columns primeng
                if (column.HeaderLevel != 1 && column.InputControls != 'HiddenField') {
                    if (column.FrozenCols == true) {
                        frozenCols.push(column);
                    }
                    else {
                        scrollableCols.push(column);
                    }
                }
                else if (column.HeaderLevel == 1 && column.InputControls != 'HiddenField') {
                    headerLevelOne.push(column);
                }
                filterCols.push(column.ColumnName);
                if (column.ShowCellContextMenu) this.mapContextMenuCommand(column.ContextMenus, column.ColumnName);//cell wise context menu
            });

            this.frozenColsArray[dtIndex] = frozenCols;
            this.scrollableColsArray[dtIndex] = scrollableCols;
            this.selectedColumnsArray[dtIndex] = scrollableCols;
            this.filterColsArray[dtIndex] = filterCols;
            this.displayDialogModule[dtIndex] = false;

            console.log("frozenColsArray : ", this.frozenColsArray[dtIndex]);
            console.log("scrollableColsArray : ", this.scrollableColsArray[dtIndex]);

            if (val.ShowRowContextMenu) this.mapContextMenuCommand(val.RowContextMenus, val.PrimaryKey);

            // if (val.GroupBy != "")//row highlight group by in pivot table
            //     this.updateRowGroupMetaData(val.moduleData, val.GroupBy, val.DefaultSortByColumn);


            let frozenWidth = frozenCols.length * 150 + 50 + "px";
            this.frozenWidthArray.push(frozenWidth);
            this.populateModuleData(val, dtIndex, moduleIndex, filterData, appId);

            //end loading
            this.loading = false;
        }
    }

    getPivotTableModule(val, moduleIndex, tableModuleList, filterData, appId) {
        this.mainpageservice.GetPivotedData(val.ID, this.Sys_Menu_ID, this.UserName, filterData, val.StoredProc, appId).subscribe(resp => {
            //console.log("pivot resp", resp);
            let frozenCols = [];
            let scrollableCols = [];
            let filterCols = [];
            let headerLevelOne = [];

            let dtIndex = tableModuleList.indexOf(val);

            this.frozenColsArray[dtIndex] = [];
            this.scrollableColsArray[dtIndex] = [];
            this.selectedColumnsArray[dtIndex] = [];
            this.filterColsArray[dtIndex] = [];
            this.primeNgTableArray[dtIndex] = [];
            this.visitedPagesData[dtIndex] = [];
            this.displayDialogModule[dtIndex] = [];

            val.moduleDetails = resp["moduleDetails"];

            if (val.moduleDetails != null && typeof (val.moduleDetails) != undefined) {
                val.moduleDetails.forEach((column) => {
                    ///frozen and scrollable columns primeng
                    if (column.HeaderLevel != 1 && column.InputControls != 'HiddenField') {
                        if (column.FrozenCols == true) {
                            frozenCols.push(column);
                        }
                        else {
                            scrollableCols.push(column);
                        }
                    }
                    else if (column.HeaderLevel == 1 && column.InputControls != 'HiddenField') {
                        headerLevelOne.push(column);
                    }
                    filterCols.push(column.ColumnName);
                    if (column.ShowCellContextMenu) this.mapContextMenuCommand(column.ContextMenus, column.ColumnName);//cell wise context menu
                });



                this.frozenColsArray[dtIndex] = frozenCols;
                this.scrollableColsArray[dtIndex] = scrollableCols;
                this.selectedColumnsArray[dtIndex] = scrollableCols;
                this.filterColsArray[dtIndex] = filterCols;
                this.displayDialogModule[dtIndex] = false;

                if (val.ShowRowContextMenu) this.mapContextMenuCommand(val.RowContextMenus, val.PrimaryKey);

                // if (val.GroupBy != "")//row highlight group by in pivot table
                //     this.updateRowGroupMetaData(val.moduleData, val.GroupBy, val.DefaultSortByColumn);


                let frozenWidth = frozenCols.length * 150 + 50 + "px";
                this.frozenWidthArray.push(frozenWidth);

                ///////////////////////////////////////////////////////////////////////////////////
                val.moduleData = resp["moduleData"];

                /*type cast date data*/
                var dateColumns = [];
                dateColumns = val.moduleDetails.filter(md => md.DataType.includes("date") || md.DataType.includes("time"));
                val.moduleData.map(d => {
                    dateColumns.forEach(column => {
                        if (d[column.ColumnName] != null)
                            d[column.ColumnName] = new Date(d[column.ColumnName]);
                    })
                });
                this.concatenatedArray = this.frozenColsArray[dtIndex].concat(this.scrollableColsArray[dtIndex]);
                this.calculateMaxWidths(resp["moduleData"], this.concatenatedArray, dtIndex);
                let moduledata = val.moduleData.slice(0, val.Rows);

                let temptabledata = [...moduledata]//when lazy loading
                this.temptableArray[dtIndex] = temptabledata;//this array is compared in AfterViewChecked

                this.Module[0].moduleList[moduleIndex].moduleData = val.moduleData;
                this.totalRecords[dtIndex] = val.moduleData.length;
                this.primeNgTableArray[dtIndex] = moduledata;
                this.visitedPagesData[dtIndex] = moduledata;
                this.moduleLoaderArray[dtIndex] = false;
                //console.log("moduleLoaderArray", dtIndex, this.moduleLoaderArray[dtIndex]);
                this.filterColsArray[dtIndex] = filterCols;



                if (val.NotificationParameterList.length > 0) {
                    this.ModuleDataWithRuleArray[dtIndex] = resp["dataWithRule"];
                }
            }
        });
    }

    async getFormData(val, moduleIndex, filterData, appId) {
        try {
            const data = await this.mainpageservice
                .populateModuleData(val.ID, this.Sys_Menu_ID, this.UserName, filterData, val.StoredProc, appId)
                .toPromise();

            let moduleData = data["moduleData"];
            this.moduleLoaderArray[moduleIndex] = false;
            // console.log("Form data", val.moduleData);

            val.moduleDetails.forEach(moduleDetail => {
                this.assignValueToModuleDetail(moduleDetail, moduleData);
            });

            this.updateModuleDetailsInModuleList(val, moduleIndex, moduleData);

            //console.log("Updated Form data", val.moduleDetails);
        } catch (error) {
            //console.error("Error fetching form data:", error);
            // Handle error, show message, etc.
        }
    }

    assignValueToModuleDetail(moduleDetail: any, moduleData) {
        let value = moduleData[0][moduleDetail.ColumnName];
        //debugger;
        if (moduleDetail.DataType === 'date' || moduleDetail.DataType === 'datetime') {
            moduleDetail.value = value ? new Date(value) : new Date();
        } else if (moduleDetail.InputControls.toLowerCase() === "dropdownlist") {
            moduleDetail.value = this.getDropdownValue(value, moduleDetail.DropDownValues);
        } else if (moduleDetail.InputControls.toLowerCase() === "multidropdownlist") {
            moduleDetail.Multiselectvalue = [];
            if (value !== undefined && value !== null) {
                moduleDetail.Multiselectvalue.push(this.getMultiDropdownValue(value, moduleDetail.DropDownValues));
            }

            //console.log("multidropdown", moduleDetail.value)
        } else {
            moduleDetail.value = value;
        }
    }


    getDropdownValue(value, dropDownValues) {
        if (isNaN(value)) {
            return dropDownValues.find(v => v.Text === value) || {};
        } else {
            return dropDownValues.find(v => v.Value === value) || {};
        }
    }

    getMultiDropdownValue(value, dropDownValues) {
        if (value.includes(",")) {
            let listOfValues = value.split(",");
            return listOfValues.map(v => this.getDropdownValue(v, dropDownValues));
        } else {
            return this.getDropdownValue(value, dropDownValues);
        }
    }

    updateModuleDetailsInModuleList(val, moduleIndex, moduleData) {
        this.Module[0].moduleList[moduleIndex].moduleDetails = val.moduleDetails;
        this.Module[0].moduleList[moduleIndex].moduleData = moduleData;
    }

    updateSubModuleDetailsInModuleList(val, moduleIndex, subModuleIndex, moduleData) {
        this.Module[0].moduleList[moduleIndex].submodule[subModuleIndex].moduleDetails = val.moduleDetails;
        this.Module[0].moduleList[moduleIndex].submodule[subModuleIndex].moduleData = moduleData;
    }


    getListView(val, moduleIndex, filterData, appId) {
        this.mainpageservice.populateModuleData(val.ID, this.Sys_Menu_ID, this.UserName, filterData, val.StoredProc, appId).subscribe(data => {
            val.moduleData = data["moduleData"];
            this.listViewDataComplete = val.moduleData; //preservation of complete data
            this.listViewTotalRecords = this.listViewDataComplete.length; //maintaining the total number of records for paginator
            this.listviewdata = this.listViewDataComplete.slice(0, 9); //slicing the data to show 9 cards per page
        });
    }

    //paginator method for listview
    onListPageChange(event) {
        this.listviewdata = this.listViewDataComplete.slice(event.first, event.first + event.rows);
    }


    //Multichart Method Updated
    async getMultiChart(val, moduleIndex, filterData, appId) {
        const data = await this.mainpageservice.populateModuleData(val.ID, this.Sys_Menu_ID, this.UserName, filterData, val.StoredProc, appId).toPromise();
        val.moduleData = data["moduleData"];
        this.Module[0].moduleList[moduleIndex].moduleData = val.moduleData;
        this.moduleLoaderArray[moduleIndex] = false;
        //console.log("Multichart", moduleIndex, this.Module[0].moduleList[moduleIndex].moduleData);
    }

    getTilesWithRules(val, moduleIndex, filterData, appId) {
        if (val.NotificationParameterList.length > 0) {
            if (val.NotificationParameterList.length > 0) {
                this.mainpageservice.populateModuleData(val.ID, this.Sys_Menu_ID, this.UserName, filterData, val.StoredProc, appId, val.NotificationParameterList.length).subscribe(data => {
                    this.ModuleDataWithRuleArray[moduleIndex] = data["dataWithRule"];
                    val.moduleData = data["moduleData"];
                    let dataWithRules = this.ModuleDataWithRuleArray[moduleIndex];
                    if (dataWithRules != null) {
                        let dataArray = Object.keys(dataWithRules).map(function (index) {//convert Object to array
                            let data = dataWithRules[index];
                            return data;
                        });

                        if (val.moduleData != null && val.moduleData.length > 0) {
                            //debugger;
                            if (val.moduleData[0].hasOwnProperty("Group")) {
                                let tileGroup = {};
                                let tileGroupNames = val.moduleData.reduce(function (a, b) {
                                    if (a.indexOf(b.Group) === -1) {
                                        a.push(b.Group);
                                    }
                                    return a;
                                }, []);
                                //console.log(tileGroupNames);
                                if (tileGroupNames.length > 0) {
                                    tileGroupNames.forEach(groupName => {
                                        tileGroup[groupName] = dataWithRules.filter(d => d["Group"].Value == groupName);
                                    })
                                }
                                //console.log("TileGroup", tileGroup);
                                this.multichart_tileGroup = Object.keys(tileGroup).map(function (index) {//convert Object to array
                                    let data = tileGroup[index];

                                    return data;
                                });
                            }
                            else {
                                this.multichartdata = dataArray;
                            }
                            this.moduleLoaderArray[moduleIndex] = false;
                        }
                    }


                })
            }
        }
        else {
            this.getMultiChart(val, moduleIndex, filterData, appId);
        }
    }

    async GetTreeTable(val, moduleIndex, tableModuleList, filterData, appId) {
        let frozenCols = [];
        let scrollableCols = [];
        let filterCols = [];

        let dtIndex = tableModuleList.indexOf(val);

        this.frozenColsArray[dtIndex] = [];
        this.scrollableColsArray[dtIndex] = [];
        this.selectedColumnsArray[dtIndex] = [];
        this.filterColsArray[dtIndex] = [];
        this.primeNgTableArray[dtIndex] = [];

        if (val.moduleDetails != null && typeof (val.moduleDetails) != undefined) {
            val.moduleDetails.forEach((column) => {
                ///frozen and scrollable columns primeng
                if (column.InputControls != "HiddenField") {

                    if (column.FrozenCols == true) {
                        frozenCols.push(column);
                    }
                    else {
                        scrollableCols.push(column);
                    }
                }
                filterCols.push(column.ColumnName);
            });


            this.RowRightClickOption = [];
            var linkColumns = val.moduleDetails.filter(md => md.InputControls.includes("Link"));
            linkColumns.forEach(column => {
                this.RowRightClickOption.push({ label: column.ColumnHeader, icon: 'pi pi-fw pi-external-link', command: () => this.navigate(this.selectedProduct[column.ColumnName], column.LinkedMenu) });
            });
            this.RowRightClickOptions.push(this.RowRightClickOption);
        }

        const data = await this.mainpageservice.getTreeTableData(val.ID, this.Sys_Menu_ID, this.UserName, filterData, val.StoredProc, appId).toPromise();
        let treedata: any = data;

        let file: FileSystemNode[] = [];

        // for (let i = 0; i < (<any>treedata).data.length; i++)
        for (let i = 0; i < (<any>treedata).length; i++) {
            //angular logic to make tree structure is written in //assets/data/FilSystemNode.ts
            // let rootObj = (<any>treedata).data[i];
            let rootObj = (<any>treedata)[i].data;
            let node = new FileSystemNode(rootObj, null, val.moduleDetails);
            file.push(node);
        }
        this.files = file;
        let frozenWidth = frozenCols.length * 150 + 50 + "px";

        this.scrollableColsArray[dtIndex] = scrollableCols;
        this.frozenColsArray[dtIndex] = frozenCols;
        this.primeNgTableArray[dtIndex] = this.files;
        this.filterColsArray[dtIndex] = filterCols;
        this.frozenWidthArray[dtIndex] = frozenWidth;
        this.selectedColumnsArray[dtIndex] = scrollableCols;
        this.moduleLoaderArray[moduleIndex] = false;

    }


    //updated

    getPivotTableWithDialog(val, moduleIndex, tableModuleList, filterData, appId) {
        val.submodule.forEach(submodule => {
            let subModuleIndex: number;

            subModuleIndex = val.submodule.indexOf(submodule);
            if (submodule.DisplayType == 'PrimeNgPivotTable' || submodule.DisplayType == 'PivotTable' ||
                submodule.DisplayType == 'PrimeNgTable' || submodule.DisplayType == 'PrimeUnfrozenTable' ||
                submodule.DisplayType == '' || submodule.DisplayType.toLowerCase() == 'table') {
                //possible display types to show in dialog

                let frozenCols = [];
                let scrollableCols = [];
                let filterCols = [];

                if (submodule.subModuleDetails != null && typeof (submodule.subModuleDetails) != undefined) {
                    submodule.subModuleDetails.forEach((column) => {
                        ///frozen and scrollable columns primeng
                        if (column.InputControls != "HiddenField") {
                            if (column.FrozenCols == true) {
                                frozenCols.push(column);
                            }
                            else {
                                scrollableCols.push(column);
                            }
                        }

                        filterCols.push(column.ColumnName);

                    });


                    this.mainpageservice.GetPivotedData(val.ID, this.Sys_Menu_ID, this.UserName, filterData, submodule.StoredProc, appId).subscribe(data => {
                        submodule.moduleData = data["submodule"][subModuleIndex].moduleData;

                        //console.log(data["submodule"][subModuleIndex], "atharva")

                        frozenCols = [];
                        scrollableCols = [];

                        if (data["submodule"][0].subModuleDetails != null && typeof (data["submodule"][0].subModuleDetails) != undefined) {
                            data["submodule"][0].subModuleDetails.forEach((column) => {
                                ///frozen and scrollable columns primeng
                                if (column.InputControls != "HiddenField") {
                                    if (column.FrozenCols == true) {
                                        frozenCols.push(column);
                                    }
                                    else {
                                        scrollableCols.push(column);
                                    }
                                }

                                filterCols.push(column.ColumnName);
                            });
                        }

                        /*type cast date data*/
                        var dateColumns = [];
                        dateColumns = submodule.subModuleDetails.filter(md => md.DataType.includes("date"));
                        submodule.moduleData.map(d => {
                            dateColumns.forEach(column => {
                                if (d[column.ColumnName] != null)
                                    d[column.ColumnName] = new Date(d[column.ColumnName]);
                            })
                        });

                        this.SubmoduleDataSourceArray.push(submodule.moduleData);
                        if (this.Module[0].moduleList[moduleIndex].submodule[subModuleIndex].ColumnsForSum) {
                            this.SubmoduleDataSourceArray[subModuleIndex].forEach(rowdata => {
                                this.calculateRowWiseTotalSubmodule(rowdata, moduleIndex, subModuleIndex)
                            });
                        }

                        let valueIndex = 0;

                        const dropDownArray: { AppId: null, Selected: boolean, Text: string, Value: number }[] = scrollableCols.map(obj => {
                            const newObj = {
                                AppId: null,
                                Selected: false,
                                Text: obj.ColumnName,
                                Value: valueIndex++
                            };
                            return newObj;
                        });

                        //console.log(dropDownArray);

                        this.dropDownArrayDialog = dropDownArray;
                        this.filterColsArray[moduleIndex] = filterCols;
                        this.displayedSubmoduleColumns[subModuleIndex] = scrollableCols;
                        this.frozenColsSubmoduleArray[subModuleIndex] = frozenCols;
                        let frozenWidth = frozenCols.length * 150 + 50 + "px";
                        this.frozenWidthSubModuleArray[subModuleIndex] = frozenWidth;
                        this.displayDialogModule.push('no dialog');
                        this.moduleLoaderArray[moduleIndex] = false;
                    });

                }
            }
        });
    }


    async getFormTableSubmodule(val, moduleIndex, tableModuleList, filterData, appId) {

        let SubmoduleDataSource = [];
        let SubmoduleScrollableCols = [];
        let SubmoduleFrozenCols = [];
        let SubModuleFrozenWidth = [];
        let displayDialogSubmodule = [];
        let filterCols = [];
        let dtIndex = tableModuleList.indexOf(val);

        await Promise.all(val.submodule.map(async (moduleinsidesubmodule) => {
            let subModuleIndex = val.submodule.indexOf(moduleinsidesubmodule);
            if (moduleinsidesubmodule.DisplayType === 'Form') {

                try {
                    const submoduleData = await this.mainpageservice.populateModuleData(val.ID, this.Sys_Menu_ID, this.UserName, filterData, moduleinsidesubmodule.StoredProc, appId).toPromise();

                    moduleinsidesubmodule.subModuleDetails.forEach((moduleDetail) => {
                        this.assignValueToModuleDetail(moduleDetail, submoduleData["moduleData"]);
                    });

                    this.updateSubModuleDetailsInModuleList(moduleinsidesubmodule, moduleIndex, subModuleIndex, submoduleData["moduleData"]);
                }
                catch (error) {
                    //console.error("Error fetching form data:", error);
                    // Handle error, show message, etc.
                }

            }

            if (moduleinsidesubmodule.DisplayType == 'PrimeNgPivotTable' || moduleinsidesubmodule.DisplayType == 'PivotTable' ||
                moduleinsidesubmodule.DisplayType == 'PrimeNgTable' || moduleinsidesubmodule.DisplayType == 'PrimeUnfrozenTable' ||
                moduleinsidesubmodule.DisplayType == '' || moduleinsidesubmodule.DisplayType.toLowerCase() == 'table') {

                let frozenCols = [];
                let scrollableCols = [];

                let headerLevelOne = [];

                if (moduleinsidesubmodule.subModuleDetails != null && typeof moduleinsidesubmodule.subModuleDetails !== 'undefined') {
                    moduleinsidesubmodule.subModuleDetails.forEach((column) => {
                        if (column.InputControls !== "HiddenField" && column.HeaderLevel !== 1) {
                            if (column.FrozenCols === true) {
                                frozenCols.push(column);
                            } else {
                                scrollableCols.push(column);
                            }

                        } else if (column.InputControls !== "HiddenField" && column.HeaderLevel === 1) {
                            headerLevelOne.push(column);
                        }

                        filterCols.push(column.ColumnName);
                    });

                    try {

                        const submoduleData = await this.mainpageservice.populateModuleData(val.ID, this.Sys_Menu_ID, this.UserName, filterData, moduleinsidesubmodule.StoredProc, appId).toPromise();
                        moduleinsidesubmodule.moduleData = submoduleData["moduleData"];

                        // type cast date data

                        const dateColumns = moduleinsidesubmodule.subModuleDetails.filter(md => md.DataType.includes("date"));
                        moduleinsidesubmodule.moduleData.forEach(d => {
                            dateColumns.forEach(column => {
                                if (d[column.ColumnName] !== null) {
                                    d[column.ColumnName] = new Date(d[column.ColumnName]);
                                }

                            });

                        });

                        if (this.Module[0].moduleList[moduleIndex].submodule[subModuleIndex].ColumnsForSum) {
                            SubmoduleDataSource[subModuleIndex].forEach(rowdata => {
                                this.calculateRowWiseTotalSubmodule(rowdata, moduleIndex, subModuleIndex)
                            });

                        }

                    } catch (error) {
                        console.error('Error fetching submodule data:', error);
                    }

                }

                const frozenWidth = `${frozenCols.length * 150 + 50}px`;

                SubmoduleDataSource[subModuleIndex] = moduleinsidesubmodule.moduleData;
                SubmoduleScrollableCols[subModuleIndex] = scrollableCols;
                SubmoduleFrozenCols[subModuleIndex] = frozenCols;
                SubModuleFrozenWidth[subModuleIndex] = frozenWidth;
                displayDialogSubmodule[subModuleIndex] = false;

            }

            this.primeNgTableArray[dtIndex] = SubmoduleDataSource;
            this.scrollableColsArray[dtIndex] = SubmoduleScrollableCols;
            this.frozenColsArray[dtIndex] = SubmoduleFrozenCols;
            this.frozenWidthArray[dtIndex] = SubModuleFrozenWidth;
            this.filterColsArray[dtIndex] = filterCols;
            this.displayDialogModule[dtIndex] = displayDialogSubmodule;
        }));



    }


    GetTree(val, moduleIndex, filterData, appId) {

        let depth = 0;
        this.mainpageservice.getTreeData(val.ID, this.Sys_Menu_ID, this.UserName, filterData, val.StoredProc, appId).subscribe(data => {
            // this.treeModuleData = <TreeNode[]>val.TreeData;
            this.treeModuleData = data[0]['children'];
            this.treeModuleData.forEach(node => {
                this.expandRecursive(node, true, depth);
            });
            this.Module[0].moduleList[moduleIndex].moduleData = this.treeModuleData;
            //console.log(this.treeModuleData);
            //this.treeModuleArray.push(treeModuleData);
        })
    }

    async getPage(appId, filterData) {
        try {
            const page = await this.mainpageservice.GetPageWithoutModuleData(this.Sys_Menu_ID, this.UserName, appId).toPromise();
            //console.log("Page structure", page);
            this.events.publish('breadcrumb', page["breadcrumb"]);//subscribed in MainPage
            //this.metaData = page['planDatasetRunIdConfig']['ConfigItems'];


            this.Module = [];
            this.Module[0] = page;
            //console.log(this.Module);

            let moduleList = page["moduleList"];
            let tableModuleList = moduleList.filter(m => m.DisplayType == '' || m.DisplayType.toLowerCase() == "primeunfrozentable" || m.DisplayType.toLowerCase() == "crudtable" || m.DisplayType.toLowerCase() == 'primengpivottable' || m.DisplayType.toLowerCase() == 'dataview' || m.DisplayType.toLowerCase() == "formtablesubmodule" || m.DisplayType.toLowerCase() == "tablewithrowgrouping" || m.DisplayType.toLowerCase() == "treetable");
            let tableModulesCount = moduleList.filter(m => m.DisplayType == '' || m.DisplayType.toLowerCase() == "primeunfrozentable" || m.DisplayType.toLowerCase() == "crudtable" || m.DisplayType.toLowerCase() == 'primengpivottable' || m.DisplayType.toLowerCase() == 'dataview' || m.DisplayType.toLowerCase() == "formtablesubmodule" || m.DisplayType.toLowerCase() == "tablewithrowgrouping" || m.DisplayType.toLowerCase() == "treetable").length;
            let modulesCount = moduleList.length;

            //disabled array
            if (this.Module != undefined && this.Module[0].moduleList.length > 0) {
                this.Module[0].moduleList.forEach((val, index) => {
                    this.moduleListData.push(val.TabModuleDependency);
                    this.activeLinkIndex[index] = 0;
                    //console.log("moduleListData", this.moduleListData);
                    this.moduleListDataLength = this.moduleListData.length;

                    if (this.Module[0].moduleList.indexOf(val) == 0) {
                        this.DisabledArray.push(false);
                    }
                    else if (val.TabModuleDependency != null) {
                        this.DisabledArray.push(true);
                    }

                    //console.log("DisabledArray", this.DisabledArray)
                });
            }

            for (var i = 0; i < tableModulesCount; i++) {
                this.totalRecords[i] = [];
                this.visitedPagesData[i] = [];
                this.primeNgTableArray[i] = [];
                this.moduleLoaderArray[i] = [];
                this.temptableArray[i] = [];
                this.ModuleDataWithRuleArray[i] = [];
                this.displayDialogModule[i] = [];
            }
            for (var i = 0; i < modulesCount; i++) {
                this.moduleLoaderArray[i] = true;
            }

            //to view Modules is Step format like a Wizard
            //once necessary action is performed in first module then only navigate to next module
            this.steps = [];
            if (this.Module[0].steps != null) {

                this.Module[0].steps.forEach(x => {

                    this.steps.push({
                        label: x['label'], command: (event: any) => {
                            this.StepactiveIndex = x.ActiveIndex;
                        }
                    });
                })
                //console.log('StepData', this.steps)
            }

            //set activeTab of linked menu
            let queryparams = this.activateRouter.snapshot.queryParams;
            if (Object.keys(queryparams).length > 0) {

                this.activateRouter.queryParams.subscribe((data: Params) => {
                    this.LinksModule = data['moduleName']
                    console.log('queryData', this.LinksModule);
                    let linkData = this.Module[0].moduleList.findIndex(val => val.ModuleName == this.LinksModule);
                    this.activeLinkIndex[0] = linkData
                })
            }


            if (this.Module[0].menu.DisplayType.toLowerCase() != "dataview") {
                //if menu display type is not dataview then poplate module data for each modules after loading the page structure
                moduleList.forEach(val => {
                    let moduleIndex = moduleList.indexOf(val);

                    if (val.DisplayType == '' || val.DisplayType.toLowerCase() == "primeunfrozentable" ||
                        val.DisplayType.toLowerCase() == "crudtable" ||
                        val.DisplayType == 'PrimeNgTable' || val.DisplayType.toLowerCase() == 'primengmultiheadertable' ||
                        val.DisplayType == 'MultiHeaderTable' || val.DisplayType == 'Report'
                        || val.DisplayType.toLowerCase() == 'dataview' || val.DisplayType.toLowerCase() == "cardview" ||
                        val.DisplayType.toLowerCase() == "tablewithrowgrouping") {//tables with lazy loading

                        if (val.DataSource != 'PythonAPI') {
                            this.getTableModule(val, moduleIndex, tableModuleList, filterData, appId);
                        }
                    }
                    else if (val.DisplayType.toLowerCase() == "primengpivottable" || val.DisplayType.toLowerCase() == "pivottable") {

                        this.getPivotTableModule(val, moduleIndex, tableModuleList, filterData, appId);

                    }
                    else if (val.DisplayType == 'Form' || val.DisplayType.toLowerCase() == "workflow" || val.DisplayType.toLowerCase() == "formwithgrouping") {//form display
                        this.getFormData(val, moduleIndex, filterData, appId);
                    }

                    else if (val.DisplayType.toLowerCase() == "listviewsubmodule") {
                        this.getListView(val, moduleIndex, filterData, appId);

                    }
                    else if (val.DisplayType.toLowerCase() == "chart") {
                        this.getMultiChart(val, moduleIndex, filterData, appId);
                    }
                    //else if ((val.DisplayType.toLowerCase() == "multichart" || val.DisplayType.toLowerCase() == "chart") && val.moduleDetails != null) {
                    //    //to create charts or tiles
                    //    this.getMultiChartWithoutModuleDetails(val, moduleIndex, filterData, appId);
                    //}
                    //else if ((val.DisplayType.toLowerCase() == "multichart" || val.DisplayType.toLowerCase() == "chart") && val.moduleDetails == null) {

                    //    //to crate charts or tiles without moduledetails/rule engine
                    //    this.getMultiChartWithoutModuleDetails(val, moduleIndex, filterData, appId);
                    //}
                    else if (val.DisplayType.toLowerCase() == "multichart") {
                        //to create tile with rule engine
                        this.getTilesWithRules(val, moduleIndex, filterData, appId);
                    }
                    else if (val.DisplayType.toLowerCase() == "treetable") {
                        this.GetTreeTable(val, moduleIndex, tableModuleList, filterData, appId);
                    }
                    else if (val.DisplayType.toLowerCase() == 'pivottablewithdialog' || val.DisplayType.toLowerCase() == 'pivottablereview') {
                        //display type to show dialog with form/table on click of row of pivot table
                        this.getPivotTableWithDialog(val, moduleIndex, tableModuleList, filterData, appId);
                        //console.log("ARRAYS", this.displayedSubmoduleColumns, this.SubmoduleDataSourceArray, this.frozenColsSubmoduleArray, this.frozenWidthSubModuleArray)
                    }
                    else if (val.DisplayType == 'FormTableSubmodule') {
                        this.getFormTableSubmodule(val, moduleIndex, tableModuleList, filterData, appId);
                    }
                    else if (val.DisplayType.toLowerCase() == "tree") {
                        this.GetTree(val, moduleIndex, filterData, appId);
                    }
                    // else if (val.DisplayType.toLowerCase() === "calendar") {
                    //   this.calendarService.init(this.container, this.calendarComponent, this.messageService);
                    //   this.show = false;
                    //   val['MenuId'] = this.Sys_Menu_ID;
                    //   val['AppId'] = appId
                    //   val['UserName'] = this.UserName;
                    //   this.calendarService.setModule(val);
                    // }
                    else if (val.DisplayType.toLowerCase() == "processflow") {
                        type ProcessFlowData = {
                            Name: string;
                            Status?: "Running" | "Completed" | "Error" | "Not Started";
                            SubTasks?: Array<ProcessFlowData>;
                            DurationInSeconds?: number;
                        };
                        //this.processFlowInterval = setInterval(() => {
                        //    this.mainpageservice
                        //        .getProcessFlowData(this.UserName, val.StoredProc, appId)
                        //        .toPromise()
                        //        .then((data: ProcessFlowData[]) => {
                        //            val.moduleData = data;
                        //            val["maxItems"] = val.moduleData
                        //                .reduce((acc: number, current: ProcessFlowData) => current?.SubTasks?.length > acc ? current.SubTasks.length : acc, 0);
                        //        });
                        //}, 4000);
                        //updated by atharva for v18 needs testing
                        this.processFlowInterval = setInterval(() => {
                            firstValueFrom(this.mainpageservice.getProcessFlowData(this.UserName, val.StoredProc, appId))
                                .then((data: ProcessFlowData[]) => {
                                    val.moduleData = data;
                                    val["maxItems"] = val.moduleData.reduce((acc: number, current: ProcessFlowData) =>
                                        current?.SubTasks?.length > acc ? current.SubTasks.length : acc, 0);
                                })
                                .catch(error => {
                                    console.error('Error fetching process flow data:', error);
                                });
                        }, 4000);
                    }
                    //get data for process flow
                    if (val.TimelineData != null) {
                        //    val.TimelineData.forEach(x => {
                        //        if (x.Submodule.DisplayType.toLowerCase() == 'tilesgroup') {
                        //            this.mainpageservice.GetSubmoduleTileGroupData(this.UserName, x.Submodule.ID).subscribe(
                        //                (data) => {
                        //                    x.Submodule.tilesgroupdata = data;
                        //                },
                        //                (error) => {
                        //                    console.error('Error fetching tilegroup data:', error);
                        //                }
                        //            );
                        //        }
                        //    });
                    }
                });
            }
            else {
                let dataviewModule = moduleList.find(m => m.DisplayType.toLowerCase() == "dataview")

                //if menu display type is dataview  then onload populate module data of dataview module only
                //module data for other table modules will get populate on click of dataview tiles
                //this display type is used in Validate Dataset screen
                //it displays error count and data count in dataview
                //table modules will be displayed by clicking on respective modules

                let moduleIndex = moduleList.indexOf(dataviewModule);
                this.getTableModule(dataviewModule, moduleIndex, tableModuleList, filterData, appId);
                this.show = false;
                //if (dataviewModule) this.ruleEngine.executeRuleEngine(this.Sys_Menu_ID);
            }
        }
        catch (error) {
            //console.log(error);
        }
    }


    async populateModuleData(module, dtIndex, moduleIndex, filterData, appId) {
        const data = await this.mainpageservice.populateModuleData(module.ID, this.Sys_Menu_ID, this.UserName, filterData, module.StoredProc, appId, module.NotificationParameterList.length).toPromise();
        //debugger;
        module.moduleData = data["moduleData"];
        module.ModuleWiseTiles = data["moduleWiseTiles"];
        /*type cast date data*/
        var dateColumns = [];
        dateColumns = module.moduleDetails.filter(md => md.DataType.includes("date") || md.DataType.includes("time"));
        module.moduleData.map(d => {
            dateColumns.forEach(column => {
                if (d[column.ColumnName] != null)
                    d[column.ColumnName] = new Date(d[column.ColumnName]);
            })
        });
        let moduledata = module.moduleData.slice(0, module.Rows);

        let temptabledata = [...moduledata]//when lazy loading
        this.temptableArray[dtIndex] = temptabledata;//this array is compared in AfterViewChecked

        this.Module[0].moduleList[moduleIndex].moduleData = data["moduleData"];
        if (this.Module[0].moduleList[moduleIndex].TableToChart) {
            this.Module[0].moduleList[moduleIndex].ListOfCharts.forEach(x => {
                if (x.Active) {
                    this.mainpageservice.GetModuleChartTable(x.ChartId, data["moduleData"]).subscribe({
                        next: (response) => {
                            x.moduleData = response;
                        }
                    });
                }
            });
        }
        this.totalRecords[dtIndex] = module.moduleData.length;
        this.primeNgTableArray[dtIndex] = moduledata;
        this.calculateMaxWidths(data["moduleData"], this.scrollableColsArray[dtIndex], dtIndex); //refactor if needed
        this.visitedPagesData[dtIndex] = moduledata;
        this.moduleLoaderArray[moduleIndex] = false;
        //console.log("moduleLoaderArray", dtIndex, this.moduleLoaderArray[moduleIndex]);
        if (module.NotificationParameterList.length > 0) {
            if (module.NotificationParameterList.length > 0) {
                this.ModuleDataWithRuleArray[moduleIndex] = data["dataWithRule"];
                this.Module[0].moduleList[moduleIndex].RuleErrorData = data["RuleErrorData"];
            }
        }

        if (module.DisplayType.toLowerCase() == 'tablewithrowgrouping') {
            this.transformArrayData(this.primeNgTableArray[dtIndex], dtIndex);
        }

        if (module.DisplayType.toLowerCase() == 'dataview') {
            let filterByColumn: string;
            filterByColumn = module.FilterByColumn;
            this.Dataview.filterByValue = this.Dataview.GetFilterOptions(filterByColumn, this.primeNgTableArray[dtIndex]);

            this.table_list = this.primeNgTableArray[dtIndex].map(item => {
                if (item.ErrorCount != 0) {
                    this.isFinalSubmit = true
                    return;
                }
                item.SaveToStaging = false;
                const { TableName, ...rest } = item;
                return { ...rest, UploadToTable: TableName };
            });
        }
        if (module.DisplayType.toLowerCase() == 'cardview') {
            this.CardViewModuleDetails = module.moduleDetails;
            let data = module.moduleData;
            let that = this;
            data.map(function (r) {
                //To convert string or comma separated values to array for toggle buttons
                module.moduleDetails.forEach(md => {
                    if (md.InputControls.toLowerCase() == "multidropdownlist") {
                        let columnName = md.ColumnName;
                        if (r[columnName] != undefined) {
                            r[columnName] = that.convertStringToArray(r[columnName]);
                        }

                    }
                });
            })
            this.cardViewData = <any[]>module.moduleData;
            this.paginateData = [];
            if (module.Rows == 4) {
                for (let i = 0; i < module.moduleData.length; i++) {
                    this.paginateData.push(module.moduleData[i]);
                }
            }
            this.paginateData = this.paginateData.slice(0, module.Rows);
            //console.log(this.cardViewData)
            //console.log("Card View", module, this.CardViewModuleDetails)
        }
    }

    mapContextMenuCommand(RowContextMenus, PrimaryKey) {
        let dt_count: number;
        if (RowContextMenus != null) {
            RowContextMenus.forEach(contextMenu => {
                //console.log("contextMenu", contextMenu)
                var command = contextMenu.command;
                //console.log(this);
                contextMenu.command = (onclick) => {

                    if (command.toString().toLowerCase() == "deleterow") {
                        alert(command.toString());
                    }
                    else if (command.toString().toLowerCase() == "copyrow") {
                        alert(command.toString());
                    }
                    else if (command.toString().toLowerCase() == "addrow") {
                        alert(command.toString());
                    }
                    else if (command.toString().toLowerCase() == "navigate") {
                        this.cellContextMenu.hide();
                        setTimeout(() => {
                            this.navigate(this.selectedCellValue, contextMenu.LinkMenuId, this.selectedCellHeader);
                            //this.navigate(this.selectedrow[PrimaryKey], contextMenu.LinkMenuId);
                        }, 500);

                    }
                }
            });

        }
    }

    calculateRowWiseTotalSubmodule(rowData, moduleIndex, subModuleIndex) {
        //debugger;
        var columnsForSum = this.Module[0].moduleList[moduleIndex].submodule[subModuleIndex].ColumnsForSum;
        var ShowSumIn = this.Module[0].moduleList[moduleIndex].submodule[subModuleIndex].GetSumIn;
        let rowWiseTotal: number = 0;
        if (columnsForSum) {
            columnsForSum.forEach(element => {
                if (!isNaN(rowData[element]))
                    rowWiseTotal = rowWiseTotal + parseInt(rowData[element]);
            });
        }
        rowData[ShowSumIn] = rowWiseTotal;
    }

    expandRecursive(node: TreeNode, isExpand: boolean, depth: number) {    //Created to expand the current node as well as all the child node of current node.
        node.expanded = isExpand;
        if (node.children) {
            depth++;
            if (node.children && depth < 2) {
                node.children.forEach(childNode => {
                    this.expandRecursive(childNode, isExpand, depth);
                });
            }
        }
        this.step--;
    }
    navigate(i, LinkedMenu, FilterName?: string, rowIndex?: number) {
        if (rowIndex > -1) { this.highlightcard = rowIndex; }
        let qm = {};
        if (FilterName == null) {
            qm = { "rowval": i };
        }
        else {
            qm[FilterName] = {};
            qm[FilterName].Text = i;
        }
        let navigationExtras: NavigationExtras =
            { queryParams: qm };
        localStorage.setItem('navigationExtras', JSON.stringify(qm));
        this.events.publish('navigationExtras', qm);
        if (LinkedMenu != 0) this.router.navigateByUrl("/menu/first/tabs/" + LinkedMenu, navigationExtras);
        // this.router.navigate(["/menu/first/tabs/GotoForm"], navigationExtras);
    }

    convertStringToArray(value: string) {
        return value.split(",");
    }

    typeCastDateColumn(dateColumns, moduleData) {
        /*type cast date data*/

        return moduleData.map(d => {
            dateColumns.forEach(column => {
                if (d[column.ColumnName] != null)
                    d[column.ColumnName] = new Date(d[column.ColumnName]);
            })
        });
    }

    // Added For DYM Filter //

    clearCalendar(moduleIndex) {
        this.rangeDatesArray[moduleIndex] = null;
    }

    selectRange(moduleIndex) {
        //console.log("dates array", this.rangeDatesArray[moduleIndex]);
        this.FilterData[moduleIndex] = [];
        this.primeNgTableArray[moduleIndex] = []
        let data = this.Module[0].moduleList[moduleIndex].moduleData;
        const dateColumn = this.Module[0].moduleList[moduleIndex].moduleDetails
            .filter(x => x.DataType === 'date').map(x => x.ColumnName);

        this.FilterData[moduleIndex] = data.filter(item => {
            const itemDate = new Date(item[dateColumn]);
            const startFilterDate = this.rangeDatesArray[moduleIndex][0] ? new Date(this.rangeDatesArray[moduleIndex][0]) : null;
            const endFilterDate = this.rangeDatesArray[moduleIndex][1] ? new Date(this.rangeDatesArray[moduleIndex][1]) : null;

            return (
                (!startFilterDate || itemDate > startFilterDate) &&
                (!endFilterDate || itemDate <= endFilterDate)
            );
        })
        this.primeNgTableArray[moduleIndex] = <any[]>this.FilterData[moduleIndex].slice(this.firstcount, (this.firstcount + this.rowscount));
        this.totalRecords[moduleIndex] = this.FilterData[moduleIndex].length
    }

    async filterWithSku(data, moduleIndex) {
        this.selectedSku[moduleIndex] = data;
        this.mainpageservice.getDYMfilter(116, this.FilterData[moduleIndex], this.Module[0].moduleList[moduleIndex].moduleDetails, this.rangeDatesArray[moduleIndex]).subscribe(resp => {
            this.DmyData = [];
            this.DmyData[moduleIndex] = resp;
            this.cols = [];
            const dataMap = {
                1: [this.DmyData[moduleIndex].ColumnTransformDataMeasureValuesMonth, this.DmyData[moduleIndex].TransformDataMeasureValuesMonth],
                2: [this.DmyData[moduleIndex].ColumnTransformDataMeasureValuesQuarter, this.DmyData[moduleIndex].TransformDataMeasureValuesQuarter],
                3: [this.DmyData[moduleIndex].ColumnTransformDataMeasureValuesYear, this.DmyData[moduleIndex].TransformDataMeasureValuesYear],
            };

            if (data in dataMap) {
                const [columnArray, transformArray] = dataMap[data];
                for (const col of columnArray) {
                    this.cols.push({ field: col, header: col });
                }
                this.gropuedSku[moduleIndex] = transformArray;
            } else if (data === 0) {
                this.selectedSku[moduleIndex] = null;
            }
        });
    }

    //Susan - added start 
    onCellEditExit(rowData: any, moduleIndex: number) {
        debugger;
        this.chartsService.updateChartData(this.Module[0].moduleList[moduleIndex].ChartConfiguration, this.primeNgTableArray[0]);
    }
    // Susan - added end 


    toggleRow(rowData: any) {
        const index = this.expandedRows.indexOf(rowData);
        if (index === -1) {
            this.expandedRows.push(rowData);
        } else {
            this.expandedRows.splice(index, 1);
        }
    }

    isRowExpanded(rowData: any): boolean {
        return this.expandedRows.includes(rowData);
    }

    //susan added start 

    VerifyIfPincodeExists(inputPincode) {
        var respStr = "";

        setTimeout(() => {
            this.mainpageservice.VerifyIfPincodeExists(inputPincode).subscribe(data => {
                console.log(data);
                if (data === "Pincode exists !") {
                    this.isPincodeValid = true;
                    respStr = "Pincode exists !";
                }
                else {
                    this.isPincodeValid = false;

                    respStr = "Pincode doesn't exist !";
                    // let toast = this.toastController.create({
                    //     message: respStr,
                    //     duration: 3000,
                    //     position: 'bottom',

                    // });
                    // toast.then(toast => toast.present());
                    this.show = false;

                }
            });

        }, 8000);

        return false;
    }

    onFocusOutEvent(event: any, moduleIndex: any) {
        console.log(event.target.value);
        this.VerifyIfPincodeExists(this.Module[0].moduleList[0].moduleDetails[moduleIndex].value);
    }

    //susan added end 
    // End Of DYM Filter //

    transformArrayData(data, dtIndex) {
        const sourceKey = 'InputTables';

        const output = data.reduce((acc, obj) => {
            const existingEntry = acc.find(entry => entry.InputTables === obj[sourceKey]);

            if (existingEntry) {
                const subTableObj = {};
                Object.keys(obj).forEach(key => {
                    if (key !== sourceKey) {
                        subTableObj[key] = obj[key];
                    }
                });
                existingEntry.SubTableArray.push(subTableObj);
            } else {
                const newEntry = {
                    InputTables: obj[sourceKey],
                    SubTableArray: []
                };
                const subTableObj = {};
                Object.keys(obj).forEach(key => {
                    if (key !== sourceKey) {
                        subTableObj[key] = obj[key];
                    }
                });
                newEntry.SubTableArray.push(subTableObj);
                acc.push(newEntry);
            }

            return acc;
        }, []);

        this.datasetHistoryDataArray = output;
        console.log(output);
    }

    //method to open image preview
    OpenImagePreview(src: any, caption: any) {
        this.showDataviewImagePreview = true;
        this.dataviewImagePreviewSource = src;
        this.dataviewImagePreviewCaption = caption;
    }

    //upload  function with getpage to refresh data after upload file


    async onUploadHandler(event: any, Module: any, tableName: any): Promise<void> {
        try {
            const updatePlanDataset = true;

            const result = await this.uploadFile.handleFileInput(event.files, 'FileUpload', tableName, updatePlanDataset);

            let filterData = localStorage.getItem('navigationExtras');
            let appId: any = null;
            if (this.CurrentApp != null || this.CurrentApp !== undefined) {
                appId = this.CurrentApp.ID;
            }

            //console.log('Calling getPage after file upload/append');
            this.getPage(appId, filterData);

        } catch (error) {
            console.error('Error in uploadHandler: ', error);
        }
    }
    decryptPassword(event: Event, password: string) {

        const parent = (event.target as HTMLElement).parentElement;
        const icon = (event.target as HTMLElement).querySelector('i');
        const input = parent?.querySelector('input');

        if (input && icon) {
            if (input.getAttribute('type') === "password") {
                this.mainpageservice.GetDecryptedPassword(password).subscribe({
                    next: (decryptedData) => {
                        input.value = decryptedData.toString();
                        input.setAttribute('type', "text");
                        icon.className = "pi pi-eye";
                    }
                });
            } else {
                this.mainpageservice.GetEncryptedPassword(password).subscribe({
                    next: (encryptedData) => {
                        input.value = encryptedData.toString();
                        input.setAttribute('type', 'password');
                        icon.className = "pi pi-eye-slash";
                    }
                });
            }
        }
    }

    //variable column widths needs to add calls
    calculateMaxWidths(data, columns, dtIndex) {
        let maxWidths: any = {};

        columns.forEach(column => {
            // Skip width calculation for specific input control types
            if (column.InputControls === 'download' || column.InputControls === 'ReportButton' || column.DataType == 'date') {
                return; // Skip calculation for these controls
            }

            let maxLength = Math.max(...data.map(row => (row[column.ColumnName] ? row[column.ColumnName].toString().length : 0)));
            maxWidths[column.ColumnName] = maxLength * 6; // Estimate width per character (can be adjusted)
        });

        // Ensure sampleArray is initialized
        if (!this.variableColumnWidthsArray) {
            this.variableColumnWidthsArray = [];
        }

        // Initialize an empty array at the specific index if it doesn't exist
        if (!this.variableColumnWidthsArray[dtIndex]) {
            this.variableColumnWidthsArray[dtIndex] = [];
        }

        console.log(this.variableColumnWidthsArray, "Maximum Widths");
        this.variableColumnWidthsArray[dtIndex] = maxWidths;
    }

    assignVariableColumnWidths(col, dtIndex, isPivot?: boolean) {
        // debugger;
        if ((+this.variableColumnWidthsArray[dtIndex][col.ColumnName] < 100 || col.InputControls == 'ReportButton' || col.InputControls == 'download') && col.InputControls !== 'DropDownList') {
            return "80px";
        }
        else if (col.DataType == 'date') {
            return "80px";
        }
        else if (col.InputControls == 'DropDownList') {
            return "110px";
        }
        else if (col.FrozenCols == false && isPivot ? true : false) {
            return "100px";
        }
        else {
            return `${this.variableColumnWidthsArray[dtIndex][col.ColumnName]}px`;

        }

    }


    async RunSPOnButton(SP, MenuID, Event) {
        var filter1 = localStorage.getItem('filterdata');
        filter1 = JSON.stringify(filter1);
        let appId: any = null;
        if (this.CurrentApp != null || this.CurrentApp != undefined) appId = this.CurrentApp.ID;

        this.confirmationService.confirm({
            message: `<br><strong>Are you sure you want to do ${Event}?</strong><br> *Note: Please save records before  ${Event}`, // Updated message with warning
            accept: async () => { // Mark this function as async
                try {
                    // this.Run(i); // You can call other functions here if needed
                    this.show = true;

                    const resp = await this.mainpageservice.RunSPOnButton(SP, MenuID, this.UserName, filter1, appId).toPromise(); // Use await with the service call
                    await this.customService.GetDataForCDPFlow();
                    // let toast = await this.toastController.create({ // Ensure toast creation also waits
                    //     message: resp,
                    //     duration: 8000,
                    //     position: 'bottom',
                    // });

                    // await toast.present(); // Display the toast message
                    // window.location.reload();
                    this.show = false;

                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'You have successfully submitted!' });
                } catch (error) {
                    // Handle any errors that may occur during the async operations
                    console.error("Error during SP button execution", error);
                    this.show = false;
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred!' });
                }
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Cancelled', detail: 'You cancelled the submission!' });
            }
        });
    }

    //final submit confirmation///

    finalSubmitConfirmation(i, Event) {
        if (this.isFinalSubmit) {
            return;
        }
        //debugger;
        if (Event == 'Submit') {
            this.confirmationService.confirm({
                message: 'Are you sure you want to submit?',
                accept: () => {
                    //this.Run(i);
                    this.workflow.onFinalSubmit(i);
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'You have successfully submitted!' });
                    this.navigate(null, 1449)
                },
                reject: () => {
                    this.messageService.add({ severity: 'error', summary: 'Cancelled', detail: 'You cancelled the submission!' });
                    this.navigate(null, 1450)
                },
                closeOnEscape: true,
                dismissableMask: false
            });
        }
        else {
            this.confirmationService.confirm({
                message: 'Are you sure you want to Review?',
                accept: () => {
                    this.Run(i);
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'You have successfully click Review!' });

                },
                reject: () => {
                    this.messageService.add({ severity: 'error', summary: 'Cancelled', detail: 'You cancelled the Click Event!' });

                },
                closeOnEscape: true,
                dismissableMask: false
            });
        }
    }

    ///////////////////////////////////////////End Module Component///////////////////////////////////////
}
