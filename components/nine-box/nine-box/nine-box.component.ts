import { Component, Input, OnInit } from '@angular/core';
// import { NineBoxService } from 'src/app/Services/nine-box.service';
import { NineBoxService } from '../../../services/nine-box.service';
import { ImportsModule } from '../../Imports/imports';

interface DataItem {
    Frequency: string;
    Volume: string;
    Value: number;
    FontColor: string;
  BackgroundColor: string;
  SubText: string;
}

@Component({
    selector: 'app-nine-box',
    standalone:true,
      imports: [ImportsModule],
    templateUrl: './nine-box.component.html',
    styleUrls: ['./nine-box.component.scss'],
})
export class NineBoxComponent implements OnInit {

    @Input() Module: any;
    @Input() PageMenuDetails: any; 
    // data: DataItem[][] = [];
    data: DataItem[][] | null = null;
    skeletonData = new Array(9).fill(0);
    showfilter: boolean = false;    // used to show/hide filters using button click
    horizontalFilter: boolean = true;   // used to keep filter inputs in horizontal line
    colorMap: { [key: string]: string } = {
        'High-High': 'high-high',
        'High-Medium': 'high-medium',
        'High-Low': 'high-low',
        'Medium-High': 'medium-high',
        'Medium-Medium': 'medium-medium',
        'Medium-Low': 'medium-low',
        'Low-High': 'low-high',
        'Low-Medium': 'low-medium',
        'Low-Low': 'low-low'
    };

    filterSplitButtonOptions = [    //filter options to keep it horizontal or vertical/ open or hidden
        {
            label: 'Horizontal',
            //icon: 'pi pi-caret-left', 
            command: () => {
                this.horizontalFilter = true; this.showfilter = !this.showfilter;
            }
        },
        {
            label: 'Vertical',
            //icon: 'pi pi-caret-down', 
            command: () => {
                this.horizontalFilter = false; this.showfilter = !this.showfilter;
            }
        }
    ];
    UserName: string;

    constructor(private nineBoxService: NineBoxService) { }

    ngOnInit() {
        let filterData = {};
        this.UserName = localStorage.getItem('username');
        this.nineBoxService.getData(this.Module[0].moduleList[0].ID, this.Module[0].menu.ID, this.UserName, filterData).subscribe((response: DataItem[][]) => {
            //this.data = response;
            this.groupNineBoxData(response);
            console.log(response);
        });
        //console.log(this.data, "Nine Box Data");
        console.log(this.Module, "Module");
    }

    getBlockColor(item: DataItem): string {
        const key = `${item.Frequency}-${item.Volume}`;
        return this.colorMap[key] || '';
    }

    groupNineBoxData(data: any) {
        let groupedDataArray: any[] = [];
        this.Module[0].moduleList[0].moduleDetails[1].RatingModuleDetails.forEach(rating => {
            let ratingDescription = rating.RatingDescription;
            let groupedData = data[0].filter(item => item.Volume.trim() === ratingDescription);
            groupedDataArray.push(groupedData);
          });
          this.data = groupedDataArray;
    }

    showInFilter(ParameterName) {//to show/hide filter fields userwise(userwise menu detail mapping)
        if (this.PageMenuDetails != undefined && this.PageMenuDetails != null)
            return this.PageMenuDetails.filter(menudetail => menudetail.ParameterName == ParameterName)[0].ShowInFilter;
    }

    onSubmitFilter(formdata: any) {
        console.log("formdata", formdata)
        Object.keys(formdata).forEach(key => {
            var v = this.PageMenuDetails.filter(md => md.ParameterName == key);
            if (v[0].DataType == "month") {
                if (formdata[key] != null) {
                    let adate = new Date(formdata[key]);
                    if (adate != undefined && adate.toString() != "Invalid Date") {
                        var ayear = adate.getFullYear();
                        var amonth: any = adate.getMonth() + 1;
                        if (amonth < 10) { amonth = '0' + amonth; }
                        formdata[key] = amonth + "/" + ayear;
                    }
                }
            }
            else if (v[0].DataType == "date") {
                if (formdata[key] != null) {
                    let adate = new Date(formdata[key]);
                    if (adate != undefined && adate.toString() != "Invalid Date") {
                        var ayear = adate.getFullYear();
                        var amonth: any = adate.getMonth() + 1;
                        var adt: any = adate.getDate();
                        if (adt < 10) { adt = '0' + adt; }
                        if (amonth < 10) { amonth = '0' + amonth; }
                        formdata[key] = ayear + '-' + amonth + '-' + adt;
                    }
                }
            }
            else if (v[0].DataType == "datetime") {
                if (formdata[key] != null) {
                    let adate = new Date(formdata[key]);
                    if (adate != undefined && adate.toString() != "Invalid Date") {
                        var ayear = adate.getFullYear();
                        var amonth: any = adate.getMonth() + 1;
                        var adt: any = adate.getDate();
                        var hour: any = adate.getHours();
                        var min: any = adate.getMinutes();
                        var sec: any = adate.getSeconds();
                        if (adt < 10) { adt = '0' + adt; }
                        if (amonth < 10) { amonth = '0' + amonth; }
                        formdata[key] = ayear + '-' + amonth + '-' + adt + ' ' + hour + ':' + min + ':' + sec;
                    }
                }
            }
        })
        var filterValues = []

        Object.values(formdata).forEach((item) => {
            if (Array.isArray(item)) {
                item.forEach(elm => {
                    filterValues.push(elm.Text)
                })
            }
            else if (item !== null && typeof item == 'object' && item.hasOwnProperty('Text')) {
                filterValues.push(item['Text'])
            }
            else if (typeof item == 'string' && item !== '') {
                let pattern = /(0[1-9]|10|11|12)\/[0-9]{4}/;
                if (pattern.test(item)) { //for the date and month filter
                    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    let monthInFilter = months[Number(item.slice(-7, -5)) - 1];
                    // //console.log(month3 + " " + item.slice(-4),'month3')
                    filterValues.push(monthInFilter + " " + item.slice(-4))
                }
                else {
                    filterValues.push(item)
                }
            }
        })

        let data: any;
        data = JSON.stringify(formdata);
        localStorage.setItem('filterdata', data);
        let filterData = {};
        filterData["Filter"] = formdata;
        this.UserName = localStorage.getItem('username');
        this.nineBoxService.getData(this.Module[0].moduleList[0].ID, this.Module[0].menu.ID, this.UserName, filterData).subscribe((response: DataItem[][]) => {
            this.groupNineBoxData(response);
            console.log(response);
        });
        this.showfilter = false;
        if (this.showfilter == false && this.horizontalFilter == false) {
            this.showfilter = true;
        }
    }
}
