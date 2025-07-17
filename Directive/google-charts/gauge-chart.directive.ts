import { Directive , ElementRef,OnChanges,SimpleChanges, HostListener, Input, OnInit} from '@angular/core';
import {GoogleCharts} from 'google-charts';
declare var google: any;
@Directive({
  selector: '[appGaugeChart]'
})
export class GaugeChartDirective implements OnChanges{

   @Input('') appGaugeChartConfig: any;
  constructor(private elRef: ElementRef) {}
 
  ngOnInit() {
    debugger;

      //console.log("appconfig", this.appGaugeChartConfig);
      GoogleCharts.load('current', { 'packages': ['corechart', 'gauge'] });
   

} 

ngOnChanges(changes: SimpleChanges){

    setTimeout(() => {
        GoogleCharts.load('current', { 'packages': ['corechart', 'gauge'] });
        GoogleCharts.setOnLoadCallback(this.drawChart(this.appGaugeChartConfig.ChartConfiguration,
            this.appGaugeChartConfig.moduleData));
  }, 100);

 
}

    private drawChart(ChartConfiguration, moduleData1): any {
        debugger;       
        if (moduleData1.length != 0) {
            GoogleCharts.load('current', { 'packages': ['corechart', 'gauge'] });
            var data = new GoogleCharts.api.visualization.DataTable(moduleData1);
            var data = GoogleCharts.api.visualization.arrayToDataTable([
                ['Label', 'Value'],
                ['Memory', 80]
                //    ['CPU', 55],
                //     ['Network', 68]
            ]);

            /* 
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
                    }
                    //console.log(temp);
                }
                data.addRow([temp][0]);

            } 
            */
            //Generalization implementation

            var options = {
                //generic properties
                //           title: ChartConfiguration.Title,
                height: ChartConfiguration.Height,
                width: ChartConfiguration.Width,
                titleTextStyle: { color: 'black', fontName: 'Arial', fontSize: 16 },
                colors: Array.from(ChartConfiguration.ColorsRGB),
                chartArea: { left: "30px", top: "30px", width: "80%", height: "65%" },
                //chartArea: {
                //    left: ChartConfiguration.ChartAreaLeft, top: ChartConfiguration.ChartAreaTop,
                //    width: ChartConfiguration.ChartAreaWidth, height: ChartConfiguration.Height
                //},
                legend: { position: ChartConfiguration.LegendPosition },
                tooltip: { trigger: ChartConfiguration.ToolTipTrigger },
                animation: {
                    duration: ChartConfiguration.AnimationDuration,
                    easing: ChartConfiguration.AnimationEasing,
                    startup: ChartConfiguration.AnimationStartup
                },
                // specific properties
                min: ChartConfiguration.Min,
                max: ChartConfiguration.Max,
                greenFrom: ChartConfiguration.GreenFrom, greenTo: ChartConfiguration.GreenTo,
                redFrom: ChartConfiguration.RedFrom, redTo: ChartConfiguration.RedTo,
                yellowFrom: ChartConfiguration.YellowFrom, yellowTo: ChartConfiguration.YellowTo,
                minorTicks: ChartConfiguration.MinorTicks,

                vAxis: {
                    maxValue: ChartConfiguration.VAxisMaxValue,
                    minValue: ChartConfiguration.VAxisMinValue,
                    title: ChartConfiguration.VAxisTitle,
                    titleTextStyle:
                    {
                        color: ChartConfiguration.VAxisTitleColor
                    },
                    textStyle: { fontSize: 10 },
                    gridlines: {color: '#f5f5f5'},
                    minorGridlines:{color: '#f5f5f5'}
                },

                hAxis: {
                    title: ChartConfiguration.HAxisTitle,
                    titleTextStyle:
                    {
                        color: ChartConfiguration.HAxisTitleColor
                    },
                    textStyle: { fontSize: 10 },
                    gridlines: {color: '#f5f5f5'},
                    minorGridlines:{color: '#f5f5f5'}
                }

            }
            var chart = new GoogleCharts.api.visualization.Gauge(document.getElementById(this.elRef.nativeElement.id));
            chart.draw(data, options);

            setInterval(function () {
                data.setValue(0, 1, 40 + Math.round(60 * Math.random()));
                chart.draw(data, options);
            }, 13000);
        }
     }
}
