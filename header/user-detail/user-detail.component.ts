import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DrawerModule } from 'primeng/drawer';
import { FieldsetModule } from 'primeng/fieldset';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [DrawerModule, ButtonModule, FieldsetModule, CardModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent {

  @Input({ required: true}) isUserDetailVisiable: boolean = false;
  @Output() demo = new EventEmitter<boolean>();

  constructor(
    public loginService: LoginService,
    private router: Router
    
  ){
  }

  TicketAppLink() { }

  logout() {
    localStorage.clear();
    this.demo.emit(false);
    this.loginService.setCurrentUser(null);
    this.router.navigateByUrl('/');
  }

  hello() {
    this.demo.emit(false);
  }

}
