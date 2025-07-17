import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
//import { JwtHelperService } from '@auth0/angular-jwt';
import { MenuOldService } from './menuOld.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    //token = {
    //    refresh_token: 'refreshtokencode',
    //    exp: new Date((new Date().getDate() + 1)),
    //    access_token: {
    //        username: 'user'
    //    }
    //};

    //tokenKey: string = "a6smm_utoken"
    tokenKey: string = "jwt"

    constructor(private router: Router, public zone: NgZone, private menuservice: MenuOldService) { }

    login(username, password) {
        //get all menus without nested form
        this.menuservice.getMenuList(username).subscribe(data => {
            console.log('allmenus', data);
            localStorage.setItem("menus", JSON.stringify(data));
        })
        let token = {
            refresh_token: 'refreshtokencode',
            user: username,
            exp: new Date((new Date().getDate() + 1)),
            access_token: {
                username: username
            }
        };
        this.setToken(token);
        localStorage.setItem('username', username);

        // this.router.navigate(['menu','first','tabs'])
        this.router.navigate(['menu/first'])

    }


    logout() {
        this.removeToken();
        //this.router.navigate(['login']);
        window.location.href = "/";
    }

    getToken() {
        return localStorage.getItem(this.tokenKey);
    }

    getuser() {
        console.log('getuser', JSON.parse(localStorage.getItem(this.tokenKey)['user']));
    }

    setToken(token) {

        localStorage.setItem(this.tokenKey, JSON.stringify(token));
    }

    getAccessToken() {
        return JSON.parse(localStorage.getItem(this.tokenKey))['access_token'];
    }

    isAuthenticated() {
        debugger;
        let token = localStorage.getItem(this.tokenKey);

        if (token) {
            //if (token && ! this.jwtHelper.isTokenExpired(token)){
            return true;
        }
        else {
            return false;
        }
    }
    loginWithOtp(username) {
        let token = {
            refresh_token: 'refreshtokencode',
            user: username,
            exp: new Date((new Date().getDate() + 1)),
            access_token: {
                username: username
            }
        };
        this.setToken(token);
        localStorage.setItem('username', username);
        this.router.navigate(['menu', 'first']);
    }

    refreshToken() {
        //this.token.exp = new Date((new Date().getDate() + 1));
        //this.setToken(this.token);
    }

    removeToken() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem('username');
        localStorage.removeItem('CurrentActiveMenuIndex');
        localStorage.removeItem('CurrentAppName');
        localStorage.removeItem('CurrentApp');
        localStorage.removeItem('CurrentActiveMenuParentIndex');
        localStorage.removeItem('SubMenu');
        //localStorage.removeItem('StoreddSideMenu');
        localStorage.removeItem('PageName');
        //localStorage.removeItem('navigationExtras');
        localStorage.removeItem('menus');
        localStorage.removeItem('timelineData');
    }

}
