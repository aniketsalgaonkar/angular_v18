import { ElementRef, Injectable, OnInit, QueryList, ViewChildren } from '@angular/core';
// import { WorkFlowService } from '../Services/workflow.service';
import { WorkFlowService } from '../services/workflow.service';
import { NavigationExtras, Router } from '@angular/router';
// import { Events } from '../Services/events.service';
import { Events } from '../services/events.service';
import { MessageService } from 'primeng/api';
import { animate } from '@angular/animations';

@Injectable({
    providedIn: 'root'
})
export class WorkFlow implements OnInit {


    filterByValue: { label: string; value: string; }[] = [];

    sortOptions: any[] = [];
    sortKey: string = "";
    sortField: string = "";
    sortOrder: number | undefined;
    UserName: string;
    datasets: any;
    DatasetId:any;
    EnabledRun: boolean = false;

    constructor(private workflowservice: WorkFlowService,
        private events: Events,
        private router: Router,
        // private toastController: ToastController,
        private messageService: MessageService) {
        this.UserName = localStorage.getItem('username') || "null";
        this.getDatasetList();
    }


    ngOnInit(): void {
        this.getDatasetList();
    }

    onValidate(form: any, storeProcedure: string, LinkedMenu: number): void {
        console.log("Workflow component", form);
        let datasets = [];
        datasets = form.value.itemIndex;
        this.workflowservice.validateDataset(datasets, storeProcedure).subscribe(resp => {
            console.log("validate response", resp);
            this.navigateOnFormSubmit(LinkedMenu);
        })

    }

    navigateOnFormSubmit(LinkedMenu: any) {
        let filter = localStorage.getItem("navigationExtras");
        this.events.publish('navigationExtras', JSON.parse(filter || "{}"));
        let navigationExtras: NavigationExtras = {
            queryParams: JSON.parse(filter || "{}")

        };
        // this.router.navigateByUrl("/menu/first/tabs/" + LinkedMenu, navigationExtras);

    }


    RunScenario(form: any, selectedScenario: any) {
        debugger;
        this.EnabledRun = true

        let app = localStorage.getItem("currentApp");
        let run_id = (JSON.parse(app || "{}")).RunTaskId;

        //let AppId =(JSON.parse(app).ID)

        let AppId = (JSON.parse(app || "{}")).ID;

        let Dataset;
        if (form.value["DatasetList"]) { Dataset = form.value["DatasetList"].Text; }

        let UserName = localStorage.getItem('username');
        console.log(run_id);

        let Scenario_id;
        if (form.value[selectedScenario]) { Scenario_id = form.value[selectedScenario][0]; }
        debugger;
        if (!Scenario_id || !Dataset) {
            this.messageService.add({ severity: 'warn', summary: "Please select scenario and Dataset.", detail: '' });
            // let toast = this.toastController.create({
            //     message: "Please select scenario and Dataset.",
            //     duration: 3000,
            //     position: 'bottom',
            //     //closeButtonText: 'Ok',

            // });
            // toast.then(toast => toast.present());
            this.EnabledRun = false

        }
        else {
            debugger;
            this.events.publish('RunTask');
            this.workflowservice.RunWorkflowTask(16, Scenario_id, UserName, Dataset, AppId).subscribe(async resp => {

                this.messageService.add({
                    severity: 'info',
                    summary: (resp as { Message: string }).Message,
                    detail: ''
                });
                // //To display loader
                // let toast = this.toastController.create({
                //     message: resp["Message"],
                //     duration: 3000,
                //     position: 'bottom',
                //     //closeButtonText: 'Ok',

                // });
                // toast.then(toast => toast.present());
                await this.events.publish('Notification');
                this.events.publish('PopUp');
                this.EnabledRun = false;

            });
        }

    }

    CreateOrUpdateDataset(tableName: string, username: string, isAppend?: boolean) {
        debugger;
        let CurrentApp = JSON.parse(localStorage.getItem("currentApp") || "null");

        this.workflowservice.CreateOrUpdateDataset(tableName, username, CurrentApp.ID, isAppend).subscribe(resp => {
            console.log(resp);
        });
    }


    onFinalSubmit(MenuId: any): void {
        // Show loading message
        this.messageService.add({
            severity: 'info',
            summary: 'Processing',
            detail: 'Run Task has been started. Please wait for task completion',
            life: 5000 // Show for 5 seconds
        });

        const CurrentApp = JSON.parse(localStorage.getItem("currentApp") || "{}");
        const data = {}; // Your data object

        this.workflowservice.saveAllModules(MenuId, this.UserName, CurrentApp.ID, data).subscribe(
            (resp) => {
                // Success notification
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: resp.toString(),
                    life: 3000 // Auto-close after 3 seconds
                });

                this.events.publish('PopUp');
            },
            (error) => {
                // Error notification
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.message || 'An error occurred',
                    life: 5000 // Show longer for errors
                });
            }
        );
    }
    
    getDatasetList() {
        let CurrentApp = JSON.parse(localStorage.getItem("currentApp") || 'null');
    
        if (!CurrentApp || !CurrentApp.ID) {
            console.error('CurrentApp is missing or invalid in localStorage');
            return;
        }
    
        this.workflowservice.getDatasetList(this.UserName, CurrentApp.ID).subscribe(resp => {
            this.datasets = resp;
        });
    }
}
