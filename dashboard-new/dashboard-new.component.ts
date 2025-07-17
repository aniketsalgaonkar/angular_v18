import { Component, EventEmitter, NgModule,OnInit, Output } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FieldsetModule } from 'primeng/fieldset';
import { CardModule } from 'primeng/card';
import { LoginService } from '../services/login.service';
import { MenuService } from '../services/menu.service';
import { Router } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { Events } from '../services/events.service';


@Component({
  selector: 'app-dashboard-new',
  standalone: true,
  imports: [CommonModule,
    InputSwitchModule,
    FieldsetModule,
    CardModule,DrawerModule],
  templateUrl: './dashboard-new.component.html',
  styleUrl: './dashboard-new.component.scss'
})

export class DashboardNewComponent implements OnInit {

  @Output() closeDrawer = new EventEmitter<void>();
  appGroups: any;
  public show : boolean = true;
  showActiveOnly: boolean = false;
  isDashboardAppsVisiable : boolean = true;

  constructor(
    public loginService: LoginService,
    private menuService: MenuService,
    private events: Events,
    private router: Router) { 
      this.show = true;
    }

  ngOnInit() {
 
    this.getApp();
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
      this.show = false;
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
    this.closeDrawer.emit(); // Emit event to close drawer

  }

  toggleActiveOnly() {
    this.showActiveOnly = !this.showActiveOnly;
  }
  hasActiveGroups(groups: any[]): boolean {
    return groups.some(group => group.IsSubscribe);
  }
}
