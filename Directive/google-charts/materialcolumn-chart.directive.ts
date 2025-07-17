import { Directive , ElementRef,OnChanges,SimpleChanges, HostListener, Input, OnInit} from '@angular/core';
import{GoogleCharts} from 'google-charts';
declare var google: any;
@Directive({
    selector: '[appMaterialColumnChart]'
})
export class MaterialColumnChartDirective implements OnChanges {

    @Input('') appMaterialColumnChartConfig: any;
    @Input('') appMaterialColumnChartDT: any;
    public chart: any;
    constructor(private elRef: ElementRef) { }

    ngOnInit() {
        debugger;

        //console.log("appMaterialColumnChartConfig", this.appMaterialColumnChartConfig);
        GoogleCharts.load('current', {'packages':['bar']});


    }

    ngOnChanges(changes: SimpleChanges) {

        setTimeout(() => {
            GoogleCharts.load('current', {'packages':['bar']});
            GoogleCharts.setOnLoadCallback(this.drawChart(this.appMaterialColumnChartConfig.ChartConfiguration,
                this.appMaterialColumnChartConfig.moduleData, this.appMaterialColumnChartDT));
        }, 100);
  
    }

    public drawChart(ChartConfiguration, moduleData1, dT): any {
        debugger;

        var data: any;
        if (dT != null && dT != undefined) {
            GoogleCharts.load('current', {'packages':['bar']});
            data = new GoogleCharts.api.visualization.DataTable(dT.value);

            /* var data = GoogleCharts.api.visualization.arrayToDataTable([
              ['Language', 'Speakers (in millions)'],
              ['German',  5.85],
              ['French',  1.66],
              ['Italian', 0.316],
              ['Romans', 0.0791]
            ]);
           */

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
                    //console.log(temp);
                }
                data.addRow([temp][0]);

            }
        }

        if ((moduleData1.length != 0) && (dT == null || dT == undefined)) {

            GoogleCharts.load('current', {'packages':['bar']});
            data = new GoogleCharts.api.visualization.DataTable(moduleData1);
            /* var data = GoogleCharts.api.visualization.arrayToDataTable([
              ['Language', 'Speakers (in millions)'],
              ['German',  5.85],
              ['French',  1.66],
              ['Italian', 0.316],
              ['Romans', 0.0791]
            ]);
           */

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
            //Generalization implementation
        }
        else  //in case of no records 
        {
            GoogleCharts.load('current', {'packages':['bar']}) ;
            data = new GoogleCharts.api.visualization.arrayToDataTable([
                ['', { role: 'annotation' }],
                ['', '']
            ]); 
        }

        var options = {
            //generic properties
            title: ChartConfiguration.Title,
            titleTextStyle: { color: 'black', fontName: 'Arial', fontSize: 16 },
            height: ChartConfiguration.Height,
            width: ChartConfiguration.Width,
            colors: Array.from(ChartConfiguration.ColorsRGB),
            chartArea: { left: "10px", top: "10px", width: "60%", height: "65%" },
            //  chartArea: { left: ChartConfiguration.ChartAreaLeft, top: ChartConfiguration.ChartAreaTop, width: ChartConfiguration.ChartAreaWidth, height: ChartConfiguration.Height },
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
                    minorGridlines:{color: '#f5f5f5'},
          
       
            series: {
                0: { axis: 'distance' }, // Bind series 0 to an axis named 'distance'.
                1: { axis: 'brightness' } // Bind series 1 to an axis named 'brightness'.
              },
             axes: {
                y: {
                  distance: {label: 'parsecs'}, // Left y-axis.
                  brightness: {side: 'right', label: 'apparent magnitude'} // Right y-axis.
                }
            }
           },
            // specific properties
            enableInteractivity: ChartConfiguration.EnableInteractivity,
            isStacked: ChartConfiguration.isStacked,
            dataOpacity: 1.0,
            bar: { groupWidth: ChartConfiguration.BarGroupWidth }
        };

        this.chart = new google.charts.Bar(document.getElementById(this.elRef.nativeElement.id));
        GoogleCharts.api.visualization.events.addListener(this.chart, 'animationfinish', titleCenter);
        GoogleCharts.api.visualization.events.addListener(this.chart, 'ready', titleCenter);
        this.chart.draw(data, google.charts.Bar.convertOptions(options));

        function titleCenter() {
            $("text:contains(" + options.title + ")").attr({ 'x': '30%', 'y': '20' })
        }

   
    }
}
 