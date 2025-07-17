import { Directive , ElementRef,OnChanges,SimpleChanges, HostListener, Input, OnInit} from '@angular/core';
//declare var google: any;
import {GoogleCharts} from 'google-charts'
@Directive({
    selector: '[appColumnChartFilter]'
})
export class ColumnChartFilterDirective implements OnChanges {

    @Input('') appColumnChartFilterConfig: any;               
    @Input('') appColumnChartFilterDT: any;
    public chart: any;
    constructor(private elRef: ElementRef) { }

    ngOnInit() {
        debugger;

        //console.log("appconfig", this.appColumnChartFilterConfig);
       // google.charts.load('current', {'packages':['corechart', 'wordtree','controls']});
    //    GoogleCharts.load('50', {'packages':['corechart', 'wordtree','controls']});
    GoogleCharts.load("visualization", "1.1", { packages: ["corechart"] });

    }

    ngOnChanges(changes: SimpleChanges) {
        setTimeout(() => {
          //  google.charts.load('current', {'packages':['corechart', 'wordtree','controls']});
        //   GoogleCharts.load('50', {'packages':['corechart', 'wordtree','controls']});
        GoogleCharts.load("visualization", "1.1", { packages: ["corechart"] });
          GoogleCharts.api.setOnLoadCallback(this.drawChart(this.appColumnChartFilterConfig.ChartConfiguration,
                this.appColumnChartFilterConfig.moduleData, this.appColumnChartFilterDT));
        }, 100);
  
    }

    public drawChart(ChartConfiguration, moduleData1, dT): any {
        debugger;

        var data: any;
        if (dT != null && dT != undefined) {
            // GoogleCharts.load('50', {'packages':['corechart', 'wordtree','controls']});
            GoogleCharts.load("visualization", "1.1", { packages: ["corechart"] });
            data = new GoogleCharts.api.visualization.DataTable(dT.value);
            var addRowData = Object.keys(dT.value[0]);



            var NewData: any;
            NewData = $(addRowData).each(function (i) {
                addRowData[i];
            }).get().join(',');

            var array = NewData.split(',');
            for (var i = 0; i < Object.keys(dT.value[0]).length; i++) {

               
                if (i == 0 ) {
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

            //google.charts.load('current', {'packages':['corechart', 'wordtree','controls']});
            // GoogleCharts.load('50', {'packages':['corechart', 'wordtree','controls']});
            GoogleCharts.load("visualization", "1.1", { packages: ["corechart"] });
            data = new GoogleCharts.api.visualization.DataTable(moduleData1);
            var addRowData = Object.keys(moduleData1[0]);
            var NewData: any;
            NewData = $(addRowData).each(function (i) {
                addRowData[i];
            }).get().join(',');

            var array = NewData.split(',');
            //susan added start 
            var cN : number = -1 ; 
            cN = (Object.keys(moduleData1[0])[0]).search("Date"); 
            for (var i = 0; i < Object.keys(moduleData1[0]).length; i++) {
            
            
                if ((i == 0 )&& ( cN >= 0 )) {
                    data.addColumn("date", Object.keys(moduleData1[0])[i]);
                    cN = -1 ; 
                }
                else if (i == 0 ) {
                    data.addColumn("string", Object.keys(moduleData1[0])[i]);
                 }
                else {
                    data.addColumn("number", Object.keys(moduleData1[0])[i]);                    
                    if (ChartConfiguration.Annotation == 'true')
                    {
                    data.addColumn({type:'string', role:'annotation'}); // annotation role col.
                    }
               }              
         
            
               /*
                if (i == 0) {
                    data.addColumn("string", Object.keys(moduleData1[0])[i]);

                }
                else {
                    data.addColumn("number", Object.keys(moduleData1[0])[i]);
                }
                */
                //susan end 
            }

 
            for (var i = 0; i < moduleData1.length; i++) {
                var temp = [];
                cN = -1  ;
                cN = (Object.keys(moduleData1[i])[0]).search("Date"); 
                for (var j = 0; j < array.length; j++) {
                    if ((j == 0) && ( cN >= 0 )){
                         var dateObj  = new Date(moduleData1[i][array[0]]) ; 
                         var month = dateObj.getMonth() + 1;
                         var day = dateObj.getDate() ;
                         var year = dateObj.getFullYear();
                         var shortDate = year + '/' + day + '/' + month;
                         temp.push(new Date(shortDate.toString()));
                         cN = -1 ; 
                     } 
                    else 
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
                    //console.log(temp);
                }

                data.addRow([temp][0]);
            }
            
            //Generalization implementation
        }
        else  //in case of no records 
        {
            // GoogleCharts.load('50', {'packages':['corechart', 'wordtree','controls']});
            GoogleCharts.load("visualization", "1.1", { packages: ["corechart"] });
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
            chartArea: { left: "10px", top: "10px", width: "60%", height: "70%" },
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
              /*  titleTextStyle:
                {
                    color: ChartConfiguration.VAxisTitleColor
                } */
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

           // trendlines : { 0:{}},

        
            trendlines: {
                0: {
                  type: 'linear',
                  pointSize: 2,
                  color: 'blue',
                  pointsVisible: true,
                  visibleInLegend: true,
                  opacity: 0.5              
                  }
              },
             

            // specific properties
            enableInteractivity: ChartConfiguration.EnableInteractivity,
            isStacked: ChartConfiguration.isStacked,
            dataOpacity: 1.0,
            bar: { groupWidth: ChartConfiguration.BarGroupWidth }
        };

        /*
        var chart = new google.visualization.ChartWrapper({
            chartType: 'ColumnChart',
            containerId: 'chart_div',
            options: {
                theme: 'maximized'
            }
            });
            */
        var chart = new GoogleCharts.api.visualization.ChartWrapper({
            chartType: ChartConfiguration.ChartType,
            containerId:  ChartConfiguration.ChartContainerId,
            options : {
                //generic properties
                title: ChartConfiguration.Title,
                titleTextStyle: { color: 'black', fontName: 'Arial', fontSize: 16 },
                height: ChartConfiguration.Height,
                width: ChartConfiguration.Width,
                colors: Array.from(ChartConfiguration.ColorsRGB),
                chartArea: { left: "10px", top: "10px", width: "60%", height: "70%" },
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
                    }
                },
    
                hAxis: {
                    title: ChartConfiguration.HAxisTitle,
                    titleTextStyle:
                    {
                        color: ChartConfiguration.HAxisTitleColor
                    }
                },
    
               // trendlines : { 0:{}},
    
            
                trendlines: {
                    0: {
                      type: 'linear',
                      pointSize: 2,
                      color: 'blue',
                      pointsVisible: true,
                      visibleInLegend: true,
                      opacity: 0.5              
                      }
                  },
                 
    
                // specific properties
                enableInteractivity: ChartConfiguration.EnableInteractivity,
                isStacked: ChartConfiguration.isStacked,
                dataOpacity: 1.0,
                bar: { groupWidth: ChartConfiguration.BarGroupWidth }
            }
            /*options: {
                theme: ChartConfiguration.ChartTheme
            }*/

            });

        /*
        var control = new google.visualization.ControlWrapper({
            controlType: 'ChartRangeFilter',
            //controlType: 'DateRangeFilter',
            containerId: 'control_div',
            options: {
                filterColumnIndex: 0
               // filterColumnLabel: 'Date',
                            //  ui : {'label': 'Date Range'}
            }
            });
        */
        var control = new GoogleCharts.api.visualization.ControlWrapper({
            controlType: ChartConfiguration.ControlType,
            //controlType: 'DateRangeFilter',
            containerId: ChartConfiguration.ControlContainerId,
            options: {
                filterColumnIndex: ChartConfiguration.FilterColumnIndex
                // filterColumnLabel: 'Date',
                            //  ui : {'label': 'Date Range'}
            }
            });

        var dashboard = new GoogleCharts.api.visualization.Dashboard(document.getElementById(this.elRef.nativeElement.id));
        // GoogleCharts.api.visualization.events.addListener(dashboard, 'animationfinish', titleCenter);
        // GoogleCharts.api.visualization.events.addListener(dashboard, 'ready', titleCenter);
        dashboard.bind([control], [chart]);  
        dashboard.draw(data, options);


        // function titleCenter() {
        //         $("text:contains(" + options.title + ")").attr({ 'x': '30%', 'y': '20' })
        //     }
    }
}
 