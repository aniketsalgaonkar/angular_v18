import { Component, OnInit, ViewChild, ViewChildren, AfterViewChecked, QueryList, ElementRef, HostListener, ViewEncapsulation } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { TieredMenu } from 'primeng/tieredmenu';

import { filter } from 'rxjs';
import { Events } from '../../services/events.service';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { NavigationExtras } from '@angular/router';
import { ActivatedRoute, Params, Router, NavigationEnd, RouterEvent, Event } from '@angular/router';
import { RuleEngine } from '../../components/ruleEngine';
import { saveAs } from 'file-saver';
import { Table } from 'primeng/table';
import { Form } from '../../displayTypes/form';
import { MainPageService } from '../../services/MainPage.service';


@Component({
  selector: 'app-menu1452',
  templateUrl: './menu1452.component.html',
  styleUrl: './menu1452.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class Menu1452Component implements OnInit {

  // commented by Karan on 18-05-21 @ViewChild('slides') slides: IonSlides; // added for wizard slides
  @ViewChildren('LatLong') latlong: QueryList<ElementRef> | undefined;
  @ViewChild('cellContextMenu', { static: false }) cellContextMenu: TieredMenu | undefined;
  @ViewChild('inputField')
  inputfield!: ElementRef;
  public loading: boolean = false;
  ModulesRuleData: any[] = [];
  rowGroupMetadata: any = {};
  filterColsArray: any[] = []; // to store filterCols for different table with dt_index(data table index)
  firstcount: number = 0;
  rowscount: number = 0;
  thisrow: any = {};  // used for cloning and keeping current selected row value from formtable/crudtable/pivottablewithdialog
  newrow: boolean;
  selectedProduct: any;
  selectedValues: any;   // current selected row of table is stored in this variable
  frozenColsArray: any[] = []; //to store  frozenCols with dt_index
  scrollableColsArray: any[] = []; // to store scrollabeCols with dt_index
  selectedColumnsArray: any[] = [];
  ModuleIDList: Array<any> = [];
  Sys_Menu_ID: number = 1452;
  CurrentApp: any;
  periodForNPDValue: any;
  DateFormat = 'DD/MM/YYYY';
  hourFormat = Date();
  PageMenuDetails: any;
  UserName: any;
  show: boolean = false;
  appliedFilters: any;
  filterValues: any[] = []; //filter values to show as chips
  Module: any;
  moduleListData: any[] = [];
  activeLinkIndex: any[] = []; //used to set current active tab of linked menu
  DisabledArray: any[] = [];
  moduleListDataLength: any;
  totalRecords: any[] = [];
  visitedPagesData: any[] = [];
  primeNgTableArray: any[] = [];
  moduleLoaderArray: any[] = [];
  temptableArray: any[] = [];
  ModuleDataWithRuleArray: any[] = [];
  displayDialogModule: any[] = [];
  steps: any[] = [];
  LinksModule: any;
  routerEventSubscription: any;
  activeTabIndex: number = 0;
  StepactiveIndex: number = 0;
  highlightcard: number | undefined; //to highlight dataview selected record
  value: any;

  hideColumnFilters: boolean = false; //  used to show/hide filters of table either it is global filter or columns filter
  Paginators: boolean = false;    // this variable was added to show/hide paginators in table but in new UI removed
  tableSecondaryOptions = [   // was trying to show table primary option icons in three dot icon for mobile but applied
    {
      label: 'Pagination',
      icon: 'pi pi-align-justify',
      command: () => {
        this.Paginators = !this.Paginators
      }
    },
  ];
  multichart_tileGroup: any[] = [];
  multichartdata: any[] = [];

  constructor(

    private mainpageservice: MainPageService,
    private menuService: MenuService,
    private events: Events,
    private router: Router,
    private activateRouter: ActivatedRoute,
    private messageService: MessageService,
    public ruleEngine: RuleEngine,
    public form: Form
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
    this.DateFormat = localStorage.getItem("DateFormat");
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

  // GetPageWithoutModuleData(filter: any) {

  //   let filterData: any = {};
  //   filterData["Filter"] = filter;
  //   this.show = true;
  //   let appId: any = null;
  //   this.CurrentApp = JSON.parse(localStorage.getItem("currentApp")!);
  //   appId = this.CurrentApp.ID;
  //   console.log("Vikrant", appId, this.CurrentApp, filterData);
  //   this.getPage(appId, filterData);

  // }

  //function to retrieve only the page structure
  //breadcrumb,filter details,module,module details
  //moduledata will not be retrieved
  GetPageWithoutModuleData(filter) {
    //alert("GetPageWithoutModuleData");
    let filterData = {};
    filterData["Filter"] = filter;
    this.show = true;

    // this.applyCSSRuleToRow = false;

    let appId: any = null;

    this.CurrentApp = JSON.parse(localStorage.getItem("CurrentApp"));
    if (this.CurrentApp != null || this.CurrentApp != undefined) appId = this.CurrentApp.ID;

    this.frozenColsArray = [];
    this.scrollableColsArray = [];
    this.selectedColumnsArray = [];
    this.filterColsArray = [];
    this.displayDialogModule = [];
    // this.frozenWidthArray = [];
    this.totalRecords = [];
    this.primeNgTableArray = [];
    this.visitedPagesData = [];
    this.moduleLoaderArray = [];
    this.ModuleDataWithRuleArray = [];
    this.temptableArray = [];

    this.getPage(appId, filterData);//returns page structure without data

  }

  // async getPage(appId: any, filterData: any) {
  //   try {
  //     let page: any;
  //     this.menuService.GetPageWithoutModuleData(this.Sys_Menu_ID, this.UserName, appId).subscribe({
  //       next: (response) => {
  //         page = response;

  //         console.log("UserName", this.UserName);
  //         console.log("appID", appId)
  //         console.log("Page structure", page);

  //         // this.events.publish('breadcrumb', page["breadcrumb"]);//subscribed in MainPage

  //         this.Module = [];
  //         this.Module[0] = page;
  //         //console.log(this.Module);
  //         let moduleList = page["moduleList"];
  //         let tableModuleList = moduleList.filter((m: any) => m.DisplayType == '' || m.DisplayType.toLowerCase() == "primeunfrozentable" || m.DisplayType.toLowerCase() == "crudtable" || m.DisplayType.toLowerCase() == 'primengpivottable' || m.DisplayType.toLowerCase() == 'dataview' || m.DisplayType.toLowerCase() == "formtablesubmodule" || m.DisplayType.toLowerCase() == "tablewithrowgrouping" || m.DisplayType.toLowerCase() == "treetable");
  //         let tableModulesCount = moduleList.filter((m: any) => m.DisplayType == '' || m.DisplayType.toLowerCase() == "primeunfrozentable" || m.DisplayType.toLowerCase() == "crudtable" || m.DisplayType.toLowerCase() == 'primengpivottable' || m.DisplayType.toLowerCase() == 'dataview' || m.DisplayType.toLowerCase() == "formtablesubmodule" || m.DisplayType.toLowerCase() == "tablewithrowgrouping" || m.DisplayType.toLowerCase() == "treetable").length;
  //         let modulesCount = moduleList.length;
  //         //disabled array
  //         if (this.Module != undefined && this.Module[0].moduleList.length > 0) {
  //           this.Module[0].moduleList.forEach((val: { TabModuleDependency: null; }, index: string | number) => {
  //             this.moduleListData.push(val.TabModuleDependency);
  //             this.activeLinkIndex[index as number] = 0;
  //             //console.log("moduleListData", this.moduleListData);
  //             this.moduleListDataLength = this.moduleListData.length;

  //             if (this.Module[0].moduleList.indexOf(val) == 0) {
  //               this.DisabledArray.push(false);
  //             }
  //             else if (val.TabModuleDependency != null) {
  //               this.DisabledArray.push(true);
  //             }
  //             //console.log("DisabledArray", this.DisabledArray)
  //           });
  //         }
  //         for (var i = 0; i < tableModulesCount; i++) {
  //           this.totalRecords[i] = [];
  //           this.visitedPagesData[i] = [];
  //           this.primeNgTableArray[i] = [];
  //           this.moduleLoaderArray[i] = [];
  //           this.temptableArray[i] = [];
  //           this.ModuleDataWithRuleArray[i] = [];
  //           this.displayDialogModule[i] = [];
  //         }
  //         for (var i = 0; i < modulesCount; i++) {
  //           this.moduleLoaderArray[i] = true;
  //         }

  //         let queryparams = this.activateRouter.snapshot.queryParams;
  //         if (Object.keys(queryparams).length > 0) {

  //           this.activateRouter.queryParams.subscribe((data: Params) => {
  //             this.LinksModule = data['moduleName']
  //             console.log('queryData', this.LinksModule);
  //             let linkData = this.Module[0].moduleList.findIndex((val: any) => val.ModuleName == this.LinksModule);
  //             this.activeLinkIndex[0] = linkData
  //           })
  //         }

  //         if (this.Module[0].menu.DisplayType.toLowerCase() != "dataview") {

  //           moduleList.forEach((val: any) => {
  //             let moduleIndex = moduleList.indexOf(val);
  //             if (val.DisplayType == 'Form' || val.DisplayType.toLowerCase() == "workflow") {//form display
  //               this.getFormData(val, moduleIndex, filterData, appId);

  //             }
  //             else if (val.DisplayType.toLowerCase() == "chart") {
  //               this.getMultiChart(val, moduleIndex, filterData, appId);
  //             }
  //             else if (val.DisplayType.toLowerCase() == "multichart") {
  //               //to create tile with rule engine
  //               this.getTilesWithRules(val, moduleIndex, filterData, appId);
  //             }
  //           })
  //         }

  //       }
  //     });
  //   }
  //   catch (error) {
  //     console.log(error);

  //   }
  // }

  async getPage(appId, filterData) {
    try {
      const page = await this.mainpageservice.GetPageWithoutModuleData(this.Sys_Menu_ID, this.UserName, appId).toPromise();
      //console.log("Page structure", page);
      this.events.publish('breadcrumb', page["breadcrumb"]);//subscribed in MainPage
      // this.metaData = page['planDatasetRunIdConfig']['ConfigItems'];


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
          // else if (val.DisplayType.toLowerCase() == "primengpivottable" || val.DisplayType.toLowerCase() == "pivottable") {

          //   this.getPivotTableModule(val, moduleIndex, tableModuleList, filterData, appId);

          // }
          else if (val.DisplayType == 'Form' || val.DisplayType.toLowerCase() == "workflow" || val.DisplayType.toLowerCase() == "formwithgrouping") {//form display
            this.getFormData(val, moduleIndex, filterData, appId);
          }

          // else if (val.DisplayType.toLowerCase() == "listviewsubmodule") {
          //   this.getListView(val, moduleIndex, filterData, appId);

          // }
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
            // this.GetTreeTable(val, moduleIndex, tableModuleList, filterData, appId);
          }
          else if (val.DisplayType.toLowerCase() == 'pivottablewithdialog' || val.DisplayType.toLowerCase() == 'pivottablereview') {
            //display type to show dialog with form/table on click of row of pivot table
            // this.getPivotTableWithDialog(val, moduleIndex, tableModuleList, filterData, appId);
            //console.log("ARRAYS", this.displayedSubmoduleColumns, this.SubmoduleDataSourceArray, this.frozenColsSubmoduleArray, this.frozenWidthSubModuleArray)
          }
          // else if (val.DisplayType == 'FormTableSubmodule') {
          //   this.getFormTableSubmodule(val, moduleIndex, tableModuleList, filterData, appId);
          // }
          // else if (val.DisplayType.toLowerCase() == "tree") {
          //   this.GetTree(val, moduleIndex, filterData, appId);
          // }
          // else if (val.DisplayType.toLowerCase() === "calendar") {
          //   this.calendarService.init(this.container, this.calendarComponent, this.messageService);
          //   this.show = false;
          //   val['MenuId'] = this.Sys_Menu_ID;
          //   val['AppId'] = appId
          //   val['UserName'] = this.UserName;
          //   this.calendarService.setModule(val);
          // }
          // else if (val.DisplayType.toLowerCase() == "processflow") {
          //   type ProcessFlowData = {
          //     Name: string;
          //     Status?: "Running" | "Completed" | "Error" | "Not Started";
          //     SubTasks?: Array<ProcessFlowData>;
          //     DurationInSeconds?: number;
          //   };
          //   this.processFlowInterval = setInterval(() => {
          //     this.mainpageservice
          //       .getProcessFlowData(this.UserName, val.StoredProc, appId)
          //       .toPromise()
          //       .then((data: ProcessFlowData[]) => {
          //         val.moduleData = data;
          //         val["maxItems"] = val.moduleData
          //           .reduce((acc: number, current: ProcessFlowData) => current?.SubTasks?.length > acc ? current.SubTasks.length : acc, 0);
          //       });
          //   }, 4000);
          // }
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
        // this.getTableModule(dataviewModule, moduleIndex, tableModuleList, filterData, appId);
        this.show = false;
        //if (dataviewModule) this.ruleEngine.executeRuleEngine(this.Sys_Menu_ID);
      }
    }
    catch (error) {
      //console.log(error);
    }
  }

  getFormData(val: any, moduleIndex: any, filterData: any, appID: any) {
    try {
      this.mainpageservice.populateModuleData(val.ID, this.Sys_Menu_ID, this.UserName, filterData, val.StoredProc, 2).subscribe({
        next: (response) => {
          const data = response as { moduleData: any }; // or a more specific type
          let moduleData = data["moduleData"];
          this.moduleLoaderArray[moduleIndex] = false;

          console.log("Form data", val.moduleData);
          val.moduleDetails.forEach((moduleDetail: any) => {
            this.assignValueToModuleDetail(moduleDetail, moduleData);
          });

          this.updateModuleDetailsInModuleList(val, moduleIndex, moduleData)
          console.log("Updated Form data", val.moduleDetails);
        }
      })
      this.show = false;

    }
    catch (error) {
      console.log(error);

    }
  }
  assignValueToModuleDetail(moduleDetail: any, moduleData: any) {
    let value = moduleData[0][moduleDetail.ColumnName];
    //debugger;
    if (moduleDetail.DataType === 'date' || moduleDetail.DataType === 'datetime') {
      moduleDetail.value = value ? new Date(value) : new Date();
    } else if (moduleDetail.InputControls.toLowerCase() === "dropdownlist") {
      moduleDetail.value = this.getDropdownValue(value, moduleDetail.DropDownValues);
    } else if (moduleDetail.InputControls.toLowerCase() === "multidropdownlist") {
      moduleDetail.Multiselectvalue = [];
      moduleDetail.Multiselectvalue.push(this.getMultiDropdownValue(value, moduleDetail.DropDownValues));
      console.log("multidropdown", moduleDetail.value)
    } else {
      moduleDetail.value = value;
    }
  }
  getDropdownValue(value: any, dropDownValues: any) {
    if (isNaN(value)) {
      return dropDownValues.find((v: any) => v.Text === value) || {};
    } else {
      return dropDownValues.find((v: any) => v.Value === value) || {};
    }
  }
  getMultiDropdownValue(value: any, dropDownValues: any) {
    if (value.includes(",")) {
      let listOfValues = value.split(",");
      return listOfValues.map((v: any) => this.getDropdownValue(v, dropDownValues));
    } else {
      return this.getDropdownValue(value, dropDownValues);
    }
  }
  updateModuleDetailsInModuleList(val: any, moduleIndex: any, moduleData: any) {
    this.Module[0].moduleList[moduleIndex].moduleDetails = val.moduleDetails;
    this.Module[0].moduleList[moduleIndex].moduleData = moduleData;
  }

  // To submit Form
  onSubmit(form: any, ID: any, LinkedMenu: any, moduleIndex: any): void {

    form = form.value;
    let appId: any = null;
    if (this.CurrentApp != null || this.CurrentApp != undefined) appId = this.CurrentApp.ID;
    let filter1 = localStorage.getItem('navigationExtras');

    // Added by Mayuri - to pass AppId as Filter
    let FilterData: any = {}; // Not type-safe
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
      var v = moduledetails.filter((md: any) => md.ColumnName == key);

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

  async saveForm(ID: any, moduleIndex: any, form: any, LinkedMenu: any, appId: any, filter1: any) {
    // Form Without FileUpload
    let formObject = form;

    try {
      // Explicitly define expected response type
      const resp = await this.menuService.Savedata(ID, form, this.UserName, appId, filter1)
        .toPromise() as { Message?: string };
      const message = resp?.Message ?? 'No message';
      this.messageService.add({
        severity: message === "Record saved successfully!!" ? 'success' : 'info',
        summary: 'Status',
        detail: message,
        life: 8000,
        closable: true
        // Removed position — invalid here
      });

      if (LinkedMenu != 0 && LinkedMenu != '' && LinkedMenu != null) {
        this.navigateOnFormSubmit(LinkedMenu);
      }

      this.show = false;

      if (message === "Record saved successfully!!") {
        this.activeTabIndex = (this.activeTabIndex === this.moduleListDataLength - 1) ? 0 : this.activeTabIndex + 1;

        if (this.Module != undefined) {
          if (moduleIndex + 1 < this.Module[0].moduleList.length) {
            let i = this.Module[0].moduleList[moduleIndex + 1].TabModuleDependency;
            this.DisabledArray[i + 1] = false;
            this.StepactiveIndex = this.StepactiveIndex + 1;
          }
        }

        this.getPageMenuDetails();

        const moduledetails = this.Module[0].moduleList[moduleIndex].moduleDetails;
        if (moduledetails.some((md: any) => md.InputControls?.toLowerCase() === 'fileupload')) {
          // this.uploadFile.uploadFile(); // upload file to azure blob storage
        }

        const module = this.Module[0].moduleList.find((m: any) => m.ID === ID);
        if (module?.ModuleName?.toLowerCase() === "create new user") {
          // this.createACSUserId(form.UserName); // assigns ACS userid to newly created user
        }

        formObject.reset();
      }
    } catch (error) {
      console.log(error);

    }
  }

  navigateOnFormSubmit(LinkedMenu: any) {
    let filter = localStorage.getItem("navigationExtras");
    this.events.publish('navigationExtras', JSON.parse(filter ?? '{}'));
    let navigationExtras: NavigationExtras = {
      queryParams: JSON.parse(filter ?? '{}')
    };
    this.router.navigateByUrl("/menu/first/tabs/" + LinkedMenu, navigationExtras);
  }

  async getMultiChart(val, moduleIndex, filterData, appId) {
    const data = await this.menuService.populateModuleData(val.ID, this.Sys_Menu_ID, this.UserName, filterData, val.StoredProc, 2).toPromise();
    val.moduleData = data["moduleData"];
    this.Module[0].moduleList[moduleIndex].moduleData = val.moduleData;
    this.moduleLoaderArray[moduleIndex] = false;
    //console.log("Multichart", moduleIndex, this.Module[0].moduleList[moduleIndex].moduleData);
  }
  getTilesWithRules(val, moduleIndex, filterData, appId) {
    if (val.NotificationParameterList.length > 0) {
      if (val.NotificationParameterList.length > 0) {
        this.menuService.populateModuleData(val.ID, this.Sys_Menu_ID, this.UserName, filterData, val.StoredProc, 2, val.NotificationParameterList.length).subscribe(data => {
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

  isNumber(value: any): boolean {  // check number or not for new input controls in progress bar inputcontrols
    if (value) {
      return !isNaN(value);
    }
    return false;
  }
  getTileGroupName(primaryKey, tileId, moduledata) {
    return moduledata.find(d => d[primaryKey] == tileId)["Group"];
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
        // if (column.ShowCellContextMenu) this.mapContextMenuCommand(column.ContextMenus, column.ColumnName);//cell wise context menu
      });

      this.frozenColsArray[dtIndex] = frozenCols;
      this.scrollableColsArray[dtIndex] = scrollableCols;
      this.selectedColumnsArray[dtIndex] = scrollableCols;
      this.filterColsArray[dtIndex] = filterCols;
      this.displayDialogModule[dtIndex] = false;

      console.log("frozenColsArray : ", this.frozenColsArray[dtIndex]);
      console.log("scrollableColsArray : ", this.scrollableColsArray[dtIndex]);

      // if (val.ShowRowContextMenu) this.mapContextMenuCommand(val.RowContextMenus, val.PrimaryKey);

      // if (val.GroupBy != "")//row highlight group by in pivot table
      //     this.updateRowGroupMetaData(val.moduleData, val.GroupBy, val.DefaultSortByColumn);


      let frozenWidth = frozenCols.length * 150 + 50 + "px";
      // this.frozenWidthArray.push(frozenWidth);
      this.populateModuleData(val, dtIndex, moduleIndex, filterData, appId);

      //end loading
      this.loading = false;
    }
  }

  async populateModuleData(module, dtIndex, moduleIndex, filterData, appId) {
    const data = await this.mainpageservice.populateModuleData(module.ID, this.Sys_Menu_ID, this.UserName, filterData, module.StoredProc, 2, module.NotificationParameterList.length).toPromise();
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
    // this.calculateMaxWidths(data["moduleData"], this.scrollableColsArray[dtIndex], dtIndex); //refactor if needed
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
      // this.transformArrayData(this.primeNgTableArray[dtIndex], dtIndex);
    }

    // if (module.DisplayType.toLowerCase() == 'dataview') {
    //   let filterByColumn: string;
    //   filterByColumn = module.FilterByColumn;
    //   this.Dataview.filterByValue = this.Dataview.GetFilterOptions(filterByColumn, this.primeNgTableArray[dtIndex]);

    //   this.table_list = this.primeNgTableArray[dtIndex].map(item => {
    //     if (item.ErrorCount != 0) {
    //       this.isFinalSubmit = true
    //       return;
    //     }
    //     item.SaveToStaging = false;
    //     const { TableName, ...rest } = item;
    //     return { ...rest, UploadToTable: TableName };
    //   });
    // }
    // if (module.DisplayType.toLowerCase() == 'cardview') {
    //   this.CardViewModuleDetails = module.moduleDetails;
    //   let data = module.moduleData;
    //   let that = this;
    //   data.map(function (r) {
    //     //To convert string or comma separated values to array for toggle buttons
    //     module.moduleDetails.forEach(md => {
    //       if (md.InputControls.toLowerCase() == "multidropdownlist") {
    //         let columnName = md.ColumnName;
    //         if (r[columnName] != undefined) {
    //           r[columnName] = that.convertStringToArray(r[columnName]);
    //         }

    //       }
    //     });
    //   })
    //   this.cardViewData = <any[]>module.moduleData;
    //   this.paginateData = [];
    //   if (module.Rows == 4) {
    //     for (let i = 0; i < module.moduleData.length; i++) {
    //       this.paginateData.push(module.moduleData[i]);
    //     }
    //   }
    //   this.paginateData = this.paginateData.slice(0, module.Rows);
    //   //console.log(this.cardViewData)
    //   //console.log("Card View", module, this.CardViewModuleDetails)
    // }
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
                // dataToFilter = this.filterService.columnFilter(dataToFilter, filter);
              }
              else if (filter.length == 1 && filter[0].value != null) {
                // dataToFilter = this.filterService.columnFilter(dataToFilter, filter);
              }

            });
            this.totalRecords[dtIndex] = dataToFilter.length;
            data = dataToFilter.slice(event.first, (event.first + event.rows));
          }
          else if (event.filters.hasOwnProperty("global")) {//for global filter
            let dataToFilter = this.Module[0].moduleList[moduleIndex].moduleData;
            // dataToFilter = this.filterService.globalFilter(this.filterColsArray[dtIndex], dataToFilter, event.filters.global.value)
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


}
