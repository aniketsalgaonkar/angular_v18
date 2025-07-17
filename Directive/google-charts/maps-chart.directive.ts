
  import { Directive, ElementRef, OnChanges, SimpleChanges, HostListener, Input, OnInit } from '@angular/core';
import { getMaxListeners } from 'process';
import{GoogleCharts} from 'google-charts';
declare var google: any;
@Directive({
    selector: '[appMapsChart]'
})
export class MapsChartDirective implements OnChanges {

    @Input('') appMapsChartConfig: any;
    @Input('') appMapsChartDT: any;
    public chart: any;
    constructor(private elRef: ElementRef) { }
   

    ngOnInit() {
        // Load the Visualization API and the columnchart package.
// @ts-ignore TODO(jpoehnelt) update to newest visualization library
GoogleCharts.load("visualization", "1", { packages: ["columnchart"] });

    }

    ngOnChanges(changes: SimpleChanges) {
        debugger;

        setTimeout(() => {
            GoogleCharts.load('current', {
                'packages': ['columnchart'],
                // Note: Because markers require geocoding, you'll need a mapsApiKey.
                // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
                'mapsApiKey': 'AIzaSyDrKVDwwqOpH9NMy_xljgEkn5xMaTleVA0'
              });
           // google.maps.load({'mapsApiKey': 'AIzaSyDrKVDwwqOpH9NMy_xljgEkn5xMaTleVA0'});
            google.setOnLoadCallback(this.initMap());
        }, 5000);

    }

    initMap(){
        debugger;
        // The following path marks a path from Mt. Whitney, the highest point in the
        // continental United States to Badwater, Death Valley, the lowest point.
        const path = [
          { lat: 36.579, lng: -118.292 }, // Mt. Whitney
          { lat: 36.606, lng: -118.0638 }, // Lone Pine
          { lat: 36.433, lng: -117.951 }, // Owens Lake
          { lat: 36.588, lng: -116.943 }, // Beatty Junction
          { lat: 36.34, lng: -117.468 }, // Panama Mint Springs
          { lat: 36.24, lng: -116.832 },
        ]; // Badwater, Death Valley
      
        const map = new google.maps.Map(
          document.getElementById("map") as HTMLElement,
          {
            zoom: 8,
            center: path[1],
            mapTypeId: "terrain",
          }
        );
      
        // Create an ElevationService.
        const elevator = new google.maps.ElevationService();
      
        // Draw the path, using the Visualization API and the Elevation service.
        this.displayPathElevation(path, elevator, map);
      }

      displayPathElevation(
        path: google.maps.LatLngLiteral[],
        elevator: google.maps.ElevationService,
        map: google.maps.Map
      ) {
        // Display a polyline of the elevation path.
        new google.maps.Polyline({
          path: path,
          strokeColor: "#0000CC",
          strokeOpacity: 0.4,
          map: map,
        });
      
        // Create a PathElevationRequest object using this array.
        // Ask for 256 samples along that path.
        // Initiate the path request.
        // elevator.getElevationAlongPath({
        //     path: path,
        //     samples: 256,
        //   },null).then(plotElevation).catch((e) => {
        //     const chartDiv = document.getElementById(
        //       "elevation_chart"
        //     ) as HTMLElement;
      
        //     // Show the error code inside the chartDiv.
        //     chartDiv.innerHTML = "Cannot show elevation: request failed because " + e;
        //   });
      }
      // Takes an array of ElevationResult objects, draws the path on the map
// and plots the elevation profile on a Visualization API ColumnChart.
// plotElevation({ results }: google.maps.PathElevationResponse) {
//     const chartDiv = document.getElementById("elevation_chart") as HTMLElement;
  
//     // Create a new chart in the elevation_chart DIV.
//     const chart = new GoogleCharts.api.visualization.ColumnChart(chartDiv);
  
//     // Extract the data from which to populate the chart.
//     // Because the samples are equidistant, the 'Sample'
//     // column here does double duty as distance along the
//     // X axis.
//     const data = new GoogleCharts.api.visualization.DataTable();
  
//     data.addColumn("string", "Sample");
//     data.addColumn("number", "Elevation");
  
//     for (let i = 0; i < results.length; i++) {
//       data.addRow(["", results[i].elevation]);
//     }
  
//     // Draw the chart using the data within its DIV.
//     chart.draw(data, {
//       height: 150,
//       legend: "none",
//       // @ts-ignore TODO(jpoehnelt) update to newest visualization library
//       titleY: "Elevation (m)",
//     });
//   }

    public drawChart(ChartConfiguration, moduleData1, dT): any {
        debugger;
 
        var data: any;
        if (dT != null && dT != undefined) {
            GoogleCharts.load('current', {
                'packages': ['columnchart'],
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
                'packages': ['columnchart'],
                'mapsApiKey': 'AIzaSyDrKVDwwqOpH9NMy_xljgEkn5xMaTleVA0'
              });
            data = new GoogleCharts.api.visualization.DataTable(moduleData1);
            

               
               
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
                'packages': ['columnchart'],
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
