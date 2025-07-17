import { NgModule } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FieldsetModule } from 'primeng/fieldset';
import { CardModule } from 'primeng/card';


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    InputSwitchModule,
    RouterModule.forChild([ {path: '', component: DashboardComponent} ]),
    NgFor,
    FieldsetModule,
    CardModule
  ],
  exports: [
    DashboardComponent  // 👈 Add this line
  ]
})
export class DashboardModule { }
