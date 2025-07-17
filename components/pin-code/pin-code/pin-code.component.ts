import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
// import { ToastController } from '@ionic/angular';
import { MessageService } from 'primeng/api';
// import { MainPageService } from 'src/app/Services/MainPage.service';
import { MenuService } from '../../../services/menu.service';

@Component({
  selector: 'app-pin-code',
  templateUrl: './pin-code.component.html',
  styleUrls: ['./pin-code.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class PinCodeComponent implements OnInit {

  @Input() Module: any;
  @Input() pinCodeLabelName: string;
  @Input() moduleListIndex: number;
  @Input() moduleDetailIndex: number;
  @Input() requiredField: boolean;

  @Output() showLoaderInMenu = new EventEmitter<boolean>();


  constructor(
    private mainpageservice: MenuService,
    // private toastController: ToastController
    private messageService: MessageService
  ) { }

  ngOnInit() { }

  //susan added start 
  isPincodeValid: boolean = false;

  VerifyIfPincodeExists(inputPincode) {
    var respStr = "";

    setTimeout(() => {
      this.mainpageservice.VerifyIfPincodeExists(inputPincode).subscribe(data => {
        console.log(data);

        if (data === "Pincode exists !") {
          this.isPincodeValid = true;
          respStr = "Pincode exists !";
        } else {
          this.isPincodeValid = false;
          respStr = "Pincode doesn't exist !";
        }

        this.showLoaderInMenu.emit(false);

        this.messageService.add({
          severity: this.isPincodeValid ? 'success' : 'error',
          summary: 'Pincode Check',
          detail: respStr,
          life: 3000
        });
      });
    }, 8000);


    return this.isPincodeValid;
  }

  onFocusOutEvent(event: any) {
    console.log(event.target.value);
    if (event.target.value !== null && event.target.value !== '') {
      this.showLoaderInMenu.emit(true);
      this.VerifyIfPincodeExists(this.Module[0].moduleList[this.moduleListIndex].moduleDetails[this.moduleDetailIndex].value);
    }
  }

  //susan added end

}
