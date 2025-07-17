import { Component, OnInit, ViewChild, ViewChildren, AfterViewChecked, QueryList, ElementRef, HostListener } from '@angular/core';
import { ConfirmationService, LazyLoadEvent, TreeNode, MessageService, MenuItem } from 'primeng/api';
import { TieredMenu } from 'primeng/tieredmenu';
import { Table } from 'primeng/table';
import { environment } from '../../../environments/environment';
import { MenuService } from '../../services/menu.service';
import { Events } from '../../services/events.service';
import { NavigationExtras } from '@angular/router';
import { saveAs } from 'file-saver';
import { FileSystemNode } from '../../../assets/data/file-system-node';
import { ActivatedRoute, Params, Router, NavigationEnd, RouterEvent, Event } from '@angular/router';
import { RuleEngine } from '../../components/ruleEngine';
import { MainPageService } from '../../services/MainPage.service';
import { UploadFile } from '../../components/uploadFile';
import { CustomService } from '../../services/custom-service.service';
interface Sku {
  key: string,
  value: number
}



@Component({
  selector: 'app-menu1398',
  templateUrl: './menu1398.component.html',
  styleUrl: './menu1398.component.scss'
})
export class Menu1398Component {


  @ViewChild('dt') dt!: Table;
  //VARIABLES
  Role: any;

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
  Sys_Menu_ID: number = 1398;
  first: number = 0;
  // last: number = 0;
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
  //public minDate: any = new Date().toISOString();
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
  //displayedColumns: any[] = [];
  Feedback: any;
  childColumnArray: Array<any> = [];
  //childColumns: any[] = [];
  FileList: Array<File> = [];
  public show: boolean = false;
  public loading: boolean = false;
  // added for File Download : Sonal
  api_url: string = environment.apiUrl;

  //-accordions-----
  step = 0;
  showContainerEmail: boolean = false;    //for email with otp container
  //--
  //EmailwithOTP
  ValidatedEmail: boolean = false;
  VerifiedEmailId: any;

  //TreeTable
  // files: FileSystemNode[] = [];
  cols: any[] = [];
  colsdisplay: any[] = [];
  editableCols: any[] = [];
  totalRecords: number[] = [0]; // Initialize with 0
  DisabledArray: any[] = [];
  moduleListData: any[] = [];
  moduleListDataLength: any;
  //primengTableData: any[];    //to store table data with index used in primengtablearray[] with dt_count
  //scrollableCols: any;    //to store list of column or scrollable column name in scrollableColsArray[] which is to be shown in table with dt_count
  //frozenCols: any[];          //to store list of frozen columns name in frozenColsArray[] which is to be shown in table with dt_count
  scrollableColsArray: any[] = []; // to store scrollabeCols with dt_index

  globalFilterFields272: string[] = [];
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

  //used for pivottablereview
  UpdatedRows = [];
  RowID: number | undefined;
  dropDownArrayDialog: { AppId: null; Selected: boolean; Text: string; Value: number; }[] | undefined;

  //used for listview
  listviewFilteredData: any[] = []; // to store filtered data for pagination
  row = 3; // define default number of rows for paginator
  expandedRows: any[] = []; // created for dataset history
  datasetHistoryDataArray: any[] = [];

  // commented by Karan on 18-05-21 @ViewChild('slides') slides: IonSlides; // added for wizard slides
  @ViewChildren('LatLong') latlong: QueryList<ElementRef> | undefined;
  @ViewChild('cellContextMenu', { static: false }) cellContextMenu: TieredMenu | undefined;
  @ViewChild('inputField')
  inputfield!: ElementRef;
  AllColumns: any


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

  // Added For DYM Filter //
  rangeDatesArray = [];
  rangeDates: Date[] = [];
  FilterData: any[] = [];
  firstcount: number = 0;
  rowscount: number = 0;
  DmyData: any = [];
  Skus: Sku[] = [];
  selectedSku: number[] = [];
  gropuedSku: unknown[] = [];
  // End Of DYM Filter //

  // Added for Fullcalendar //
  // @ViewChild("calendar") calendarComponent: FullCalendarComponent = null;
  @ViewChild("container") container: ElementRef<HTMLDivElement> | undefined;

  //susan added start
  isPincodeValid: boolean = false;
  //susan added end 
  showDataviewImagePreview: boolean | undefined;
  dataviewImagePreviewSource: any;
  dataviewImagePreviewCaption: any;
  cellContextMenus: MenuItem[] | undefined;
  selectedRows: any;

  treeVal: any;
  treeIndex: any;
  treeModuleList: any;
  treeFilter: any;
  treeAppID: any;
  files: FileSystemNode[] = [];
  ValidateFinalSubmit: boolean = false;
  FileUpload: any;
  EstimatedOrder: boolean = false;



  constructor(
    public customService: CustomService,
    private menuService: MenuService,
    private events: Events,
    private router: Router,
    private activateRouter: ActivatedRoute,
    private messageService: MessageService,
    public ruleEngine: RuleEngine,
    public mainpageservice: MainPageService,
    private uploadFile: UploadFile,
  ) {
    this.UserName = localStorage.getItem('username');
    this.show = true;
  }

  ngOnInit() {
    this.getPageMenuDetails()
    // .then(
    //   () => this.getModuleDetailIdToHide(),
    //   () => this.getModulesToShow(),
    // );

    // this.uploadFile.showValidationLoader = false;
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
    this.menuService.getPageMenuDetails(this.Sys_Menu_ID, this.UserName).subscribe({
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
      this.menuService.GetPageWithoutModuleData(this.Sys_Menu_ID, this.UserName, appId).subscribe({
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
            this.totalRecords[i] = 0;
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
          if (Object.keys(queryparams).length > 0) {

            this.activateRouter.queryParams.subscribe((data: Params) => {
              this.LinksModule = data['moduleName']
              console.log('queryData', this.LinksModule);
              let linkData = this.Module[0].moduleList.findIndex((val: any) => val.ModuleName == this.LinksModule);
              this.activeLinkIndex[0] = linkData
            })
          }

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
                  // this.getTableModule(val, moduleIndex, tableModuleList, filterData, appId);
                }
              }
              else if (val.DisplayType.toLowerCase() == "treetable") {
                this.GetTreeTable(val, moduleIndex, tableModuleList, filterData, appId);
              }
              else if (val.DisplayType.toLowerCase() == "chart") {
                this.getMultiChart(val, moduleIndex, filterData, appId);
              }
              else if (val.DisplayType.toLowerCase() == "multichart") {
                //to create tile with rule engine
                this.getTilesWithRules(val, moduleIndex, filterData, appId);
              }
            })
          }

        }
      });
    }
    catch (error) {
      console.log(error);

    }
  }

  async GetTreeTable(val, moduleIndex, tableModuleList, filterData, appId) {
    this.treeVal = val;
    this.treeIndex = moduleIndex,
      this.treeModuleList = tableModuleList,
      this.treeFilter = filterData;
    this.treeAppID = appId;
    const data = await this.mainpageservice.getTreeTableData(val.ID, this.Sys_Menu_ID, this.UserName, filterData, val.StoredProc, appId).toPromise();
    let frozenCols = [];
    let scrollableCols = [];
    let filterCols = [];

    let dtIndex = tableModuleList.indexOf(val);

    this.frozenColsArray[dtIndex] = [];
    this.scrollableColsArray[dtIndex] = [];
    this.selectedColumnsArray[dtIndex] = [];
    this.filterColsArray[dtIndex] = [];
    this.primeNgTableArray[dtIndex] = [];
    console.log("tree response", data);
    val.moduleDetails = data["moduleDetails"];
    console.log("ModuleDetails", val.moduleDetails)
    var frozenCount = 0; //For making columns scrollable after 3 columns
    if (val.moduleDetails != null && typeof (val.moduleDetails) != undefined) {
      val.moduleDetails.forEach((column) => {
        ///frozen and scrollable columns primeng
        if (column.InputControls != "HiddenField") {

          if (column.FrozenCols == true && frozenCount < 8) { // Added frozenCount < 4 condition for scrollable  DJ
            frozenCols.push(column);
            frozenCount++; // Added this line
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


    let treedata: any = data["data"];

    let file: FileSystemNode[] = [];

    for (let i = 0; i < (<any>treedata).length; i++) {
      //angular logic to make tree structure is written in //assets/data/FilSystemNode.ts
      let rootObj = (<any>treedata)[i];
      let node = new FileSystemNode(rootObj, null, val.moduleDetails);
      file.push(node);
    }
    this.files = file;
    let frozenWidth = frozenCols.length * 100 + 50 + "px";

    this.scrollableColsArray[dtIndex] = scrollableCols;
    this.frozenColsArray[dtIndex] = frozenCols;
    this.primeNgTableArray[dtIndex] = this.files;
    this.filterColsArray[dtIndex] = filterCols;
    this.frozenWidthArray[dtIndex] = frozenWidth;
    this.selectedColumnsArray[dtIndex] = scrollableCols;
    this.moduleLoaderArray[moduleIndex] = false;
    console.log(this.primeNgTableArray, this.scrollableColsArray, this.frozenColsArray, this.selectedColumnsArray, this.frozenWidthArray)
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

  setImportPanel(importPanel) {//To show file upload modulewise on Upload button click
    importPanel.hidden = !importPanel.hidden;
  }

  async onUploadHandler(event: any, Module: any, tableName: any): Promise<void> {
    try {
      const updatePlanDataset = false;

      const result = await this.uploadFile.handleFileInput(event.files, 'FileUpload', tableName, updatePlanDataset);

      let filterData = localStorage.getItem('navigationExtras');
      let appId: any = null;
      if (this.CurrentApp != null || this.CurrentApp !== undefined) {
        appId = this.CurrentApp.ID;
      }

      //console.log('Calling getPage after file upload/append');
      // this.getPage(appId, filterData);
      this.GetTreeTable(this.treeVal, this.treeIndex, this.treeModuleList, this.treeFilter, this.treeAppID);

    } catch (error) {
      console.error('Error in uploadHandler: ', error);
    }
  }

  SubmitTreeTable(ID: any) {
    this.show = true;
    var filter1 = localStorage.getItem('navigationExtras');
    let appId: any = null;
    if (this.CurrentApp != null || this.CurrentApp != undefined) appId = this.CurrentApp.ID;
    var updateData = this.files.filter(element => element.data.Updated == true)
    //console.log(updateData);
    var dataObject = JSON.stringify(updateData, this.uploadFile.replacer);
    let treetableModuleIndex: number;
    var treetableModule = this.Module[0].moduleList.find(m => m.DisplayType.toLowerCase() == "treetable");
    treetableModuleIndex = this.Module[0].moduleList.indexOf(treetableModule);
    var save = this.checkRemarkUpdated(updateData, true);//to check if remark is added for validation


    if (save != false) {
      this.mainpageservice.SaveTreetable(ID, dataObject, this.UserName, treetableModuleIndex, appId).subscribe(resp => {
        // Show message using MessageService
        this.messageService.add({
          severity: resp["Message"] == "Record saved successfully!!" ? 'success' : 'info',
          summary: 'Status',
          detail: resp["Message"],
          life: 8000
        });

        if (resp["Message"] == "Record saved successfully!!") {
          this.show = false;
        }

        updateData.forEach((node) => {
          node.data.Updated = false;
        });
      });
    } else {
      this.primeNgTableArray[0] = updateData;

      // Show error message using MessageService
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Record not saved. Please update the remark.',
        life: 3000
      });

      this.show = false;
    }

  }

  checkRemarkUpdated(nodes, isSaveEnable) {

    nodes.forEach(node => {
      if (node.data.children.length > 0) {
        if (node.data.NeedRemark == true) {
          // let saverole = this.UserName.split('_')[0];
          let treerole = localStorage.getItem('Profile_Type');
          let trimmedRole = treerole.split('-')[0].trim();
          if (trimmedRole === 'Sales Officer') {
            if (node.data.SO_Remark === "") {
              isSaveEnable = false;
            }
          } else if (trimmedRole === 'Zonal Officer') {
            if (node.data.ZH_Remark === "") {
              isSaveEnable = false;
            }
          } else if (treerole == "Head Officer") {
            if (node.data.HO_Remark == "") {
              isSaveEnable = false;
            }

          } else if (treerole == "Head Officer Level 1") {
            if (node.data.HO_1_Remark == "") {
              isSaveEnable = false;
            }

          } else if (treerole == "Head Officer Level 2") {
            if (node.data.HO_2_Remark == "") {
              isSaveEnable = false;
            }

          }

        }

        isSaveEnable = this.checkRemarkUpdated(node.data.children, isSaveEnable);
      }
      else {
        if (node.data.NeedRemark == true) {
          let treerole = localStorage.getItem('Profile_Type');
          let trimmedRole = treerole.split('-')[0].trim();
          if (trimmedRole === 'Sales Officer') {
            if (node.data.SO_Remark === "") {
              isSaveEnable = false;
            }
          } else if (trimmedRole === 'Zonal Officer') {
            if (node.data.ZH_Remark === "") {
              isSaveEnable = false;
            }
          } else if (treerole == "Head Officer") {
            if (node.data.HO_Remark == "") {
              isSaveEnable = false;
            }

          } else if (treerole == "Head Officer Level 1") {
            if (node.data.HO_1_Remark == "") {
              isSaveEnable = false;
            }

          } else if (treerole == "Head Officer Level 2") {
            if (node.data.HO_2_Remark == "") {
              isSaveEnable = false;
            }

          }

        }
      }
    });
    return isSaveEnable;
  }

  downloadModuleReport(moduleId: any, moduleName: any) {
    //debugger;
    this.show = true;

    let filters: any;
    let data: any = {};
    this.UserName = localStorage.getItem('username');
    let filter = localStorage.getItem('navigationExtras');
    var param: any = {};
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

    this.menuService.exporttoexcelModulewise(moduleId, this.UserName, JSON.stringify(data), this.CurrentApp.ID).subscribe(resp => {
      ////console.log(resp);

      //  application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
      var blob = new Blob([resp], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      var filename = moduleName + '.xlsx';
      saveAs(blob, filename);
    })
    this.show = false;
  }

  treetable(filter, scrollableCols) {
    let treeNodes: Array<FileSystemNode> = [];
    treeNodes = filter.serializedValue;
    var filteredNodes = treeNodes.filter(x => x.parent != null)

    filteredNodes.forEach(treenode => {

      let node = new FileSystemNode(null, null, scrollableCols, treenode);

    });
  }
  resizeColumn(event, index: number) {
    let width: number;
    width = parseInt(this.frozenWidthArray[index].substring(0, this.frozenWidthArray[index].indexOf("px")));
    width = width + event.delta;
    this.frozenWidthArray[index] = width + "px";
  }
  isDisabled(rowNode: any): boolean {//added by prajakta for disabling certain levels for some users

    const childrenLength = rowNode.node.data.children.length;
    this.Role = localStorage.getItem('Profile_Type');
    const rolesThatEnable = ['Head Officer', 'Admin', 'Head Officer Level 1', 'Head Officer Level 2'];
    if (rolesThatEnable.includes(this.Role)) {
      return childrenLength < 0; // Disabled if children length is less than 0
    } else {
      return childrenLength > 0; // Disabled if children length is greater than 0
    }
  }
  columnMap = {
    Min_Est_M1: {
      compareWith: "MOU_M1"
    },
    Max_Est_M1: {
      compareWith: "MOU_M1",
    },
    Est_M2: {
      compareWith: "MOU_M2",
    },
    Est_M3: {
      compareWith: "MOU_M3"
    }
  }
  getNodeColour(row, column) {//added by prajakta for giving cell color based upon certain conditions 
    //debugger;
    var cellColor = { 'color': 'black' };
    if (!Object.keys(this.columnMap).includes(column)) return cellColor;
    let { compareWith } = this.columnMap[column]

    let upperLimit = row[compareWith] * 1.1;//MOU_M1*1.1
    let lowerLimit = row[compareWith] * 0.9;//MOU_M1*0.9
    if (row[column] > upperLimit || row[column] < lowerLimit) {
      cellColor.color = "red";
      // row.NeedRemark=true;
    }
    return cellColor;
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
}
