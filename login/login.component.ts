import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { forkJoin } from 'rxjs';
import { MenuService } from '../services/menu.service';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  tokenKey: string = "msal.idtoken"

  constructor(
    private fb: FormBuilder, 
    private loginService: LoginService, 
    private menuService: MenuService, 
    private router: Router,
    private msalService: MsalService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.setScrollBehavior();
    window.addEventListener('resize', this.setScrollBehavior);
  }

  ngOnDestroy(): void {
    document.body.style.overflow = 'auto';
    window.removeEventListener('resize', this.setScrollBehavior);
  }

  setScrollBehavior = () => {
    if (window.innerWidth > 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }


  onSubmit(): void {
    if (this.loginForm.valid) {
      // Add your login logic here
      this.loginService.login(this.loginForm.value).subscribe({
        next: user => {
          //get all menus without nested form
          this.menuService.getMenuList(user.UserName).subscribe(data => {
            console.log('allmenus', data);
            localStorage.setItem("menus", JSON.stringify(data));
          })
          if (!user.Error) {
            localStorage.setItem('username', user.UserName);
            const token = {
              refresh_token: 'refreshtokencode',
              user: user.UserName,
              exp: new Date(new Date().setDate(new Date().getDate() + 1)), // Corrected expiration
              access_token: { username: user.UserName }
            };
            localStorage.setItem(this.tokenKey, JSON.stringify(token));

            // Fetch both menu lists in parallel
            forkJoin({
              menulist: this.menuService.getMenuList(user.UserName),
              allmenu: this.menuService.getAllMenus(user.UserName),
              apps: this.menuService.getApps(user.UserName)
            }).subscribe(({ menulist, allmenu, apps }) => {
              localStorage.setItem("menulist", JSON.stringify(menulist));
              localStorage.setItem("allmenu", JSON.stringify(allmenu));
              localStorage.setItem("apps", JSON.stringify(apps));
              console.log(menulist, apps, "Sandeep Murmu", allmenu)
              this.router.navigate(['menu/first']);
            });
          }
        },
        error: (error) => {
          console.log(error)
        }
      })
    }
  }

  onAzureLogin() {
    console.log('Azure login clicked');
    localStorage.setItem('userData', JSON.stringify({ AzureLogin: "AzureSucess" }));
    localStorage.setItem('userLOGIN', JSON.stringify({ AzureIDLogin: "success" }));
    this.msalService.loginRedirect({
      scopes: ['user.read'],
      prompt: 'select_account',
    });
  }

} 