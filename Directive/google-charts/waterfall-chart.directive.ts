import { Directive, ElementRef, OnChanges, SimpleChanges, HostListener, Input, OnInit } from '@angular/core';
import {GoogleCharts} from 'google-charts';
declare var google: any;
@Directive({
    selector: '[appWaterfallChart]'
})
export class WaterfallChartDirective implements OnChanges {

    @Input('') appWaterfallChartConfig: any;
    constructor(private elRef: ElementRef) { }

    ngOnInit() {
        debugger;

        //console.log("appconfig", this.appWaterfallChartConfig);
        GoogleCharts.load("visualization", "1.1", { packages: ["corechart"] });


    }

    ngOnChanges(changes: SimpleChanges) {

        setTimeout(() => {
            GoogleCharts.load("visualization", "1.1", { packages: ["corechart"] });
            GoogleCharts.setOnLoadCallback(this.drawChart(this.appWaterfallChartConfig.ChartConfiguration,
                this.appWaterfallChartConfig.moduleData));
        }, 100);


    }

    private drawChart(ChartConfiguration, moduleData1): any {
        debugger;
        if (moduleData1.length != 0) {

            GoogleCharts.load('visualization', '1.1', { packages: ['current', 'corechart'] });
            //var data = new GoogleCharts.api.visualization.DataTable(moduleData1);
            var data = GoogleCharts.api.visualization.arrayToDataTable([
                ['Mon', 28, 28, 38, 38],
                ['Tue', 38, 38, 55, 55],
                ['Wed', 55, 55, 77, 77],
                ['Thu', 77, 77, 66, 66],
                ['Fri', 66, 66, 22, 22]
                // Treat the first row as data.
            ], true);
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
              for (var i = 1; i < moduleData1.length; i++) {
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
                title: ChartConfiguration.Title,
                titleTextStyle: { color: 'black', fontName: 'Arial', fontSize: 16 },
                height: ChartConfiguration.Height,
                width: ChartConfiguration.Width,
                colors: Array.from(ChartConfiguration.ColorsRGB),
                chartArea: { left: "30px", top: "30px", width: "80%", height: "65%" },
                //              chartArea: { left: ChartConfiguration.ChartAreaLeft, top: ChartConfiguration.ChartAreaTop, width: ChartConfiguration.ChartAreaWidth, height: ChartConfiguration.Height },
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
                },

                // specific properties
                risingColor: { strokeWidth: 0, fill: '#0f9d58' },   // green
                fallingColor: { strokeWidth: 0, fill: '#a52714' }, // red
                enableInteractivity: ChartConfiguration.EnableInteractivity,
                aggregationTarget: ChartConfiguration.AggregationTarget,
                bar: { groupWidth: ChartConfiguration.BarGroupWidth }
            };


            var chart = new GoogleCharts.api.visualization.CandlestickChart(document.getElementById(this.elRef.nativeElement.id));
            GoogleCharts.api.visualization.events.addListener(chart, 'ready', titleCenter);
            chart.draw(data, options);
        }
            function titleCenter() {
                $("text:contains(" + options.title + ")").attr({ 'x': '30%', 'y': '20' })
         }

    }
}
