import { MainPageService } from "../services/MainPage.service";
import { OnInit, ViewChild, ViewChildren, QueryList, ElementRef, Injectable } from '@angular/core';
import { ConfirmationService, TreeNode, MessageService, MenuItem } from 'primeng/api';
import { TieredMenu } from 'primeng/tieredmenu';
import { Table } from 'primeng/table';
import { environment } from "../../environments/environment";
import { Events } from "../services/events.service";
import { NavigationExtras } from '@angular/router';
import { ActivatedRoute, Params, Router, NavigationEnd, Event } from '@angular/router';
import { RuleEngine } from "../components/ruleEngine";
import { UploadFile } from '../components/uploadFile';
import { Dataview } from '../components/dataview';
import { WorkFlow } from '../components/workflow';
import { filter } from 'rxjs/operators';


interface Sku {
    key: string,
    value: number
}

@Injectable({
    providedIn: 'root'
})

export class CardView implements OnInit {
    dialogLabel: string = '';
    tableName: any;
    RowErrors: any;
    public isFinalSubmit: boolean = false;
    selectedImage: any; // to select an image to display it in dataview display type
    listviewdata: any;
    listviewsubmoduledata: any;
    filterValues: any[] = []; //filter values to show as chips
    addNew: boolean = false;
    highlightcard: number | undefined; //to highlight dataview selected record
    showFooter: boolean = true;     //to show footer in table
    displayDialog: boolean | undefined;     // display dialog box in pivotwithdialog if true
    displayDialogArray: any[] = []; // display dialog box of formtable module // used array because of formtable can have multiple submodules and can multiple dialog box
    thisrow: any = {};  // used for cloning and keeping current selected row value from formtable/crudtable/pivottablewithdialog
    selectedrow: any;   // less used current selected row of table variable
    selectedValues: any;   // current selected row of table is stored in this variable
    newrow!: boolean;    // to add a new row we check for true of this variable which becomes true when we click on add or plus button of table
    rows!: any[];
    Sys_Menu_ID: number = 1449;
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
    public searchElementRef!: ElementRef;
    public minDate: any = "";
    public maxDate: any = "2299-12-31";
    FileName: any;//Added
    UserName: any;
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
    Feedback: any;
    childColumnArray: Array<any> = [];
    FileList: Array<File> = [];
    public show: boolean = false;
    public loading: boolean = false;
    api_url: string = environment.apiUrl;
    //-accordions-----
    step = 0;
    showContainerEmail: boolean = false;
    ValidatedEmail: boolean = false;
    VerifiedEmailId: any;
    cols: any[] = [];
    colsdisplay: any[] = [];
    editableCols: any[] = [];
    totalRecords: any[] = [];
    DisabledArray: any[] = [];
    moduleListData: any[] = [];
    moduleListDataLength: any;
    scrollableColsArray: any[] = []; // to store scrollabeCols with dt_index
    frozenColsArray: any[] = []; //to store  frozenCols with dt_index
    primeNgTableArray: any[] = [];   //to store primengTableData with dt index;
    frozenWidthArray: any[] = [];    // to store frozen width property value with dt_index(how much width to provide for all frozen area of table)
    selectedColumnsArray: any[] = [];    // this variable is used for toggle features in pivottable(the list which it contains will be shown only)
    treetabledataArray: any;    // used to store tree table data with dt index
    //filterCols: any[];  // to be passed in global filter(it shows global filter as which columns are to be used when someone serches in global filter)
    filterColsArray: any[] = []; // to store filterCols for different table with dt_index(data table index)
    validationFilterModules: any[] = []; // to store the Validation moduleName for filter out in Dataview
    ValidateDataview: any[] = [];
    //headerLevelOne: any[];  // used in multiheader table for first th level
    headerLevelOneArray: any[] = []; // stores headerLevelOne of different table with dt_index
    reportTableArray: any[] = [];    //created for report table display Type but not used now
    reportTableColumnsArray: any[] = []; //created for report table display Type but not used now
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
    moduleLoaderArray: any[] = [];
    visitedPagesData: any[] = [];
    ModuleQuickLinks: any[] = [];
    LinksModule: any;
    treeModuleData: TreeNode[] = [];
    timelineData: any;
    timelineTableArray: any;
    timelineTableColumnsArray: any;
    steps: MenuItem[] = [];//use for primeng steps to store data
    ruleErrorData: any[] = [];
    filterRuleIndex: number | undefined;
    ModulesRuleData: any[] = [];
    UpdatedRows = [];
    RowID: number | undefined;
    dropDownArrayDialog: { AppId: null; Selected: boolean; Text: string; Value: number; }[] | undefined;
    listviewFilteredData: any[] = []; // to store filtered data for pagination
    row = 3; // define default number of rows for paginator
    expandedRows: any[] = []; // created for dataset history
    datasetHistoryDataArray: any[] = [];
    @ViewChildren('LatLong') latlong: QueryList<ElementRef> | undefined;
    @ViewChild('cellContextMenu', { static: false }) cellContextMenu: TieredMenu | undefined;
    @ViewChild('inputField')
    inputfield!: ElementRef;
    lat!: number;
    long: number | undefined;
    lat_long: string | undefined;
    @ViewChildren('dt') tables: QueryList<Table> | undefined;
    @ViewChild('dt', { static: false }) primengTable: Table | undefined;
    ModuleDataWithRule: any;
    RuleJson: any;
    routerEventSubscription: any;
    rowval: string | undefined;
    Locale: string | undefined;
    Currency: string | undefined;
    DateFormat: string | undefined;
    TimeZone: string | undefined;
    hourFormat: any;
    dateTimeFormat: string | undefined;
    appid: string | undefined;
    CurrentApp: any;
    disable: boolean = false;
    activeTabIndex: number = 0;
    ModuleDataWithRuleArray: any[] = [];
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
    rowGroupMetadata: any = {};
    applyCSSRuleToRow: boolean | undefined;
    RowRightClickOptions: any[] = [];
    RowRightClickOption: any[] = [];
    selectedProduct: any;
    contextMenu_tableIndex: number = 0;
    multichartdata: any[] = [];
    CardViewModuleDetails: any;
    cardViewData: any[] = [];
    paginateData: any;
    selectedCellValue: any;
    editorDisabled = true;
    topicId: number | undefined;
    isEditButtonClicked: boolean = true;
    selectedCellHeader: string | undefined;
    moduleName: any;
    StepactiveIndex: number = 0;
    activeLinkIndex: any[] = []; //used to set current active tab of linked menu
    showErrorDialog: boolean | undefined;//to display error dialog one excel is uploaded
    err_dt: any[] = []; //plain json of error data to display in tabular format
    err_columns: any[] = []; //list of columns from excel sheet
    errorList: any[] = [];//nested json format of error list from excel upload(Import Dataset)
    excelDataError: any;//to get the cell error while excel validation(Import daataset)
    multichart_tileGroup: any[] = [];
    rangeDatesArray = [];
    rangeDates: Date[] = [];
    FilterData: any[] = [];
    firstcount: number = 0;
    rowscount: number = 0;
    DmyData: any = [];
    Skus: Sku[] = [];
    selectedSku: number[] = [];
    gropuedSku: unknown[] = [];
    @ViewChild("container") container: ElementRef<HTMLDivElement> | undefined;
    isPincodeValid: boolean = false;
    showDataviewImagePreview: boolean | undefined;
    dataviewImagePreviewSource: any;
    dataviewImagePreviewCaption: any;
    cellContextMenus: MenuItem[] | undefined;
    sample: any[] = [
        {
            id: '1000',
            code: 'f230fh0g3',
            name: 'Bamboo Watch',
            description: 'Product Description',
            image: 'bamboo-watch.jpg',
            price: 65,
            category: 'Accessories',
            quantity: 24,
            inventoryStatus: 'INSTOCK',
            rating: 5
        },
        {
            id: '1001',
            code: 'nvklal433',
            name: 'Black Watch',
            description: 'Product Description',
            image: 'black-watch.jpg',
            price: 72,
            category: 'Accessories',
            quantity: 61,
            inventoryStatus: 'OUTOFSTOCK',
            rating: 4
        },
        {
            id: '1002',
            code: 'zz21cz3c1',
            name: 'Blue Band',
            description: 'Product Description',
            image: 'blue-band.jpg',
            price: 79,
            category: 'Fitness',
            quantity: 2,
            inventoryStatus: 'LOWSTOCK',
            rating: 3
        }
    ];


    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }


    constructor(
        private MainPageService: MainPageService,
        private events: Events,
        private router: Router,
        private activateRouter: ActivatedRoute,
        private messageService: MessageService,
        public Dataview: Dataview,
        public ruleEngine: RuleEngine,
        private uploadFile: UploadFile,
        private confirmationService: ConfirmationService,
        public workflow: WorkFlow,
    ) {
        this.UserName = localStorage.getItem('username');
        this.show = true;
    }


    closeCardDialog() {
        this.addNew = false;
        this.thisrow = {}
    }

    disableMultiSelection(formObject, checkboxName)//disable multi selection of checkbox in card view display type
    {
        let array = formObject.value[checkboxName];
        let latestItem = array[array.length - 1];
        array.length = 0;
        array.push(latestItem);
    }

    EditCard(pkColumnValue, pkColumn, Moduleindex) {
        let data = this.Module[0].moduleList[Moduleindex].moduleData;
        let row = data.find(r => r[pkColumn] == pkColumnValue);
        this.thisrow = row;
        this.thisrow = this.clonerowOfCrudTable(this.thisrow, Moduleindex);

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

                        if (c[prop].indexOf(',') > -1) {
                            let selected: string[] = c[prop].split(",");
                            row[prop] = [];
                            selected.forEach(value => {
                                const match = ModuleDetail.DropDownValues.find(v => v.Text === value);
                                if (match) {
                                    row[prop].push(match);
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

    async getPageMenuDetails() {

        let app = localStorage.getItem("currentApp") as string;
        this.CurrentApp = JSON.parse(app);
        var appliedFilters = localStorage.getItem("filterdata") as string;
        var filterJson = JSON.parse(appliedFilters);


        let filter1 = localStorage.getItem('navigationExtras');
        this.MainPageService.getPageMenuDetails(this.Sys_Menu_ID, this.UserName).subscribe({
            next: (reponse) => {
                console.log("response", reponse);
                //after getting response it is assign to the pageMenuDetails
                this.PageMenuDetails = reponse;
                console.log("PageMenuDetails", this.PageMenuDetails);

                if (filterJson != null && filterJson != undefined && Object.keys(filterJson).length !== 0) {
                    if (this.PageMenuDetails != undefined && this.PageMenuDetails.length > 0) {
                        Object.keys(filterJson).forEach(key => {
                            var pagemenudetail = this.PageMenuDetails.find((pgm: any) => pgm.ParameterName == key);
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
                        let pageFilter: { [key: string]: any } = {};
                        this.PageMenuDetails.forEach((menudetail: any) => {
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
                                mon = DObject.getMonth();
                                day = DObject.getDate();
                                year = DObject.getFullYear();
                                hour = DObject.getHours();
                                minutes = DObject.getMinutes();

                                MaxDateObject = new Date(year, mon, day, hour, minutes);
                                menudetail.MaxDate = MaxDateObject;
                            }

                            if (menudetail.DataType == "month") {
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
                            else if (menudetail.DataType == "date" || menudetail.DataType == "datetime") {
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
                                let defaultValue = menudetail.DropDownValues.find((v: any) => v.Value == parseInt(menudetail.DefaultValue));
                                menudetail.DefaultValue = defaultValue;
                                pageFilter[menudetail.ParameterName] = defaultValue;
                            }
                            else if (menudetail.InputControl.toLowerCase() == "multidropdownlist") {
                                let defaultValue = menudetail.DropDownValues.find((v: any) => v.Value == Number(menudetail.DefaultValue));
                                menudetail.DefaultValue = defaultValue;
                                pageFilter[menudetail.ParameterName] = defaultValue;
                            }
                            else {
                                pageFilter[menudetail.ParameterName] = menudetail.DefaultValue;
                            }
                        });
                        this.GetPageWithoutModuleData(pageFilter);
                    }
                    else {
                        this.GetPageWithoutModuleData(filter1);
                    }
                }
                else {
                    let tempFilter = localStorage.setItem('navigationExtras', "");
                    this.GetPageWithoutModuleData(tempFilter);
                }

                this.appliedFilters = JSON.parse(localStorage.getItem("filterdata") ?? "{}");
                this.filterValues = [];
                this.PageMenuDetails.forEach((item: any) => {
                    if (Array.isArray(item['DefaultValue'])) {
                        item['DefaultValue'].forEach((elm: any) => {
                            this.filterValues.push(elm.Text);
                        });
                    }
                    else if (item.DefaultValue !== null && typeof item.DefaultValue == 'object' && item.DefaultValue.hasOwnProperty('Text')) {
                        this.filterValues.push(item.DefaultValue.Text);
                    }
                    else if (typeof item.DefaultValue == 'string' && item.DefaultValue !== '') {
                        let pattern = /(0[1-9]|10|11|12)\/[0-9]{4}/;
                        if (pattern.test(item.DefaultValue)) {
                            let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                            let monthInFilter = months[Number(item.DefaultValue.slice(-7, -5)) - 1];
                            this.filterValues.push(monthInFilter + " " + item.DefaultValue.slice(-4));
                        }
                        else {
                            this.filterValues.push(item.DefaultValue);
                        }
                    }
                });

            }
        })
        console.log("PageMenuDetails", this.PageMenuDetails);

    }


    GetPageWithoutModuleData(filter: any) {
        let filterData: any = {};
        filterData["Filter"] = filter;
        this.show = true;
        let appId: any = null;
        this.CurrentApp = JSON.parse(localStorage.getItem("currentApp")!);
        appId = this.CurrentApp.ID;
        console.log("Vikrant", appId, this.CurrentApp, filterData);

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


        this.getPage(appId, filterData);

    }


    getPage(appId: any, filterData: any) {
        try {
            let page: any;
            this.MainPageService.GetPageWithoutModuleData(this.Sys_Menu_ID, this.UserName, appId).subscribe({
                next: (response) => {
                    page = response;

                    console.log("UserName", this.UserName);
                    console.log("appID", appId)
                    console.log("Page structure", page);

                    // this.events.publish('breadcrumb', page["breadcrumb"]);//subscribed in MainPage

                    this.Module = [];
                    this.Module[0] = page;
                    //console.log(this.Module);

                    let moduleList = page["moduleList"];
                    let tableModuleList = moduleList.filter((m: any) => m.DisplayType == '' || m.DisplayType.toLowerCase() == "primeunfrozentable" || m.DisplayType.toLowerCase() == "crudtable" || m.DisplayType.toLowerCase() == 'primengpivottable' || m.DisplayType.toLowerCase() == 'dataview' || m.DisplayType.toLowerCase() == "formtablesubmodule" || m.DisplayType.toLowerCase() == "tablewithrowgrouping" || m.DisplayType.toLowerCase() == "treetable");
                    let tableModulesCount = moduleList.filter((m: any) => m.DisplayType == '' || m.DisplayType.toLowerCase() == "primeunfrozentable" || m.DisplayType.toLowerCase() == "crudtable" || m.DisplayType.toLowerCase() == 'primengpivottable' || m.DisplayType.toLowerCase() == 'dataview' || m.DisplayType.toLowerCase() == "formtablesubmodule" || m.DisplayType.toLowerCase() == "tablewithrowgrouping" || m.DisplayType.toLowerCase() == "treetable").length;
                    let modulesCount = moduleList.length;
                    console.log("moduleList", moduleList);



                    //disabled array
                    if (this.Module != undefined && this.Module[0].moduleList.length > 0) {
                        this.Module[0].moduleList.forEach((val: { TabModuleDependency: null; }, index: string | number) => {
                            this.moduleListData.push(val.TabModuleDependency);
                            this.activeLinkIndex[index as number] = 0;
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
                    //only used for steps it has model we need to define later
                    // this.steps = [];
                    // if (this.Module[0].steps != null) {

                    //     this.Module[0].steps.forEach(x => {

                    //         this.steps.push({
                    //             label: x['label'], command: (event: any) => {
                    //                 this.StepactiveIndex = x.ActiveIndex;
                    //             }
                    //         });
                    //     })
                    //     //console.log('StepData', this.steps)
                    // }

                    //set activeTab of linked menu
                    let queryparams = this.activateRouter.snapshot.queryParams;
                    console.log("queryparams", queryparams);

                    if (Object.keys(queryparams).length > 0) {

                        this.activateRouter.queryParams.subscribe((data: Params) => {
                            this.LinksModule = data['moduleName']
                            console.log('queryData', this.LinksModule);
                            let linkData = this.Module[0].moduleList.findIndex((val: any) => val.ModuleName == this.LinksModule);
                            this.activeLinkIndex[0] = linkData
                        })
                    }
                    console.log("module", this.Module);
                    let displaytype = this.Module[0].menu.DisplayType.toLowerCase();
                    console.log("Displatype: ", displaytype);

                    if (this.Module[0].menu.DisplayType.toLowerCase() != "dataview") {
                        moduleList.forEach((val: any) => {
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
                        })
                    }
                    else {
                        let dataviewModule = moduleList.find((m: any) => m.DisplayType.toLowerCase() == "dataview");

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
            });
        }
        catch (error) {
            console.log(error);

        }
    }


    getTableModule(val: any, moduleIndex: any, tableModuleList: any, filterData: any, appId: any) {
        //start loading
        this.show = true;

        let frozenCols: any[] = [];
        let scrollableCols: any[] = [];
        let childColumns = [];
        let displayedColumns = [];
        let filterCols: any[] = [];
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
            val.moduleDetails.forEach((column: any) => {
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
            this.populateModuleData(val, dtIndex, moduleIndex, filterData, appId);

            //end loading
            this.show = false;
        }
    }


    async populateModuleData(module: any, dtIndex: any, moduleIndex: any, filterData: any, appId: any) {
        const data = await this.MainPageService.populateModuleData(module.ID, this.Sys_Menu_ID, this.UserName, filterData, module.StoredProc, appId, module.NotificationParameterList.length).toPromise() as any;
        console.log("data", data);

        //debugger;
        module.moduleData = data["moduleData"];
        module.ModuleWiseTiles = data["moduleWiseTiles"];
        /*type cast date data*/
        var dateColumns: any[] = [];
        dateColumns = module.moduleDetails.filter((md: any) => md.DataType.includes("date") || md.DataType.includes("time"));
        module.moduleData.map((d: any) => {
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
            this.Module[0].moduleList[moduleIndex].ListOfCharts.forEach((x: any) => {
                if (x.Active) {
                    this.MainPageService.GetModuleChartTable(x.ChartId, data["moduleData"]).subscribe({
                        next: (response) => {
                            x.moduleData = response;
                        }
                    });
                }
            });
        }
        this.totalRecords[dtIndex] = module.moduleData.length;
        this.primeNgTableArray[dtIndex] = moduledata;
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
            console.log("primeNgTableArray", this.primeNgTableArray[dtIndex], "dtindex: ", dtIndex);

        }
        if (module.DisplayType.toLowerCase() == 'cardview') {
            this.CardViewModuleDetails = module.moduleDetails;
            let data = module.moduleData;
            let that = this;
            data.map(function (r: { [x: string]: any; }) {
                //To convert string or comma separated values to array for toggle buttons
                module.moduleDetails.forEach((md: any) => {
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
            console.log(this.cardViewData)
            console.log("Card View", module, this.CardViewModuleDetails)
        }
    }


    convertStringToArray(value: string) {
        return value.split(",");
    }


    transformArrayData(data: any, dtIndex: any) {
        const sourceKey = 'InputTables';

        const output = data.reduce((acc: any, obj: any) => {
            const existingEntry = acc.find((entry: any) => entry.InputTables === obj[sourceKey]);

            if (existingEntry) {
                const subTableObj: any = {};
                Object.keys(obj).forEach(key => {
                    if (key !== sourceKey) {
                        subTableObj[key] = obj[key];
                    }
                });
                existingEntry.SubTableArray.push(subTableObj);
            } else {
                const newEntry = {
                    InputTables: obj[sourceKey],
                    SubTableArray: [] as any[]
                };
                const subTableObj: any = {};
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


    mapContextMenuCommand(RowContextMenus: any, PrimaryKey: any) {
        let dt_count: number;
        if (RowContextMenus != null) {
            RowContextMenus.forEach((contextMenu: any) => {
                //console.log("contextMenu", contextMenu)
                var command = contextMenu.command;
                //console.log(this);
                contextMenu.command = (onclick: any) => {

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
                        this.cellContextMenu?.hide();
                        setTimeout(() => {
                            this.navigate(this.selectedCellValue, contextMenu.LinkMenuId, this.selectedCellHeader);
                            //this.navigate(this.selectedrow[PrimaryKey], contextMenu.LinkMenuId);
                        }, 500);

                    }
                }
            });

        }
    }


    navigate(i: any, LinkedMenu: any, FilterName?: string, rowIndex?: number) {
        if (rowIndex !== undefined && rowIndex > -1) { this.highlightcard = rowIndex; }
        let qm: any = {};
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
        this.routerEventSubscription = this.router.events.pipe(
            filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
        ).subscribe(() => {
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
        const resp = await this.MainPageService.Savedata(ID, form, this.UserName, appId, filter1).toPromise();

        // Using PrimeNG MessageService
        this.messageService.add({
            severity: 'success',  // or 'info', 'warn', 'error' based on response
            summary: 'Success',
            detail: resp["Message"],
            life: 8000
        });

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
                // this.createACSUserId(form.UserName);//assigns ACS userid to newly created user

                formObject.reset();
        }
    }
    

    navigateOnFormSubmit(LinkedMenu) {
        let filter = localStorage.getItem("navigationExtras");
        this.events.publish('navigationExtras', JSON.parse(filter));
        let navigationExtras: NavigationExtras = {
            queryParams: JSON.parse(filter)

        };
        this.router.navigateByUrl("/menu/first/tabs/" + LinkedMenu, navigationExtras);

    }

}