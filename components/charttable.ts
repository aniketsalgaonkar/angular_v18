import { ApplicationRef, Injectable, OnInit } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ChartTable implements OnInit {

    public addToTable: any[] = [];
    public shouldReloadDiv: boolean = true;
    public daysValue: number | undefined;
    public index: string = "0";
    constructor(public cdr: ApplicationRef) {
    }

    ngOnInit(): void {
    }

    public filterWithDaysChart(days:any,moduleData:any, m:any) {
        debugger;
        localStorage.setItem(this.index, JSON.stringify(this.daysValue));
        this.addToTable = [];
        let randomData=moduleData;
        const now = new Date();
        this.addToTable = randomData.filter((x:any) => {
            var orderDate = new Date(x.Month);
            const diffDays = Math.ceil((now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24));
            return diffDays <= days;
        });
        
        this.getTableToChart(this.addToTable, m.xAxis, m.yAxis,m);
    }

    public getTableToChart(moduleData:any, xAxis:any, yAxis:any, m:any) {
        const myArray = [];
        var yAs= yAxis.split(',');
        let properties = [];
        properties.push(xAxis);
        properties.push(...yAs);
        for(var i = 0; i < moduleData.length; i++) {
            var obj:any = {};
            for (var j = 0; j < properties.length; j++) {
                obj[properties[j]] = moduleData[i][properties[j]];
              }
            myArray.push(obj);
        }
        m.moduleData = myArray;
        this.reLoad();
    }

    public handleChange(event:any)
    {
        debugger;
        this.index = event.index;
        this.daysValue = parseInt(localStorage.getItem(event.index) || '0', 10);
        this.reLoad();
    }

    public reLoad() {
        this.shouldReloadDiv = false;
        setTimeout(() => {
            this.shouldReloadDiv = true;
          }, 50);
        this.cdr.tick();
    }

    public removeIndex() 
    {
        localStorage.removeItem("0");
        localStorage.removeItem("1");
        localStorage.removeItem("2");
        localStorage.removeItem("3");
    }
}