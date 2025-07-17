import { Component, OnInit, ViewChild, ViewChildren, AfterViewChecked, QueryList, ElementRef, HostListener } from '@angular/core';
import { ConfirmationService, LazyLoadEvent, TreeNode, MessageService, MenuItem } from 'primeng/api';
import { TieredMenu } from 'primeng/tieredmenu';
import { Table } from 'primeng/table';
import { environment } from '../../../environments/environment';
import { MenuService } from '../../services/menu.service';
import { Events } from '../../services/events.service';
import { NavigationExtras } from '@angular/router';
import { saveAs } from 'file-saver';
import { ActivatedRoute, Params, Router, NavigationEnd, RouterEvent, Event } from '@angular/router';
import { RuleEngine } from '../../components/ruleEngine';
import { MainPageService } from '../../services/MainPage.service';
interface Sku {
  key: string,
  value: number
}




@Component({
  selector: 'app-menu2532',
  templateUrl: './menu2532.component.html',
  styleUrl: './menu2532.component.scss'
})
export class Menu2532Component {
  
  @ViewChild('dt') dt!: Table;
  //VARIABLES

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
  Sys_Menu_ID: number = 2532;
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


  constructor(
    private menuService: MenuService,
    private events: Events,
    private router: Router,
    private activateRouter: ActivatedRoute,
    private messageService: MessageService,
    public ruleEngine: RuleEngine,
    public mainpageservice: MainPageService
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
              else if (val.DisplayType.toLowerCase() == "primengpivottable" || val.DisplayType.toLowerCase() == "pivottable") {
                this.getPivotTableModule(val, moduleIndex, tableModuleList, filterData, appId);
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
        // this.selectedColumnsArray[dtIndex] = scrollableCols;
        this.selectedColumnsArray[dtIndex] = filterCols;
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

  showInFilter(ParameterName) {//to show/hide filter fields userwise(userwise menu detail mapping)
    if (this.PageMenuDetails != undefined && this.PageMenuDetails != null)
      return this.PageMenuDetails.filter(menudetail => menudetail.ParameterName == ParameterName)[0].ShowInFilter;
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

  resizeColumn(event, index: number) {
    let width: number;
    width = parseInt(this.frozenWidthArray[index].substring(0, this.frozenWidthArray[index].indexOf("px")));
    width = width + event.delta;
    this.frozenWidthArray[index] = width + "px";
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


  loadTableData(event: any, dtIndex, moduleIndex) {
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
        if (Object.keys(event.filters).length > 0)//when column filters applied
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
                dataToFilter = this.columnFilter(dataToFilter, filter);
              }
              else if (filter.length == 1 && filter[0].value != null) {
                dataToFilter = this.columnFilter(dataToFilter, filter);
              }

            });
            this.totalRecords[dtIndex] = dataToFilter.length;
            data = dataToFilter.slice(event.first, (event.first + event.rows));
          }
          else if (event.filters.hasOwnProperty("global")) {//for global filter
            let dataToFilter = this.Module[0].moduleList[moduleIndex].moduleData;
            dataToFilter = this.globalFilter(this.filterColsArray[dtIndex], dataToFilter, event.filters['global'].value)
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

  getMergedArray(arr1, arr2, PrimaryKey) {

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

  columnFilter(data: any, filterObject: any)//column filter for lazy loading
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
    function filternotContainsColumnwiseData(data: any) { //callback function
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
    function filterEqualsColumnWiseData(data: any) {
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
    function filternotEqualsColumnwiseData(data: any) { //callback function
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
    function filterStartWithColumnwiseData(data: any) { //callback function
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
    function filterEndsWithColumnwiseData(data: any) {
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
    function filterLessThanColumWiseData(data: any) {
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
      return false;
    }
    function filterGreaterThanColumWiseData(data: any) {
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
      return false;
    }
    function filterDateisColumWiseData(data: any) {
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

      let format1 = ''
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
        format1 = dateOfMonth1 + "/" + month1 + "/" + getFullYear1;
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
      return false;
    }
    function filterColumnwiseData(data: any) { //callback function
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

  clear(table: Table) {
    table.clear();
    this.inputfield.nativeElement.value = '';
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

  getCellClassObject(col: any): any {
  return {
    'Text': col.DataType === 'Text',
    'int': col.DataType === 'int',
    'decimal': col.DataType === 'decimal',
    'real': col.DataType === 'real',
    'date': col.DataType === 'date',
    'datetime': col.DataType === 'datetime',
    'string': col.DataType === 'string',
    'Checkbox': col.InputControls === 'Checkbox',
    'Link': col.InputControls === 'Link',
    'DropDownList': col.InputControls === 'DropDownList',
    'Label': col.InputControls === 'Label',
    'align-left': (col.InputControls === 'TextBox' && col.DataType === 'string'),
    'EmailButton': col.InputControls === 'EmailButton',
    'ReportButton': col.InputControls === 'ReportButton',
    'StatusIcon': col.InputControls === 'StatusIcon',
    'updownicon': col.InputControls === 'updownicon',
    'id': col.InputControls === 'id',
    'highlight': col.Highlight === 'true'
  };
}

  



}
