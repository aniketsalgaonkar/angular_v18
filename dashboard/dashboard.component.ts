import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { MenuService } from '../services/menu.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  appGroups: any;
  public show : boolean = true;
  showActiveOnly: boolean = false;

  constructor(
    public loginService: LoginService,
    private menuService: MenuService,
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
      this.router.navigate(['menu', 'first', 'tabs'])
    }
  }

  toggleActiveOnly() {
    this.showActiveOnly = !this.showActiveOnly;
  }
  hasActiveGroups(groups: any[]): boolean {
    return groups.some(group => group.IsSubscribe);
  }
}
