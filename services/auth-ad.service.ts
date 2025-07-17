import { Injectable } from '@angular/core';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { Router } from '@angular/router';
import { AuthenticationResult, InteractionStatus } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthADService {
  isIframe = false;
  loggedIn = false;

  constructor(
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private router: Router
  ) {
    this.initializeAuth();
  }

  initializeAuth() {
    this.isIframe = window !== window.parent && !window.opener;

    // Handle redirect response properly
    this.msalService.instance.handleRedirectPromise().then((result) => {
      if (result !== null && result.account !== null) {
        this.msalService.instance.setActiveAccount(result.account);
      } else {
        // If no result, try to load from existing accounts
        const accounts = this.msalService.instance.getAllAccounts();
        if (accounts.length > 0) {
          this.msalService.instance.setActiveAccount(accounts[0]);
        }
      }

      // Now safe to check account
      this.checkoutAccount();

      const succ = JSON.parse(localStorage.getItem('userLOGIN') || '{}');
      if (succ.AzureIDLogin === 'success') {
        this.router.navigate(['menu', 'first']);
        localStorage.removeItem('userLOGIN');
      }
    });

    // Listen when MSAL is not in progress to check account
    this.msalBroadcastService.inProgress$
      .pipe(filter(status => status === InteractionStatus.None))
      .subscribe(() => {
        this.checkoutAccount();
      });

    // Listen for login success and set active account
    this.msalBroadcastService.msalSubject$
      .pipe(filter(msg => msg.eventType === 'msal:loginSuccess'))
      .subscribe(result => {
        const authResult = result.payload as AuthenticationResult;
        this.msalService.instance.setActiveAccount(authResult.account);
        this.checkoutAccount();
      });
  }

  logIn() {
    const isIE =
      window.navigator.userAgent.indexOf('MSIE ') > -1 ||
      window.navigator.userAgent.indexOf('Trident/') > -1;

    if (isIE) {
      this.msalService.loginRedirect();
    } else {
      this.msalService.loginPopup().subscribe({
        next: (response: AuthenticationResult) => {
          this.msalService.instance.setActiveAccount(response.account);
          this.checkoutAccount();
        },
        error: err => console.error('Login failed:', err),
      });
    }
  }

  checkoutAccount() {
    let account = this.msalService.instance.getActiveAccount();

    // Fallback to first account if no active one is set
    if (!account) {
      const allAccounts = this.msalService.instance.getAllAccounts();
      if (allAccounts.length > 0) {
        account = allAccounts[0];
        this.msalService.instance.setActiveAccount(account);
      }
    }

    this.loggedIn = !!account;

    if (account?.username) {
      localStorage.setItem('ADusername', account.username);
    }
  }

  logOut() {
    localStorage.removeItem('ADusername');
    localStorage.removeItem('username');
    this.msalService.logoutRedirect();
  }
}
