import { Component, OnInit, ViewChild, ViewChildren, AfterViewChecked, QueryList, ElementRef, HostListener } from '@angular/core';
import { MainPageService } from '../../services/MainPage.service';
import { NavigationExtras } from '@angular/router';
import { Router, NavigationEnd, RouterEvent } from '@angular/router';
import { filter, catchError } from 'rxjs/operators';
import { ActivatedRoute, Params } from '@angular/router';
import { Events } from '../../services/events.service';
import * as xlsx from 'xlsx';
import * as FileSaver from 'file-saver';
import { saveAs } from 'file-saver';
import { NgZone } from "@angular/core"; //added
import { trigger, state, transition, style, animate } from '@angular/animations';
import { CustomService } from '../../services/custom-service.service';
import { FileSystemNode } from '../../../assets/data/file-system-node';
import { Table } from 'primeng/table';
import { NavigationStart, Event as NavigationEvent } from "@angular/router";
import { Dataview } from '../../components/dataview';
import * as $ from 'jquery';
import { environment } from '../../../environments/environment'; // added for FileDownload
import { ConfirmationService, LazyLoadEvent, TreeNode, MessageService, MenuItem } from 'primeng/api';
import { Observable, throwError } from 'rxjs';
import { ComponentCanDeactivate } from '../../services/pending-changes.guard';
import { UserManager } from '../../components/ACS/UserManager';
import { AzureCommunication } from '../../services/AzureCommunication.service';
import { TieredMenu } from 'primeng/tieredmenu';
import { WorkFlow } from "../../components/workflow";
import { DatabaseService } from '../../services/database.service';
import { Topic } from '../../models/Topic';
import { Clipboard } from '@angular/cdk/clipboard';
import { RuleEngine } from '../../components/ruleEngine';
import { UploadFile } from '../../components/uploadFile';
import { ChartsService } from '../../services/charts.service';
interface FileObject {
  name: string,
  FileData: Blob
}
interface Sku {
  key: string,
  value: number
}
const apiUrl = environment.apiUrl;

@Component({
  selector: 'app-menu1453',
  templateUrl: './menu1453.component.html',
  styleUrls: ['./menu1453.component.scss'],
})
export class Menu1453Component implements OnInit, ComponentCanDeactivate, AfterViewChecked {
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
  Sys_Menu_ID: number = 1453;
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
  isProceedButtonDisabled: boolean = true;

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
  listviewFilteredData: any[] = []; // to store filtered data for pagination
  row = 3; // define default number of rows for paginator
  expandedRows: any[] = []; // created for dataset history
  datasetHistoryDataArray: any[] = [];
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
  DatasetHistory: boolean = false;
  dialogLabel: string = '';
  // End Of DYM Filter //

  //susan added start
  isPincodeValid: boolean = false;
  //isProceedButtonDisabled: boolean = true;
  //susan added end 

  //used for listview
  listViewDataComplete: any[] = []; //used to preserve complete list view data
  listViewTotalRecords: number = 0; //count of total number of records in listview data
  // expandedRows: any[] = []; // created for dataset history
  // datasetHistoryDataArray: any[] = [];

  constructor(private mainpageservice: MainPageService,
    private customService: CustomService,
    private router: Router,
    // private toastController: ToastController,//Added
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
    public uploadFile: UploadFile,
    //susan - added start 
    private chartsService: ChartsService,
    //susan - added end
  ) {
    this.Skus = [
      { key: "Months", value: 1 },
      { key: "Quarter", value: 2 },
      { key: "Year", value: 3 },
      { key: "Clear", value: 0 }
    ];
  }
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
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
    this.getPageMenuDetails();
    this.uploadFile.showValidationLoader = false;
    let menus = JSON.parse(localStorage.getItem("menus"));
    let current_menu = menus.find(m => m.ID == this.Sys_Menu_ID);
    this.events.publish('PageName', current_menu.MenuName);
    this.events.publish('CanActivateNavigation', current_menu.routerLink);
    this.events.publish('activeTopMenu', current_menu);
  }


  async getPageMenuDetails() {

    let app = localStorage.getItem("currentApp") as string;
    this.CurrentApp = JSON.parse(app);
    var appliedFilters = localStorage.getItem("filterdata") as string;
    var filterJson = JSON.parse(appliedFilters);


    let filter1 = localStorage.getItem('navigationExtras');
    this.mainpageservice.getPageMenuDetails(this.Sys_Menu_ID, this.UserName).subscribe({
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

  GetPageWithoutModuleData(filter) {
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

    this.getPage(appId, filterData);//returns page structure without data

  }

  //paginator method for listview
  // onListPageChange(event) {
  //   this.listviewFilteredData = [];
  //   const firstCard = event.first * 3;
  //   for (let i = firstCard; i < ((firstCard) + this.row * 3) && i < this.listviewdata.length; i++) {
  //     this.listviewFilteredData.push(this.listviewdata[i]);
  //   }
  // }
  async getPage(appId, filterData) {
    try {
      const page = await this.mainpageservice.GetPageWithoutModuleData(this.Sys_Menu_ID, this.UserName, appId).toPromise();
      this.events.publish('breadcrumb', page["breadcrumb"]);//subscribed in MainPage
      this.Module = [];
      this.Module[0] = page;
      let moduleList = page["moduleList"];
      let tableModuleList = moduleList.filter(m => m.DisplayType == '' || m.DisplayType.toLowerCase() == "primeunfrozentable" || m.DisplayType.toLowerCase() == "crudtable" || m.DisplayType.toLowerCase() == 'primengpivottable' || m.DisplayType.toLowerCase() == 'dataview' || m.DisplayType.toLowerCase() == "formtablesubmodule" || m.DisplayType.toLowerCase() == "tablewithrowgrouping" || m.DisplayType.toLowerCase() == "treetable");
      let tableModulesCount = moduleList.filter(m => m.DisplayType == '' || m.DisplayType.toLowerCase() == "primeunfrozentable" || m.DisplayType.toLowerCase() == "crudtable" || m.DisplayType.toLowerCase() == 'primengpivottable' || m.DisplayType.toLowerCase() == 'dataview' || m.DisplayType.toLowerCase() == "formtablesubmodule" || m.DisplayType.toLowerCase() == "tablewithrowgrouping" || m.DisplayType.toLowerCase() == "treetable").length;
      let modulesCount = moduleList.length;
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
          if (val.DisplayType.toLowerCase() == "listviewsubmodule") {
            this.getListView(val, moduleIndex, filterData, appId);
          }
        });
      }

    }
    catch (error) {
      console.log(error);
    }
  }

  // getListView(val, moduleIndex, filterData, appId) {
  //   this.mainpageservice.populateModuleData(val.ID, this.Sys_Menu_ID, this.UserName, filterData, val.StoredProc, appId).subscribe(data => {
  //     val.moduleData = data["moduleData"];
  //     this.listviewdata = val.moduleData;
  //     this.totalRecords[moduleIndex] = this.listviewdata.length / 3;
  //     for (let i = 0; i < this.row * 3 && i < this.listviewdata.length; i++) {
  //       this.listviewFilteredData.push(this.listviewdata[i]);
  //     }
  //     console.log("listViewData: = ", this.listviewdata);

  //   });
  // }

  getListView(val, moduleIndex, filterData, appId) {
    this.mainpageservice.populateModuleData(val.ID, this.Sys_Menu_ID, this.UserName, filterData, val.StoredProc, appId).subscribe(data => {
      val.moduleData = data["moduleData"];
      this.totalRecords[moduleIndex] = val.moduleData.length;
      this.listViewDataComplete = val.moduleData; //preservation of complete data
      this.listViewTotalRecords = this.listViewDataComplete.length; //maintaining the total number of records for paginator
      this.listviewdata = this.listViewDataComplete.slice(0, 9); //slicing the data to show 9 cards per page
      this.show = false;
    });
  }

  //paginator method for listview
  onListPageChange(event) {
    this.listviewdata = this.listViewDataComplete.slice(event.first, event.first + event.rows);
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
        var filename = "SAP_" + tableName + '.xlsx';
      }
      saveAs(blob, filename);

    })
    this.show = false;
  }

  setImportPanel(importPanel) {//To show file upload modulewise on Upload button click
    importPanel.hidden = !importPanel.hidden;
  }

  selectFile(id) {
    //to reset file upload control in listview display type
    this.fileUploadId = id

  }

  isNumber(value: any): boolean {  // check number or not for new input controls in progress bar inputcontrols
    if (value) {
      return !isNaN(value);
    }
    else {

      return false
    }
  }

  onSort(data, groupByColumnName, sortColumnName) {
    if (groupByColumnName == sortColumnName)
      this.updateRowGroupMetaDataSingle(data, groupByColumnName);
    else
      this.updateRowGroupMetaData(data, groupByColumnName, sortColumnName);
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


  async populateModuleData(module, dtIndex, moduleIndex, filterData, appId) {
    const data = await this.mainpageservice.populateModuleData(module.ID, this.Sys_Menu_ID, this.UserName, filterData, module.StoredProc, appId, module.NotificationParameterList.length).toPromise();
    //debugger;
    module.moduleData = data["moduleData"];

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


  }

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

}

