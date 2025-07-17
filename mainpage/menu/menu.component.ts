import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { Events } from '../../services/events.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  menuList: any[] = [];
  dashboard: string | undefined;
  public show: boolean = true;
  public showTopMenu: boolean = false;
  public topMenus: any[] = []
  constructor(private router: Router, private menuService: MenuService, private events: Events) {
    this.events.subscribe("currentApp", () => { this.getAppMenus(); })
  }

  ngOnInit() {
    this.getAppMenus();
  }

  getAppMenus() {
    const currentApp = JSON.parse(localStorage.getItem("currentApp") || '{}');
    const username = localStorage.getItem('username');
    this.dashboard = localStorage.getItem('dashboard') || ' '
    console.log("Vikrant", this.dashboard);

    if (currentApp && currentApp.ID && username) {
      this.menuService.getAppMenus(username, currentApp.ID).subscribe({
        next: (response: any) => {
          const resultArray = Object.keys(response).map(key => response[key]);
          localStorage.setItem('StoreddSideMenu', JSON.stringify(resultArray));

          // Filter out menus without items or TopMenus
          this.menuList = resultArray.filter(menu => menu.items || menu.TopMenus);
          console.log('Menu List:', this.menuList);
          this.show = false;
        },
        error: (error) => {
          console.error('Error fetching menus:', error);
        }
      });
    } else {
      console.error('Missing required data: currentApp or username');
    }

  }

  route(routerLink: string) {
    this.router.navigateByUrl(routerLink);
    console.log(routerLink)
  }
} 