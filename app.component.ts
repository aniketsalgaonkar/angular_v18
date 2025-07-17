import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { LoginService } from './services/login.service';
import { IUser } from './models/user.model';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog, } from 'primeng/confirmdialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthADService } from './services/auth-ad.service';
import { UploadFile } from './components/uploadFile';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    ToastModule,
    ConfirmDialog
  ],
  providers: [ConfirmationService,MessageService, UploadFile],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  title = 'snop';

  constructor(
    private loginService: LoginService, 
    private messageService: MessageService,
    private authADService: AuthADService,) {}

  ngOnInit() {
    this.setCurrentUser();
    this.authADService.initializeAuth();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user: IUser = JSON.parse(userString);
    this.loginService.setCurrentUser(user);
  }
}
