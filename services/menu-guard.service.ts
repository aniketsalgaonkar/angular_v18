import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Events } from '../services/events.service';

@Injectable()
export class MenuGuardService {
  MenuData:any[] = [];
  PublishVar:any[] = [];
    constructor(private authentication: AuthenticationService, private router: Router, public events: Events) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
      ): boolean | Promise<boolean> {
        console.log('route',route,'state',state);
        let menuList:any[] = JSON.parse(localStorage.getItem('menus'));
        if(route.url){
          if(state.url == '/menu/first/tabs/' || state.url == '/menu/first/tabs'){
            return true;
          }
          else{
            if(menuList.find(i => i.ID == route.routeConfig.path || i.ID == route.url[0].path)){
              this.events.publish('CanActivateNavigation',state.url);
              console.log('thisis',state.url);
              return true;
            }
            else{
              this.authentication.logout();
            }
          } 
        }
        
      }
}