import { Component, OnInit, ViewChild, ViewChildren, AfterViewChecked, QueryList, ElementRef, HostListener } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { TieredMenu } from 'primeng/tieredmenu';

import { filter } from 'rxjs';
import { Events } from '../../services/events.service';
import { MessageService } from 'primeng/api';
import { NavigationExtras } from '@angular/router';
import { ActivatedRoute, Params, Router, NavigationEnd, RouterEvent, Event } from '@angular/router';
import { RuleEngine } from '../../components/ruleEngine';
import { saveAs } from 'file-saver';
import { Table } from 'primeng/table';
import { Form } from '../../displayTypes/form';


@Component({
  selector: 'app-menu4929',
  templateUrl: './menu4929.component.html',
  styleUrl: './menu4929.component.scss'
})
export class Menu4929Component implements OnInit {

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
  Sys_Menu_ID: number = 4929;
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


  constructor(

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
    this.getPage(appId, filterData);

  }

  async getPage(appId: any, filterData: any) {
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

          let queryparams = this.activateRouter.snapshot.queryParams;
          if (Object.keys(queryparams).length > 0) {

            this.activateRouter.queryParams.subscribe((data: Params) => {
              this.LinksModule = data['moduleName']
              console.log('queryData', this.LinksModule);
              let linkData = this.Module[0].moduleList.findIndex((val: any) => val.ModuleName == this.LinksModule);
              this.activeLinkIndex[0] = linkData
            })
          }

          if (this.Module[0].menu.DisplayType.toLowerCase() != "dataview") {

            moduleList.forEach((val: any) => {
              let moduleIndex = moduleList.indexOf(val);
              if (val.DisplayType == 'Form' || val.DisplayType.toLowerCase() == "workflow") {//form display
                this.form.getFormData(val, moduleIndex, filterData, appId);

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

  // getFormData(val: any, moduleIndex: any, filterData: any, appID: any) {
  //   try {
  //     this.menuService.populateModuleData(val.ID, this.Sys_Menu_ID, this.UserName, filterData, val.StoredProc, appID).subscribe({
  //       next: (response) => {
  //         const data = response as { moduleData: any }; // or a more specific type
  //         let moduleData = data["moduleData"];
  //         this.moduleLoaderArray[moduleIndex] = false;

  //         console.log("Form data", val.moduleData);
  //         val.moduleDetails.forEach((moduleDetail: any) => {
  //           this.assignValueToModuleDetail(moduleDetail, moduleData);
  //         });

  //         this.updateModuleDetailsInModuleList(val, moduleIndex, moduleData)
  //         console.log("Updated Form data", val.moduleDetails);
  //       }
  //     })
  //     this.show = false;

  //   }
  //   catch (error) {
  //     console.log(error);

  //   }
  // }

  // assignValueToModuleDetail(moduleDetail: any, moduleData: any) {
  //   let value = moduleData[0][moduleDetail.ColumnName];
  //   //debugger;
  //   if (moduleDetail.DataType === 'date' || moduleDetail.DataType === 'datetime') {
  //     moduleDetail.value = value ? new Date(value) : new Date();
  //   } else if (moduleDetail.InputControls.toLowerCase() === "dropdownlist") {
  //     moduleDetail.value = this.getDropdownValue(value, moduleDetail.DropDownValues);
  //   } else if (moduleDetail.InputControls.toLowerCase() === "multidropdownlist") {
  //     moduleDetail.Multiselectvalue = [];
  //     moduleDetail.Multiselectvalue.push(this.getMultiDropdownValue(value, moduleDetail.DropDownValues));
  //     console.log("multidropdown", moduleDetail.value)
  //   } else {
  //     moduleDetail.value = value;
  //   }
  // }



  // getDropdownValue(value: any, dropDownValues: any) {
  //   if (isNaN(value)) {
  //     return dropDownValues.find((v: any) => v.Text === value) || {};
  //   } else {
  //     return dropDownValues.find((v: any) => v.Value === value) || {};
  //   }
  // }



  // getMultiDropdownValue(value: any, dropDownValues: any) {
  //   if (value.includes(",")) {
  //     let listOfValues = value.split(",");
  //     return listOfValues.map((v: any) => this.getDropdownValue(v, dropDownValues));
  //   } else {
  //     return this.getDropdownValue(value, dropDownValues);
  //   }
  // }

  // updateModuleDetailsInModuleList(val: any, moduleIndex: any, moduleData: any) {
  //   this.Module[0].moduleList[moduleIndex].moduleDetails = val.moduleDetails;
  //   this.Module[0].moduleList[moduleIndex].moduleData = moduleData;
  // }

  //To submit Form
  // onSubmit(form: any, ID: any, LinkedMenu: any, moduleIndex: any): void {

  //   form = form.value;
  //   let appId: any = null;
  //   if (this.CurrentApp != null || this.CurrentApp != undefined) appId = this.CurrentApp.ID;
  //   let filter1 = localStorage.getItem('navigationExtras');

  //   // Added by Mayuri - to pass AppId as Filter
  //   let FilterData: any = {}; // Not type-safe
  //   try {
  //     if (filter1 != null && filter1.trim() !== '') {
  //       FilterData = JSON.parse(filter1);
  //     }
  //   } catch (error) {
  //     //console.error('Error parsing JSON:', error);
  //   }
  //   FilterData["AppId"] = this.CurrentApp.ID;
  //   filter1 = JSON.stringify(FilterData);


  //   var moduledetails = this.Module[0].moduleList[moduleIndex].moduleDetails;

  //   Object.keys(form).forEach(key => {
  //     var v = moduledetails.filter((md: any) => md.ColumnName == key);

  //     if (v.length > 0 && v != undefined) {
  //       if (v[0].DataType == "date") {
  //         if (form[key] != null) {
  //           let adate = new Date(form[key]);
  //           var ayear = adate.getFullYear();
  //           var amonth: any = adate.getMonth() + 1;
  //           var adt: any = adate.getDate();
  //           if (adt < 10) { adt = '0' + adt; }
  //           if (amonth < 10) { amonth = '0' + amonth; }
  //           form[key] = ayear + '-' + amonth + '-' + adt;
  //         }
  //       }
  //       else if (v[0].DataType == "month") {
  //         if (form[key] != null) {
  //           let adate = new Date(form[key]);
  //           var ayear = adate.getFullYear();
  //           var amonth: any = adate.getMonth() + 1;
  //           if (amonth < 10) { amonth = '0' + amonth; }
  //           form[key] = amonth + "/" + ayear;
  //         }
  //       }
  //       if (v[0].InputControls == "Checkbox") {
  //         if (form[key] == null || form[key] == "") {
  //           form[key] == false;
  //         }
  //       }
  //     }
  //   })
  //   this.routerEventSubscription = this.router.events.pipe(
  //     filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
  //   ).subscribe(() => {
  //     this.GetPageWithoutModuleData(filter1);
  //   });

  //   this.UserName = localStorage.getItem('username');
  //   this.show = true;

  //   Object.keys(form).map(function (key, index) {//with file upload
  //     if (Array.isArray(form[key]))// convert file object to file name string
  //     {
  //       if (form[key][0] instanceof File) {
  //         var fileNames = "";

  //         form[key].forEach(file => {
  //           fileNames = file["name"] + "," + fileNames;
  //         });
  //         form[key] = fileNames.substring(0, fileNames.length - 1);
  //       }
  //     }
  //   });

  //   this.saveForm(ID, moduleIndex, form, LinkedMenu, appId, filter1);

  // }

  // async saveForm(ID: any, moduleIndex: any, form: any, LinkedMenu: any, appId: any, filter1: any) {
  //   // Form Without FileUpload
  //   let formObject = form;

  //   try {
  //     // Explicitly define expected response type
  //     const resp = await this.menuService.Savedata(ID, form, this.UserName, appId, filter1)
  //       .toPromise() as { Message?: string };
  //     const message = resp?.Message ?? 'No message';
  //     this.messageService.add({
  //       severity: message === "Record saved successfully!!" ? 'success' : 'info',
  //       summary: 'Status',
  //       detail: message,
  //       life: 8000,
  //       closable: true
  //       // Removed position — invalid here
  //     });

  //     if (LinkedMenu != 0 && LinkedMenu != '' && LinkedMenu != null) {
  //       this.navigateOnFormSubmit(LinkedMenu);
  //     }

  //     this.show = false;

  //     if (message === "Record saved successfully!!") {
  //       this.activeTabIndex = (this.activeTabIndex === this.moduleListDataLength - 1) ? 0 : this.activeTabIndex + 1;

  //       if (this.Module != undefined) {
  //         if (moduleIndex + 1 < this.Module[0].moduleList.length) {
  //           let i = this.Module[0].moduleList[moduleIndex + 1].TabModuleDependency;
  //           this.DisabledArray[i + 1] = false;
  //           this.StepactiveIndex = this.StepactiveIndex + 1;
  //         }
  //       }

  //       this.getPageMenuDetails();

  //       const moduledetails = this.Module[0].moduleList[moduleIndex].moduleDetails;
  //       if (moduledetails.some((md: any) => md.InputControls?.toLowerCase() === 'fileupload')) {
  //         // this.uploadFile.uploadFile(); // upload file to azure blob storage
  //       }

  //       const module = this.Module[0].moduleList.find((m: any) => m.ID === ID);
  //       if (module?.ModuleName?.toLowerCase() === "create new user") {
  //         // this.createACSUserId(form.UserName); // assigns ACS userid to newly created user
  //       }

  //       formObject.reset();
  //     }
  //   } catch (error) {
  //     console.log(error);

  //   }
  // }

  // navigateOnFormSubmit(LinkedMenu: any) {
  //   let filter = localStorage.getItem("navigationExtras");
  //   this.events.publish('navigationExtras', JSON.parse(filter ?? '{}'));
  //   let navigationExtras: NavigationExtras = {
  //     queryParams: JSON.parse(filter ?? '{}')
  //   };
  //   this.router.navigateByUrl("/menu/first/tabs/" + LinkedMenu, navigationExtras);
  // }


}
