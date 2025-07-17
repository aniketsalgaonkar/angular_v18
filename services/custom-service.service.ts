import { Injectable, OnInit } from '@angular/core';
import { MainPageService } from '../services/MainPage.service';
import * as $ from 'jquery';
import { DatabaseService } from './database.service';
import { Events } from './events.service';
//import { ConfirmationService, LazyLoadEvent, TreeNode, MessageService, MenuItem } from 'primeng/api';



@Injectable({
    providedIn: 'root'
})

export class CustomService implements OnInit {
    public M1_BackgroundColor = {};
    public userRemark_DT: any = {};
    public dataMeasures: any = {};
    public status: any = {};

    public remark: any = [];
    constructor(private mainpageservice: MainPageService, private database: DatabaseService,
        private events: Events) {

        //alert("custom service")
        this.GetDataForCDPFlow();

    }
    ngOnInit(): void {

    }

    async GetDataForCDPFlow() {
        try {
            this.remark = [];

            // Fetch user remarks
            const userRemarkResponse = await this.mainpageservice.GetUserRemark().toPromise();
            this.userRemark_DT = userRemarkResponse;
            //console.log("Array:", this.userRemark_DT);

            // Fetch data measures
            const dataMeasuresResponse = await this.mainpageservice.GetDataMeasures().toPromise();
            this.dataMeasures = dataMeasuresResponse;
            console.log("Array:", this.dataMeasures);

            // Fetch final submit status
            const statusResponse = await this.mainpageservice.GetFinalSubmitStatus().toPromise();
            this.status = statusResponse;



        } catch (error) {
            console.error("Error fetching data:", error);
            // Handle the error appropriately (e.g., show a message to the user)
        }
    }


   
    editRemark(columnName) {

        this.remark[columnName] = {};
        let UserName = localStorage.getItem("username");
        let userRemarkInfo = this.userRemark_DT.find(d => d.Username.toLowerCase() === UserName.toLowerCase() && d.Remark.toLowerCase() == columnName.toLowerCase());
        //console.log(userRemarkInfo,UserName,columnName)
        if (userRemarkInfo)
            this.remark[columnName]["EditRemark"] = userRemarkInfo.EditData;
        //return userRemarkInfo.EditData;
        else
            this.remark[columnName]["EditRemark"] = false;
    }

  

    //[disabled]="customService.FinalButtonDisable()"
    FinalButtonDisable() {
        let UserName = localStorage.getItem("username");

        // Check if this.status is an array
        if (Array.isArray(this.status)) {
            return this.status.some(d => d.Username.toLowerCase() === UserName.toLowerCase() && (d.SubmitStatus === "Submitted" || d.SubmitStatus === "Deactive"));
        } else {
            console.error("Status is not an array:", this.status);
            return false; // Handle this case as needed
        }
    }



    
    formatColumnHeader(columnHeader: string): string {
        // Replace underscores with spaces
        return columnHeader.replace(/_/g, ' ');
    }
   

    highlightColumns() {
        const filteredDataMeasures = this.dataMeasures.filter(item => item.EditData === 'TRUE');
        const columnNames = filteredDataMeasures.map(item => item.DataMeasure);

        console.log("Filtered Data with editdata true:", columnNames);
        return columnNames
    }
}
