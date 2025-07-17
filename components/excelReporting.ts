import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { ToastController } from '@ionic/angular';
import { MenuService } from '../services/menu.service';

@Injectable({
  providedIn: 'root',
})

export class ExcelReporting {

    constructor(
        private mainpageservice: MenuService,
        private toastController: ToastController,
        ){}

    // Excel Automation Code Starts Here
    show:boolean = false; //To show the loader

    uploadedFile: File | undefined; //To Store Uploaded File

    workbookName: string; //To Store the workbook name. (Bind this in [ngModel] of the hidden field named “path”) [in 4Th Module]
    
    commaSeperatedSheetNames: string;

    sheetNames: any[] = []; // To Store the sheets in an array for dropdowns. (Bind this on the [options] property of “Raw Data Sheet” Dropdown & “X Columns Sheet Name” dropdown) [in 3RD Module]
    
    selectedRawSheet: any; // To store object from dropdown value. (Bind this in the [ngModel] of the “Raw Data Sheet” Dropdown) [in 3RD Module]
    
    selectedSheet: any; // To store object from dropdown value. (Bind this in the [ngModel] of the “Module Name” Dropdown) [in 3RD Module]
    
    selectedSht: any; // To store selected sheet. (Bind this in the [ngModel] of the hidden field named “SheetName”) [in 4Th Module]
    
    selectedXColumnSheet: any;  // To store the X Columns Sheet (You have to Set the value for this variable on the OnChange event of the “X Columns Sheet Name” dropdown (Take only the value part of the selected dropDown value Object to set the value for this variabe)) [in 3RD Module] & (Bind this in the [ngModel] of the hidden field named “XColumnsSheetName”) [in 4Th Module]

    columnNamesWithDataType: any[] = []; //To Store Sheet wise Columns with data types in an array for dropdown. (Bind this in the [options] property of the “X”,”Y”,”Z” Dropdown) [in 3RD Module]
    
    columnNames: any[] = []; // To store sheet wise the column names for dropdowns. (Bind this in the [options] property of the “Exclude Column”, “Display Column” Dropdown) [in 4Th Module]

    moduleID: Number; // To store the selected module (Bind this in the [ngModel] of the hidden field named “ModuleID”) [in 4Th Module]

  
  //This function should be called on the uploadHandler event of <p-fileUpload> control.
    handleFileInput(event: any): void {
      const files: File[] = event.files;

      if (files && files.length > 0) {
          this.show = true;
          this.workbookName = files[0].name;
          this.uploadedFile = files[0];
          this.getCommaSepSheetNames();
          this.getSheetNames();
      }
  }

  getCommaSepSheetNames(): void {
      let toast = this.toastController.create({
          message: "Please wait ! file upload in progress, don't exit the page",
          duration: 8000,
          position: 'bottom',
          //closeButtonText: 'Ok'
      });
      toast.then(toast => toast.present());

      const fileReader = new FileReader();

      fileReader.onload = (e: any) => {
          const data = e.target.result;
          const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'binary' });

          // Store comma-separated sheet names in a variable string
          this.commaSeperatedSheetNames = workbook.SheetNames.map(sheet => sheet).join(',');

          console.log('this.commaSeperatedSheetNames: ',this.commaSeperatedSheetNames);

          this.mainpageservice.uploadFile(this.uploadedFile, localStorage.getItem('username'), "Workbook", undefined, false, this.commaSeperatedSheetNames).subscribe(resp => {
              this.show = false;
              //To display loader
              toast = this.toastController.create({
                  message: resp["Message"],
                  duration: 8000,
                  position: 'bottom',
                  //closeButtonText: 'Ok'
              });
              toast.then(toast => toast.present());
          });
          this.show = true;
      };

      fileReader.readAsBinaryString(this.uploadedFile!);
  }

  getSheetNames(): void {
      const fileReader = new FileReader();

      fileReader.onload = (e: any) => {
          const data = e.target.result;
          const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'binary' });
          this.sheetNames = workbook.SheetNames.map((sheetName) => ({
              Text: sheetName,
              Value: sheetName,
              Selected: false,
              AppID: null
          }));

          console.log("this.sheetNames: ", this.sheetNames);
      };

      fileReader.readAsBinaryString(this.uploadedFile!);
  }


  //This function should be called on the OnChange event of “Raw Data Sheet” Dropdown
  onRawSheetSelected(): void {
    if (this.selectedRawSheet !== '') {
        let toast = this.toastController.create({
            message: "Please wait ! while we fetch the columns from your sheet, don't exit the page",
            duration: 8000,
            position: 'bottom',
            //closeButtonText: 'Ok'
        });
        toast.then(toast => toast.present());

        let rawSheet = this.selectedRawSheet.Text;

        const fileReader = new FileReader();

        fileReader.onload = (e: any) => {
            const data = e.target.result;
            const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'binary' });

            const selectedSheetData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[rawSheet], {
                header: 1,
            });

            // Assuming the first row contains the column names, you can adjust as needed
            this.columnNames = selectedSheetData[0].map((columnName) => ({
                Text: columnName,
                Value: columnName,
                Selected: false,
                AppID: null
            }));

            console.log("this.columnNames: ",this.columnNames);

            this.columnNamesWithDataType = selectedSheetData[0].map((columnName,index) => {
                            const dataType = this.detectColumnDataType(selectedSheetData, index);
                            const val = `${columnName}->${dataType}`;
                            return {
                              Text: columnName,
                              Value: val,
                              Selected: false,
                              AppID: null
                            };
                        });

            console.log("this.columnNamesWithDataType: ",this.columnNamesWithDataType);
        };

        fileReader.readAsBinaryString(this.uploadedFile!);
    }
  }


  // This function will be called on the OnChange event of the “Module Name” DropDown
  onSheetSelected(): void {
      if (this.selectedSheet !== '') {           
        this.moduleID = this.selectedSheet.Value;
        this.selectedSht = this.selectedSheet.Text;
      }
  }

  detectColumnDataType(sheetData: any[], index: number): string {
        const cellValue = sheetData[1][index];

          // Regular expression to match positive or negative integers and decimals
        const numberRegex = /^[-]?\d+(\.\d+)?$/;

        if (numberRegex.test(cellValue)) {
            return 'int';
        }

        return 'string';
    }

  handleFileUploadCancel() {
      // Clear the values of the declared variables
      this.uploadedFile = undefined;
      
      this.workbookName = "";
      this.commaSeperatedSheetNames = "";

      this.sheetNames = [];
      this.selectedRawSheet = {};
      this.selectedSheet = {};
      this.selectedSht = "";
      this.selectedXColumnSheet = "";
      
      this.columnNamesWithDataType = [];
      this.columnNames = [];
      
      this.moduleID = undefined;
  }

  // XXXXXXXXXX Excel Automation Code Ends Here

}