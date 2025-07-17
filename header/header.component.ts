import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { environment } from '../../environments/environment';
import { LoginService } from '../services/login.service';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { Router, NavigationEnd } from '@angular/router';
import { FieldsetModule } from 'primeng/fieldset';
import { CardModule } from 'primeng/card';
import { MenuService } from '../services/menu.service';
import { Events } from '../services/events.service';
import { SidebarStateService } from '../services/sidebar-state.service';
import { ViewEncapsulation } from '@angular/core';
import { UserDetailComponent } from './user-detail/user-detail.component';
// import { DashboardComponent } from '../dashboard/dashboard.component';
import { DashboardModule } from '../dashboard/dashboard.module';
import { DashboardNewComponent } from '../dashboard-new/dashboard-new.component';



@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [DrawerModule, ButtonModule, FieldsetModule, CardModule, UserDetailComponent, DashboardModule, DashboardNewComponent],
})
export class HeaderComponent implements OnInit {

  isUserDetailVisiable: boolean = false;
  isDashboardAppsVisiable: boolean = false;
  isNotification: boolean = false;
  fullScreenMode: boolean = false;
  appName = environment.appName;
  appGroups: any;
  margin: any;

  isExpanded = false;
  hasClickedUserBtn = false;
  showIcon: boolean = false;

  constructor(
    public loginService: LoginService,
    private menuService: MenuService,
    private router: Router,
    private events: Events,
    private sidebarState: SidebarStateService) {

  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Show icon only on menu-related routes (customize as needed)
        this.showIcon = event.url.includes('menu/first/tabs');
      }
    });
    console.log(this.isUserDetailVisiable);
    this.getApp();
  }

  toggleSidebar() {
    this.sidebarState.toggle();
  }

  TicketAppLink() { }
  closeDrawer() {
    this.isDashboardAppsVisiable = false;
  }

  getApp() {
    this.menuService.getApps(this.loginService.currentUser()!.UserName).subscribe(apps => {
      if (!Array.isArray(apps)) {
        console.error("Invalid response: apps is not an array", apps);
        return;
      }

      let appNames = [];
      this.appGroups = [];

      if (apps.length > 0) {
        const groupCount = apps.reduce(
          (prev, current) => (prev.GroupByIndex > current.GroupByIndex ? prev : current),
          { GroupByIndex: 0 }
        ).GroupByIndex;

        if (groupCount > 1) {
          for (let i = 0; i < groupCount; i++) {
            let appsGroupWise = apps.filter(app => app.GroupByIndex == (i + 1));
            this.appGroups[i] = appsGroupWise;
          }
        } else {
          appNames = apps.sort((a, b) => (a.OrderKey < b.OrderKey ? -1 : (a.OrderKey > b.OrderKey ? 1 : 0)));
          this.appGroups[0] = appNames;
        }
      }
    });
  }

  clickGroup(group: any) {
    console.log(group)
    localStorage.setItem('currentApp', JSON.stringify(group));
    if (group.DashboardLink != 0) {
      localStorage.setItem('CurrentActiveMenuIndex', '/menu/first/tabs/' + group.DashboardLink);
      this.router.navigate(['menu', 'first', 'tabs', group.DashboardLink], { queryParams: { id: group.ID } });
    }
    else {
      this.router.navigate(['menu', 'first', 'tabs']).then(() => {
        this.events.publish("currentApp", group.ID);
      })
    }
    this.isDashboardAppsVisiable = !this.isDashboardAppsVisiable;

  }

  toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      this.fullScreenMode = true;
    } else {
      document.exitFullscreen();
      this.fullScreenMode = false;
    }
  }

  zoomIn() {
    let page = document.documentElement; // Get the root HTML element
    let zoomLevel = parseInt(page.style.zoom || '100') + 10;
    page.style.zoom = zoomLevel + '%';
  }

  zoomOut() {
    let page = document.documentElement;
    let zoomLevel = parseInt(page.style.zoom || '100') - 10;
    page.style.zoom = zoomLevel + '%';
  }
  navigate() {
    this.router.navigateByUrl('/menu/first')
  }

  isUserVisible() {
    this.isUserDetailVisiable = true;
  }

  useHamburgerVisible() {
    this.isDashboardAppsVisiable = true;
  }

  hello(event: any) {
    this.isUserDetailVisiable = event;
  }

  hamburgerVisible(event: any) {
    this.isDashboardAppsVisiable = event;
  }

}
