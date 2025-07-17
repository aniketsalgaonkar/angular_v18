import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Events } from '../services/events.service';
import { BreadcrumbItemClickEvent } from 'primeng/breadcrumb';
import { MenuService } from '../services/menu.service';
import { SidebarStateService } from '../services/sidebar-state.service';
import { MenuComponent } from './menu/menu.component';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrl: './mainpage.component.scss'
})
export class MainpageComponent implements OnInit {
  menuList: any[] = [];
  isExpanded = false;
  public showMenuFlow: boolean = false;
  items = [];
  MenuData: any;
  public CurrentActiveMenuIndex: any;
  public CurrentActiveMenuParentIndex: any;
  submenuindex: any;
  showSubMenu: boolean = false;

  home = { icon: 'pi pi-home' };
  recent: any;
  frequent: any;
  showTopMenu: boolean = false;
  showTopMenusWithFlow: boolean = false;
  index: any;

  currentMenuPath: any;
  OpenMenu: boolean = false;
  UserName: string;
  routerEventSubscription: any;
  ID: number;
  SubMenu: any;
  ParentID: any;
  recentMenus = [];
  frequentlyUsedMenus = [];
  recentlyUsedMenus = [];
  highlightParent: any;
  tempMenuData: any[] = [];
  timelineData: any[] = [];
  allMenus: any[];
  breadcrumbsitems: any[];
  activeTopMenuItem: any = {};


  ngOnInit() {
    // this.getAppMenus();
  }

  constructor(private router: Router,
    private activateRouter: ActivatedRoute,
    private activatedroute: ActivatedRoute,
    private menuService: MenuService,
    private events: Events,
    private sidebarState: SidebarStateService,
    private cdr: ChangeDetectorRef
  ) {

    this.getAppMenus();
    console.log('beforactive', activatedroute.routeConfig);
    this.events.publish('PageName', '');
    let CurrentSelectedMenu = localStorage.getItem('PageName')
    if (CurrentSelectedMenu) {
      this.events.publish('PageName', CurrentSelectedMenu);
    }

    events.subscribe('CurrentActiveMenuParentIndex', (indexofmenu) => {
      if (indexofmenu == null) {
        this.CurrentActiveMenuParentIndex = indexofmenu;
      }
    });

    events.subscribe('breadcrumb', (breadcrumb) => {//published in menupage component
      this.items = breadcrumb;
    });

    events.subscribe('timelineData', (timelineData) => {//get timelinedata on every menupage-> publish in menupage components
      this.timelineData = timelineData;
      localStorage.setItem('timelineData', timelineData);
    });

    events.subscribe("showTopMenu", show => {//published in header.page.ts
      this.showTopMenu = show;
      console.log("showTopMenu", this.showTopMenu);

    })

    events.subscribe("activeTopMenu", item => {//published in activeTopMenu()
      this.activeTopMenuItem = item;
    })

    this.recentMenus = JSON.parse(localStorage.getItem('menus')) || [];

    if (this.recentMenus && Array.isArray(this.recentMenus)) {
      this.recentMenus.map(m => {
        if (!m.HasTopMenus && !m.items) {
          m.routerLink = '/menu/first/tabs/' + m.ID;
        }
      });
    }

    if (this.recentMenus) {
      this.frequentlyUsedMenus = this.recentMenus.sort(function (a, b) {
        return a.Frequency > b.Frequency ? -1 : (a.Frequency < b.Frequency) ? 1 : 0
      });
      this.frequentlyUsedMenus = this.frequentlyUsedMenus.slice(0, 5);
      this.recentlyUsedMenus = this.recentMenus.sort(function (a, b) {
        let date1 = new Date(a.LastVisitedOn);
        let date2 = new Date(b.LastVisitedOn);
        return date1 > date2 ? -1 : (date1 < date2) ? 1 : 0;
      });
      this.recentlyUsedMenus = this.recentlyUsedMenus.slice(0, 5);
    }


    events.subscribe('CanActivateNavigation', (menu) => {
      this.CurrentActiveMenuIndex = menu;
      if (this.CurrentActiveMenuIndex) {
        this.MenuData = JSON.parse(localStorage.getItem('StoreddSideMenu'));
        if (this.MenuData) {
          this.MenuData.forEach(element => {
            this.nestedFilter(this.CurrentActiveMenuIndex, element, element, element);
          });
        }
      }
    });


    this.CurrentActiveMenuIndex = location.pathname;
    if (this.CurrentActiveMenuIndex) {
      this.MenuData = JSON.parse(localStorage.getItem('StoreddSideMenu'));
      if (this.MenuData) {
        this.MenuData.forEach(element => {
          this.nestedFilter(this.CurrentActiveMenuIndex, element, element, element);
        });
      }
    }

    this.sidebarState.isExpanded$.subscribe(expanded => {
      this.isExpanded = expanded;
    })
  }
  itemClicked($event: BreadcrumbItemClickEvent) {
    throw new Error('Method not implemented.');
  }

  getAppMenus() {
    const currentApp = JSON.parse(localStorage.getItem("currentApp") || '{}');
    const username = localStorage.getItem('username');

    if (currentApp && currentApp.ID && username) {
      this.menuService.getAppMenus(username, currentApp.ID).subscribe({
        next: (response: any) => {
          const resultArray = Object.keys(response).map(key => response[key]);
          localStorage.setItem('StoreddSideMenu', JSON.stringify(resultArray));

          // Filter out menus without items or TopMenus
          this.menuList = resultArray.filter(menu => menu.items || menu.TopMenus);
          console.log('Menu List:', this.menuList);
        },
        error: (error: any) => {
          console.error('Error fetching menus:', error);
        }
      });
    } else {
      console.error('Missing required data: currentApp or username');
    }
  }

  toggleSidebar() {
    this.sidebarState.toggle();
  }

  nestedFilter(search, element, parentElement, top) {
    if (element.routerLink == search) {
      this.updateSubMenuOnReload(parentElement, top);
      if (!element.TopMenus && !element.items) {
        this.updateFrequentAndRecentMenus(element);
      }
    }
    else {
      if (element.items != null) {
        element.items.forEach(element => {
          this.nestedFilter(search, element, parentElement, element);
        });
      }
      else {
        if (element.TopMenus != null) {
          element.TopMenus.forEach(elements => {
            this.nestedFilter(search, elements, parentElement, element);
          });
        }
        else {
          return false;
        }
      }
    }
    return true;

  }


  updateSubMenuOnReload(menu, top) {
    console.log(this.MenuData);
    console.log('vari1', menu, 'vari2', top);
    if (menu != null) {
      this.events.publish('PageName', menu.MenuName);
      localStorage.setItem('PageName', menu.MenuName);

      localStorage.setItem('CurrentActiveMenuParentIndex', menu.ID);
      this.CurrentActiveMenuParentIndex = localStorage.getItem('CurrentActiveMenuParentIndex');
      if (top && top.TopMenus != null) {
        localStorage.setItem('CurrentActiveMenuIndex', top.routerLink);
        this.CurrentActiveMenuIndex = localStorage.getItem('CurrentActiveMenuIndex');
        this.getTopMenus(top.TopMenus);
        this.showTopMenu = true;
        console.log("showTopMenu", this.showTopMenu);

        if (top.ShowFlow) this.showTopMenusWithFlow = true;
        console.log("showTopMenusWithFlow :", this.showTopMenusWithFlow);
        setTimeout(() => this.cdr.detectChanges());
      }
      else {
        this.showTopMenu = false;//if doesn't have topmenus
        console.log("showTopMenu :", this.showTopMenu);
        setTimeout(() => this.cdr.detectChanges());
      }
      if (!menu.TopMenus && !menu.items) {
        this.updateFrequentAndRecentMenus(menu);
      }
    }
  }

  updateFrequentAndRecentMenus(menu) {
    let menuClicked = this.recentMenus.find(m => m.ID == menu.ID);
    console.log('recentmenus', this.recentMenus);
    if (menuClicked != undefined) {
      menuClicked.Frequency = menuClicked.Frequency + 1;
      menuClicked.routerLink = menu.routerLink;
      menuClicked.LastVisitedOn = this.GetDateTime(new Date());
      this.frequentlyUsedMenus = this.recentMenus.sort(function (a, b) { return a.Frequency > b.Frequency ? -1 : (a.Frequency < b.Frequency) ? 1 : 0 });
      this.frequentlyUsedMenus = this.frequentlyUsedMenus.slice(0, 5);
      let recentlyUsedMenus = this.recentMenus.sort(function (a, b) {
        let date1 = new Date(a.LastVisitedOn);
        let date2 = new Date(b.LastVisitedOn);
        return date1 > date2 ? -1 : (date1 < date2) ? 1 : 0;
      });
      this.recentlyUsedMenus = recentlyUsedMenus.slice(0, 5);
      console.log("recentlyUsedMenus", this.recentlyUsedMenus, 'frek', this.frequentlyUsedMenus);
    }
    this.menuService.UpdateFrequentAndRecentMenus(menu.ID, this.UserName).subscribe(resp => {
      console.log(resp);
    });
  }


  getTopMenus(topMenus) {
    if (topMenus.length > 0) {
      this.SubMenu = topMenus;
      console.log("SubMenu: ", this.SubMenu);

    }
    setTimeout(() => this.cdr.detectChanges());
    localStorage.setItem("SubMenu", JSON.stringify(this.SubMenu));
  }


  GetDateTime(date) {
    let adate = date;
    var ayear = adate.getFullYear();
    var amonth: any = adate.getMonth() + 1;
    var ahour: any = adate.getHours();
    var aminute: any = adate.getMinutes();
    var adt: any = adate.getDate();
    if (adt < 10) { adt = '0' + adt; }
    if (amonth < 10) { amonth = '0' + amonth; }
    return ayear + '-' + amonth + '-' + adt + " " + ahour + ":" + aminute + ":00";
  }

  activeTopMenu(menuitem) {
    localStorage.setItem("activeTopMenu", menuitem);
    this.router.navigateByUrl('/menu/first/tabs/' + menuitem.ID)
      .then(succeeded => {
        if (succeeded) {
          this.events.publish("activeTopMenu", menuitem);
        }
        else {
          console.log("Unable to route");
        }
      })
      .catch(error => {
        console.log(error);
      });;
  }


  appmenuclick(menu:any, menuIndex:any) {
    this.showMenuFlow = false;
    this.showTopMenu = false;
    this.showTopMenusWithFlow = false;
    if (menu.routeLink) {
      this.MenuData.forEach(element => {
        this.nestedFilter(menu.routerLink, element, element, element);
      });
    }
    if (menu.routerLink) {
      let sidebar = document.querySelector(".sidemenubar");
      if (!sidebar.classList.contains('close')) {
        sidebar.classList.toggle("close");
      }
      this.router.navigate([menu.routerLink]);
    }
    else {
      this.submenuindex = menuIndex;
      this.showSubMenu = !this.showSubMenu;
    }
  }
}
