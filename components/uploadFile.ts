import { Component, Inject, Injectable, OnInit } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { Table } from "primeng/table";
// import { Events } from "../Services/events.service";
import { Events } from "../services/events.service";
// import { MainPageService } from "../Services/MainPage.service";
import { MenuService } from "../services/menu.service";
import { ConfirmationService, MessageService } from "primeng/api";
// import { ToastController } from "@ionic/angular";
// import { WorkFlow } from "./workflow";
import { WorkFlow } from "./workflow";

// import * as XLSX from 'xlsx';

// import { table } from "console";



interface FileObject {
    name: string,
    FileData: Blob
}

@Injectable({
    providedIn: 'root'
})
export class UploadFile implements OnInit {

    RowErrors: any;
    showErrorDialog: boolean | undefined;//to display error dialog one excel is uploaded
    err_dt: any[] = []; //plain json of error data to display in tabular format
    err_columns: any[] = []; //list of columns from excel sheet
    errorList: any[] = [];//nested json format of error list from excel upload(Import Dataset)
    excelDataError: any;//to get the cell error while excel validation(Import daataset)
    exceldata: any;
    ImportToTable: any;//excel upload to table
    isAppend: any;//for excel data upload
    UserName: string = "";
    show: boolean = false;
    FileName: string = "";
    id: any;
    showValidationLoader: boolean = false;
    uploadedFiles: any[] = [];
    files: File[] = [];
    formData: FormData | undefined;
    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private menuService: MenuService,
        private router: Router,
        private workflow: WorkFlow) {

    }
    ngOnInit() {
        this.showValidationLoader = false;
    }

    onUpload(event: any, uploadPath: any) {
        debugger;

        this.formData = new FormData();

        this.uploadedFiles = [];
        this.formData.append("UploadPath", uploadPath);
        for (let file of event.files) {
            this.formData.append("files", file, file.name);
            this.uploadedFiles.push(file.name);
        }
        this.uploadFile();
    }

    uploadFile() {
        debugger;
        this.menuService.uploadFileToBLOB(this.formData);
    }


    async doAsyncConfirmAppend(files: any, columnName: any, tableName: any, isAppend: boolean) {
        return new Promise((resolve) => {
            this.confirmationService.confirm({
                message: 'Do you want to append data?',
                header: 'Append or Truncate',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Please wait, we are validating the data.',
                        detail: ''
                    });
                    this.uploadFileAppend(files, columnName, tableName, true);
                    resolve(true);
                },
                reject: () => {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Please wait, we are validating the data.',
                        detail: ''
                    });
                    this.uploadFileAppend(files, columnName, tableName, false);
                    resolve(false);
                },
                closeOnEscape: true,
                dismissableMask: false
            });
        });
    }

    // async doAsyncConfirmAppend(files: any, columnName: any, tableName: any, isAppend: boolean) {
    //     this.confirmationService.confirm({
    //         target: event.target as EventTarget,
    //         message: 'Are you sure that you want to proceed?',
    //         header: 'Confirmation',
    //         closable: true,
    //         closeOnEscape: true,
    //         icon: 'pi pi-exclamation-triangle',
    //         rejectButtonProps: {
    //             label: 'Cancel',
    //             severity: 'secondary',
    //             outlined: true,
    //         },
    //         acceptButtonProps: {
    //             label: 'Save',
    //         },
    //         accept: () => {
    //             this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
    //         },
    //         reject: () => {
    //             this.messageService.add({
    //                 severity: 'error',
    //                 summary: 'Rejected',
    //                 detail: 'You have rejected',
    //                 life: 3000,
    //             });
    //         },
    //     });
    // }

    uploadFileAppend(files: any, columnName: any, tableName: any, isAppend: any) {
        //debugger;
        this.showValidationLoader = true;
        this.ImportToTable = tableName;
        this.isAppend = isAppend;
        this.UserName = localStorage.getItem('username') || "null";
        for (let file of files) {
            this.menuService.uploadFile(file, this.UserName, columnName, tableName, isAppend).subscribe(resp => {

                console.log("dtError", resp);
                this.exceldata = (resp as { dtError: any[] }).dtError;
                this.errorList = this.exceldata.errorList;//nested json object of data with error description

                interface Column {
                    columnName: string;
                    value: any;
                    error: string | null;
                    rowNumberInExcel: number;
                    ErrorId: number;
                }
                type Row = Record<string, Column>;
                const data: Row[] = this.errorList;
                console.log(this.errorList, "Error List");
                const result = data.map(row => {
                    return Object.values(row)
                        .filter((col): col is Column => col.error !== null && col.error !== "")
                        .map(col => ({ columnName: col.columnName, error: col.error }));
                });
                const flattenedData = result.reduce((acc, curr) => acc.concat(curr), []);

                const aggregatedResult = flattenedData.reduce((acc, current) => {
                    const key = `${current.columnName}-${current.error}`;
                    if (!acc[key]) {
                        acc[key] = { columnName: current.columnName, RuleMessage: current.error || "null", RuleCount: 0 };
                    }
                    acc[key].RuleCount += 1;
                    return acc;
                }, {} as { [key: string]: { columnName: string; RuleMessage: string; RuleCount: number } });

                this.RowErrors = Object.values(aggregatedResult);
                console.log(this.RowErrors, "RowErrors")
                if (this.errorList != null && this.errorList.length > 0) {
                    let err_dt: any[] = [];
                    //let err_columns;
                    this.err_columns = Object.keys(this.errorList[0]);
                    this.errorList.forEach(row => {
                        let err_row: any = {};
                        this.err_columns.forEach(key => {
                            err_row[key] = row[key].value;
                        });
                        err_dt.push(err_row);//creates a plain json for error datatable 
                    })
                    this.err_dt = err_dt;
                    console.log(this.err_dt);
                    if (err_dt.length > 0) this.showErrorDialog = true//if it has errors then show dialog box with error table
                    // this.showExcelData(file, this.exceldata);
                }
                if ((resp as any).Message.toLowerCase().includes("successfully")) {
                    this.workflow.CreateOrUpdateDataset(tableName, this.UserName, this.isAppend);
                }

                //To display loader
                this.messageService.add({
                    severity: 'success', // or 'info', 'warn', 'error' based on message type
                    summary: 'Success',
                    detail: (resp as any).Message,
                    life: 3000 // duration in ms
                });
                this.showValidationLoader = false;
            });
        }

    }

    getErrorInUploadedData(columnName: any, ErrorId: any)//function to check whether the record or cell value is errorneous
    {//use in Import dataset file upload
        ////debugger;
        let error: any;
        if (this.errorList != null && this.errorList != undefined) {
            error = this.errorList.find(row => row[columnName].ErrorId == ErrorId);
        }

        //console.log("ERROR", error);
        if (error != undefined) this.excelDataError = error[columnName].error;
        //console.log(this.excelDataError);
        return error;

    }

    saveErrorDT(error_dt: any) {
        console.log(error_dt);
        let data = this.exceldata["validDataTable"].concat(error_dt);
        this.messageService.add({ severity: 'info', summary: 'Please wait a minute, we are submitting the data.', detail: '' });
        // Call SaveTableToDataset and subscribe to the returned observable
        this.menuService.SaveTableToDataset(this.UserName, this.ImportToTable, true, data).subscribe(
            (resp: any) => {
                console.log("validatedata", resp[0]["Message"]);
                this.messageService.add({ severity: 'success', summary: resp[0]["Message"], detail: '' });
            },
            (error: any) => {
                this.messageService.add({ severity: 'error', summary: error["error"]["Message"].toString(), detail: '' });
            },
            () => {
                // This callback is triggered when all chunks have been processed (either successfully or with errors)
                console.log("All chunks processed.");
            }
        );
        this.messageService.add({ severity: 'info', summary: 'the data has been submitted successfully', detail: '' });

    }


    validateData(error_dt: any) {
        //debugger;

        this.menuService.validateData(this.UserName, this.ImportToTable, error_dt).subscribe(resp => {
            console.log("validatedata", resp);
            this.messageService.add({ severity: 'success', summary: (resp as any)["Message"].toString(), detail: '' });
        },
            (error: any) => {
                this.messageService.add({ severity: 'error', summary: error["error"]["Message"].toString(), detail: '' });
            })
    }

    handleFileInput(files: any, columnName: any, tableName: any, updatePlanDataset?: any) {
        tableName = "SAP_" + tableName;
        //method gets call in upload
        //debugger;
        this.UserName = localStorage.getItem('username') || "null";
        this.ImportToTable = tableName;
        let isAppend: boolean = false;
        let exceldata: any;
        if (updatePlanDataset) {
            isAppend = true;
        }
        if (isAppend) {
            this.doAsyncConfirmAppend(files, columnName, tableName, isAppend);
        }
        else {
            //debugger;
            for (let file of files) {
                this.menuService.uploadFile(file, this.UserName, columnName, tableName, isAppend)
                    .subscribe({
                        next: (resp: any) => {
                            this.show = false;
                            const exceldata = resp.dtError;
                            console.log("Excel validation", resp);
                            //   this.showExcelData(file, exceldata);

                            // Using PrimeNG MessageService instead of ToastController
                            this.messageService.add({
                                severity: resp.IsSuccess ? 'success' : 'error',
                                summary: resp.IsSuccess ? 'Success' : 'Error',
                                detail: resp.Message || 'File processed',
                                life: 3000
                            });
                        },
                        error: (err) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Upload Failed',
                                detail: err.message || 'Error uploading file',
                                life: 3000
                            });
                            this.show = false;
                        }
                    });
            }

        }
    }

    // public showExcelData(file: any, exceldata: any) {
    //     // console.log(e.target.files[0]);
    //     // alert("");
    //     ////debugger;
    //     /* wire up file reader */
    //     const target: DataTransfer = <DataTransfer>(<unknown>event.target);
    //     // if (file.length !== 1) {
    //     //  throw new Error('Cannot use multiple files');
    //     // }
    //     const reader: FileReader = new FileReader();
    //     reader.readAsBinaryString(file);
    //     reader.onload = (e: any) => {
    //         /* create workbook */
    //         const binarystr: string = e.target.result;
    //         const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

    //         /* selected the first sheet */
    //         const wsname: string = wb.SheetNames[0];
    //         const ws: XLSX.WorkSheet = wb.Sheets[wsname];

    //         /* save data */
    //         const data = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
    //         console.log("excel data", data); // Data will be logged in array format containing objects

    //         this.showErrorDialog = true;
    //     };
    // }

    // private base64textString: String = ""
    // _handleReaderLoaded(readerEvt) {
    //     var binaryString = readerEvt.target.result;
    //     this.id = Math.random();
    //     sessionStorage.setItem('id', this.id.toString());
    //     this.base64textString = btoa(binaryString);
    //     //console.log(btoa(binaryString));
    //     this.storage.set('sampler-' + this.id, btoa(binaryString));
    //     let FileType: FileObject = {
    //         name: this.FileName,
    //         FileData: this.b64toBlob(btoa(binaryString), '', '')
    //     };
    //     //console.log(btoa(binaryString));

    //     this.storage.set('FileType-' + this.id, FileType);
    //     let toast = this.toastController.create({
    //         message: "Your image is stored. Click on Submit to save the form.",
    //         duration: 3000,
    //         position: 'bottom',
    //         //showCloseButton: true,
    //         //closeButtonText: 'Ok',

    //     });
    //     toast.then(toast => toast.present());


    //     //console.log('blob data while passing to savedata1' + JSON.stringify(FileType));


    // }


    replacer(key: any, val: any) {
        if (key == "_parent" || key == "parent") return undefined;
        else return val;

    }

    b64toBlob(b64Data: any, contentType: any, sliceSize: any) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

    openConfirm() {
        this.confirmationService.confirm({
            message: 'Test?',
            accept: () => alert('Accepted!'),
            reject: () => alert('Rejected!')
        });
    }

}
