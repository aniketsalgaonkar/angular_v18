import { Component, inject, OnInit } from '@angular/core';
import { ImportsModule } from '../../Imports/imports';
import { NavigationExtras,Router } from '@angular/router';
import { MenuService } from '../../../services/menu.service';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-menuflow',
  standalone: true,
  imports: [ImportsModule],
  templateUrl: './menuflow.component.html',
  styleUrls: ['./menuflow.component.scss'],
})
export class MenuflowComponent implements OnInit {
  timelineData: any = [];
  highlightcard: number;
  events: any;
  UserName: string;
  show: boolean;

  constructor(private router: Router,private mainpageservice:MenuService,private messageService: MessageService) {
    alert("constructor");
  }

  ngOnInit() {
    let timelineData = localStorage.getItem("MenuFlowData");
    this.timelineData = JSON.parse(timelineData);
  }

  navigate(i, LinkedMenu, FilterName?: string, rowIndex?: number) {
    if (rowIndex > -1) { this.highlightcard = rowIndex; }
    let qm = {};
    if (FilterName == null) {
      qm = { "rowval": i };
    }
    else {
      qm[FilterName] = {};
      qm[FilterName].Text = i;
    }
    let navigationExtras: NavigationExtras =
      { queryParams: qm };
    localStorage.setItem('navigationExtras', JSON.stringify(qm));
    this.events.publish('navigationExtras', qm);
    if (LinkedMenu != 0) this.router.navigateByUrl("/menu/first/tabs/" + LinkedMenu, navigationExtras);
    // this.router.navigate(["/menu/first/tabs/GotoForm"], navigationExtras);
  }
  async Run(i: any) {
  let qm = { "rowval": i };
  this.UserName = localStorage.getItem('username');
  this.show = true;

  this.mainpageservice.RunWorkflowTask(i, this.UserName, undefined).subscribe(async resp => {

    this.messageService.add({
      severity: 'info',
      summary: 'Workflow',
      detail: resp["Message"],
      life: 8000
    });

    this.show = false;

    await this.events.publish('Notification');
    this.events.publish('PopUp');
  });
}
}
