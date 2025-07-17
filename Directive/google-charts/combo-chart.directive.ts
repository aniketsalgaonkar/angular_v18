import { Directive, ElementRef, OnChanges, SimpleChanges, HostListener, Input, OnInit } from '@angular/core';
import {GoogleCharts} from 'google-charts'
declare var google: any;
@Directive({
    selector: '[appComboChart]'
})
export class ComboChartDirective implements OnChanges {

    @Input('') appComboChartConfig: any;
    @Input('') appComboChartDT: any;
    public chart: any;
    constructor(private elRef: ElementRef) { }

    ngOnInit() {
        debugger;

        console.log("appconfig", this.appComboChartConfig);
        GoogleCharts.load('50', {'packages':['corechart', 'wordtree','controls']});

    }

    ngOnChanges(changes: SimpleChanges) {

        setTimeout(() => {
            GoogleCharts.load('50', {'packages':['corechart', 'wordtree','controls']});
            GoogleCharts.api.setOnLoadCallback(this.drawChart(this.appComboChartConfig.ChartConfiguration,
                this.appComboChartConfig.moduleData, this.appComboChartDT));
        }, 5000);


    }

    public drawChart(ChartConfiguration, moduleData1, dT): any {
        debugger;
  
        /*
        var data = GoogleCharts.api.visualization.arrayToDataTable([
            ['Month', 'Bolivia', 'Ecuador', 'Madagascar', 'Papua New Guinea', 'Rwanda', 'Average'],
            ['2004/05',  165,      938,         522,             998,           450,      614.6],
            ['2005/06',  135,      1120,        599,             1268,          288,      682],
            ['2006/07',  157,      1167,        587,             807,           397,      623],
            ['2007/08',  139,      1110,        615,             968,           215,      609.4],
            ['2008/09',  136,      691,         629,             1026,          366,      569.6]
          ]);
         */
      
        var data: any;
        if (dT != null && dT != undefined) {
            GoogleCharts.load('50', {'packages':['corechart', 'wordtree','controls']});
            data = new GoogleCharts.api.visualization.DataTable(dT.value);

            var addRowData = Object.keys(dT.value[0]);

            var NewData: any;
            NewData = $(addRowData).each(function (i) {
                addRowData[i];
            }).get().join(',');

            var array = NewData.split(',');
            for (var i = 0; i < Object.keys(dT.value[0]).length; i++) {


                if (i == 0) {
                    data.addColumn("string", Object.keys(dT.value[0])[i]);

                }
                else {

                    data.addColumn("number", Object.keys(dT.value[0])[i]);

                }
            }
            for (var i = 0; i < dT.value.length; i++) {
                var temp = [];
                for (var j = 0; j < array.length; j++) {
                    if (j == 0) {
                        temp.push(dT.value[i][array[j]]);
                    }
                    else {
                        temp.push(Number(dT.value[i][array[j]]));
                    }
                    console.log(temp);
                }
                data.addRow([temp][0]);

            }

        }


        if ((moduleData1.length != 0) && (dT == null || dT == undefined)) {

            GoogleCharts.load('50', {'packages':['corechart', 'wordtree','controls']});
            data = new GoogleCharts.api.visualization.DataTable(moduleData1);
     
            var addRowData = Object.keys(moduleData1[0]);



            var NewData: any;
            NewData = $(addRowData).each(function (i) {
                addRowData[i];
            }).get().join(',');

            var array = NewData.split(',');
            for (var i = 0; i < Object.keys(moduleData1[0]).length; i++) {


                if (i == 0) {
                    data.addColumn("string", Object.keys(moduleData1[0])[i]);

                }
                else {

                    data.addColumn("number", Object.keys(moduleData1[0])[i]);
                    if (ChartConfiguration.Annotation == 'true')
                    {
                    data.addColumn({type:'string', role:'annotation'}); // annotation role col.
                    }

                }
            }
            for (var i = 0; i < moduleData1.length; i++) {
                var temp = [];
                for (var j = 0; j < array.length; j++) {
                    if (j == 0) {
                        temp.push(moduleData1[i][array[j]]);
                    }
                    else {
                        temp.push(Number(moduleData1[i][array[j]]));
                        if (ChartConfiguration.Annotation == 'true')
                        {
                           temp.push(String(moduleData1[i][array[j]]));
                        }
                    }
                    console.log(temp);
                }
                data.addRow([temp][0]);

            }

        }    //Generalization implementation         
        else  //in case of no records 
        {
            GoogleCharts.load('50', {'packages':['corechart', 'wordtree','controls']});
            data = new GoogleCharts.api.visualization.arrayToDataTable([
                ['', { role: 'annotation' }],
                ['', '']
            ]);
        }
        
        var options = {
            //generic properties
            title: ChartConfiguration.Title,
            titleTextStyle: { color: 'black', fontName: 'Arial', fontSize: 14 },
            height: ChartConfiguration.Height,
            width: ChartConfiguration.Width,
            colors: Array.from(ChartConfiguration.ColorsRGB),
            chartArea: { left: "0px", top: "0px", width: "80%", height: "80%" },
            //chartArea: { left: ChartConfiguration.ChartAreaLeft, top: ChartConfiguration.ChartAreaTop, width: ChartConfiguration.ChartAreaWidth, height: ChartConfiguration.Height },
            legend: { position: ChartConfiguration.LegendPosition },
            tooltip: { trigger: ChartConfiguration.ToolTipTrigger },
            animation: {
                duration: ChartConfiguration.AnimationDuration,
                easing: ChartConfiguration.AnimationEasing,
                startup: ChartConfiguration.AnimationStartup
            },

            vAxis: {
                maxValue: ChartConfiguration.VAxisMaxValue,
                minValue: ChartConfiguration.VAxisMinValue,
                title: ChartConfiguration.VAxisTitle,
               /* titleTextStyle:
                {
                    color: ChartConfiguration.VAxisTitleColor
                }*/
                textStyle: { fontSize: 10 },
                gridlines: {color: '#f5f5f5'},
                minorGridlines:{color: '#f5f5f5'}
            },

            hAxis: {
                title: ChartConfiguration.HAxisTitle,
              /*  titleTextStyle:
                {
                    color: ChartConfiguration.HAxisTitleColor
                }*/
                textStyle: { fontSize: 10 },
                gridlines: {color: '#f5f5f5'},
                minorGridlines:{color: '#f5f5f5'}
            },

            // specific properties
            enableInteractivity: ChartConfiguration.EnableInteractivity,
            isStacked: ChartConfiguration.isStacked,
            dataOpacity: 1.0,
            bar: { groupWidth: ChartConfiguration.BarGroupWidth },

            seriesType: 'bars',
            series: {1: {type: 'line'}}

/*
            seriesType: ChartConfiguration.SeriesType,
            series: { ChartConfiguration.SeriesColumn : { type: ChartConfiguration.SeriesColumnType } }
*/
  
          };


             this.chart = new GoogleCharts.api.visualization.ComboChart(document.getElementById(this.elRef.nativeElement.id));
             GoogleCharts.api.visualization.events.addListener(this.chart, 'animationfinish', titleCenter);
             GoogleCharts.api.visualization.events.addListener(this.chart, 'ready', titleCenter);
             this.chart.draw(data, options);
  
            function titleCenter() {
                $("text:contains(" + options.title + ")").attr({ 'x': '30%', 'y': '20' })
             }
    
    }
}
