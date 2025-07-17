
  import { Directive, ElementRef, OnChanges, SimpleChanges, HostListener, Input, OnInit } from '@angular/core';
import { getMaxListeners } from 'process';
import {GoogleCharts} from 'google-charts';

declare var google: any;
@Directive({
    selector: '[appGeoChart]'
})
export class GeoChartDirective implements OnChanges {

    @Input('') appGeoChartConfig: any;
    @Input('') appGeoChartDT: any;
    public chart: any;
    constructor(private elRef: ElementRef) { }

    ngOnInit() {
        debugger;

        console.log("appconfig", this.appGeoChartConfig);
        GoogleCharts.load('current', {
            'packages': ['geochart'],
            // Note: Because markers require geocoding, you'll need a mapsApiKey.
            // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
            'mapsApiKey': 'AIzaSyDrKVDwwqOpH9NMy_xljgEkn5xMaTleVA0'
          });

    }

    ngOnChanges(changes: SimpleChanges) {

        setTimeout(() => {
            GoogleCharts.load('current', {
                'packages': ['geochart'],
                // Note: Because markers require geocoding, you'll need a mapsApiKey.
                // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
                'mapsApiKey': 'AIzaSyDrKVDwwqOpH9NMy_xljgEkn5xMaTleVA0'
              });
              GoogleCharts.setOnLoadCallback(this.drawChart(this.appGeoChartConfig.ChartConfiguration,
                this.appGeoChartConfig.moduleData, this.appGeoChartDT));
        }, 5000);

    }

    daysToMilliseconds(days) {
        return days * 24 * 60 * 60 * 1000;
      }

    public drawChart(ChartConfiguration, moduleData1, dT): any {
        debugger;
 
        var data: any;
        if (dT != null && dT != undefined) {
            GoogleCharts.load('current', {
                'packages': ['geochart'],
                // Note: Because markers require geocoding, you'll need a mapsApiKey.
                // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
                'mapsApiKey': 'AIzaSyDrKVDwwqOpH9NMy_xljgEkn5xMaTleVA0'
              });
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
                        temp.push(moduleData1[i][array[j]]);
                    }
                    else if ( j==1 || j == 2 ) {
                        temp.push(Number(moduleData1[i][array[j]]));
                      }
                    else if (ChartConfiguration.Annotation == 'true')
                    {
                       temp.push(String(moduleData1[i][array[j]]));
                    }
                    console.log(temp);
                }
                data.addRow([temp][0]);

            }

        }

        if ((moduleData1.length != 0) && (dT == null || dT == undefined)) {

            GoogleCharts.load('current', {
                'packages': ['geochart'],
                // Note: Because markers require geocoding, you'll need a mapsApiKey.
                // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
                'mapsApiKey': 'AIzaSyDrKVDwwqOpH9NMy_xljgEkn5xMaTleVA0'
              });
            data = new GoogleCharts.api.visualization.DataTable(moduleData1);
            

            // to be commented 
            // var data = GoogleCharts.api.visualization.arrayToDataTable([
            //     ['City',   'Population', 'Area'],
            //     ['Rome',      2761477,    1285.31],
            //     ['Milan',     1324110,    181.76],
            //     ['Naples',    959574,     117.27]
            //   ]);
               
               
            var addRowData = Object.keys(moduleData1[0]);

            var NewData: any;
            NewData = $(addRowData).each(function (i) {
                addRowData[i];
            }).get().join(',');

            var array = NewData.split(',');
            for (var i = 0; i < Object.keys(moduleData1[0]).length; i++) {

                if (i == 0 ) {
                    data.addColumn("string", Object.keys(moduleData1[0])[i]);

                }
                else if ( i == 1 )
                {
                    data.addColumn("string", Object.keys(moduleData1[0])[i]);
                }
                else {

                    data.addColumn("number", Object.keys(moduleData1[0])[i]);

                }
            }

                

                var myArray:number[] = [];
                
            for (var i = 0; i < moduleData1.length; i++) {
                var temp = [];
                for (var j = 0; j < array.length; j++) {
                    if ( j == 0 ) {
                        temp.push(moduleData1[i][array[j]]);
                    }
                    else if (j==1)
                    {
                        temp.push(moduleData1[i][array[j]]);
                    }
                    else if (  j==2 || j == 3 ) {
                        temp.push(Number(moduleData1[i][array[j]]));
                         myArray.push(Number(moduleData1[i][array[3]]));
                      }
                    else if (ChartConfiguration.Annotation == 'true')
                    {
                       temp.push(String(moduleData1[i][array[j]]));
                    }
                    console.log(temp);
                }
                data.addRow([temp][0]);

            }

           

            

        }    //Generalization implementation         
        else  //in case of no records 
        {
            GoogleCharts.load('current', {
                'packages': ['geochart'],
                // Note: Because markers require geocoding, you'll need a mapsApiKey.
                // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
                'mapsApiKey': 'AIzaSyDrKVDwwqOpH9NMy_xljgEkn5xMaTleVA0'
              });
              data = new GoogleCharts.api.visualization.arrayToDataTable([
                ['', { role: 'annotation' }],
                ['', '']
            ]);
            // data = new GoogleCharts.api.visualization.arrayToDataTable([
            //     ['City',   'Population', 'Area'],
            //     ['Mumbai',      2761477,    1],
            //     ['Delhi',     1324110,    100],
            //     ['Chennai',    959574,     500]
            // ]);
        }

        const min = Math.min.apply(null,myArray);
        const max = Math.max.apply(null,myArray);
        // const max1 = myArray.reduce((op, item) => op = op > item ? op : item, 0);
        var options = {
            //generic properties
            title: ChartConfiguration.Title,
            titleTextStyle: { color: 'black', fontName: 'Arial', fontSize: 16 },
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
                titleTextStyle:
                {
                    color: ChartConfiguration.VAxisTitleColor
                }
            },

            hAxis: {
                title: ChartConfiguration.HAxisTitle,
                titleTextStyle:
                {
                    color: ChartConfiguration.HAxisTitleColor
                }
            },

            // specific properties
            enableInteractivity: ChartConfiguration.EnableInteractivity,
            isStacked: ChartConfiguration.isStacked,
            dataOpacity: 1.0,
            bar: { groupWidth: ChartConfiguration.BarGroupWidth },

            seriesType: 'bars',
            series: {1: {type: 'line'}},
            
            region: 'IN',
            sizeAxis: { minValue: min, maxValue: max },
            displayMode: 'markers',
            colorAxis: {colors: ['green','yellow','orange','red']},
        //     backgroundColor: '#81d4fa',
        //   datalessRegionColor: '#f8bbd0',
        //   defaultColor: '#f5f5f5',
        }

             this.chart = new GoogleCharts.api.visualization.GeoChart(document.getElementById(this.elRef.nativeElement.id));
             GoogleCharts.api.visualization.events.addListener(this.chart, 'animationfinish', titleCenter);
             GoogleCharts.api.visualization.events.addListener(this.chart, 'ready', titleCenter);
             this.chart.draw(data, options);
  
            function titleCenter() {
                $("text:contains(" + options.title + ")").attr({ 'x': '30%', 'y': '20' })
             }
    }
}
