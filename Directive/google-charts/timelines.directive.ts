import { Directive, ElementRef, OnChanges, SimpleChanges, HostListener, Input, OnInit } from '@angular/core';
import { ChartsService } from '../Services/charts.service';
import { GoogleCharts } from 'google-charts';
declare var google: any;
@Directive({
    selector: '[appTimelines]'
})
export class TimelinesDirective implements OnChanges {
    @Input('') chartData: any;
    @Input('') appTimelinesConfig: any;
    @Input('') appTimelinesDT: any;
    public chart: any;
    constructor(private elRef: ElementRef,
        private chartsService: ChartsService) {
      }
 
    ngOnInit() {
        debugger;
 
        console.log("appconfig", this.appTimelinesConfig);
        GoogleCharts.load('current', {'packages':['timeline']});
 
        // Subscribe to the chart data updates
        this.chartsService.chartData$.subscribe(({ configdata, data }) => {
            // Redraw the chart with the updated data
            this.drawChart(configdata, data, null);
        });
    }
 
    ngOnChanges(changes: SimpleChanges) {
        if (changes.chartData && this.chartData) {
            setTimeout(() => {
                // GoogleCharts.load('current', { 'packages': ['timeline'] });
                // GoogleCharts.setOnLoadCallback(this.drawChart(this.appTimelinesConfig.ChartConfiguration,
                //     this.appTimelinesConfig.moduleData, this.appTimelinesDT));
                // Load the Google Charts library
                GoogleCharts.load('current', {
                    packages: ['corechart'],
                    callback: () => {
                    // This callback function ensures the chart is drawn after loading the Google Charts library
                    this.drawChart(this.appTimelinesConfig.ChartConfiguration, this.appTimelinesConfig.moduleData, this.appTimelinesDT);
                    }
                });
            }, 5000);
        }
    }
 
    daysToMilliseconds(days) {
        return days * 24 * 60 * 60 * 1000;
      }
 
    public drawChart(ChartConfiguration, moduleData1, dT): any {
        debugger;
 
     
        var data: any;
        if (dT != null && dT != undefined) {
            GoogleCharts.load('current', {'packages':['timeline']});
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
            
            moduleData1.forEach(
                (item: any) =>
                {    
                    delete item['ID'];
                });

            GoogleCharts.load('current', {'packages':['timeline']});
            data = new GoogleCharts.api.visualization.DataTable(moduleData1);
           
           
            // data.addColumn('string', 'Position');
            // data.addColumn('string','Name');
            // data.addColumn('date', 'Start');
            // data.addColumn('date','End');
 
            data.addColumn({ type: 'string', id: 'Position' });
            data.addColumn({ type: 'string', id: 'Name' });
            data.addColumn({ type: 'date', id: 'Start' });
            data.addColumn({ type: 'date', id: 'End' });
            // data.addRows([
            //   [ 'President', 'George Washington', new Date(1789, 3, 30), new Date(1797, 2, 4) ],
            //   [ 'President', 'John Adams', new Date(1797, 2, 4), new Date(1801, 2, 4) ],
            //   [ 'President', 'Thomas Jefferson', new Date(1801, 2, 4), new Date(1809, 2, 4) ],
            //   [ 'Vice President', 'John Adams', new Date(1789, 3, 21), new Date(1797, 2, 4)],
            //   [ 'Vice President', 'Thomas Jefferson', new Date(1797, 2, 4), new Date(1801, 2, 4)],
            //   [ 'Vice President', 'Aaron Burr', new Date(1801, 2, 4), new Date(1805, 2, 4)],
            //   [ 'Vice President', 'George Clinton', new Date(1805, 2, 4), new Date(1812, 3, 20)],
            //   [ 'Secretary of State', 'John Jay', new Date(1789, 8, 25), new Date(1790, 2, 22)],
            //   [ 'Secretary of State', 'Thomas Jefferson', new Date(1790, 2, 22), new Date(1793, 11, 31)],
            //   [ 'Secretary of State', 'Edmund Randolph', new Date(1794, 0, 2), new Date(1795, 7, 20)],
            //   [ 'Secretary of State', 'Timothy Pickering', new Date(1795, 7, 20), new Date(1800, 4, 12)],
            //   [ 'Secretary of State', 'Charles Lee', new Date(1800, 4, 13), new Date(1800, 5, 5)],
            //   [ 'Secretary of State', 'John Marshall', new Date(1800, 5, 13), new Date(1801, 2, 4)],
            //   [ 'Secretary of State', 'Levi Lincoln', new Date(1801, 2, 5), new Date(1801, 4, 1)],
            //   [ 'Secretary of State', 'James Madison', new Date(1801, 4, 2), new Date(1809, 2, 3)]
            // ]);
               
            var addRowData = Object.keys(moduleData1[0]);
 
            var NewData: any;
            NewData = $(addRowData).each(function (i) {
                addRowData[i];
            }).get().join(',');
 
            var array = NewData.split(',');
            console.log("Newdata",NewData);
            console.log("Array",array)
            console.log("Moduledata",moduleData1);
            console.log("data",data);
           
            if(moduleData1.length>0)
            {
                

                moduleData1.forEach(element => {
                    let row=[];
                    for(i=0;i<array.length;i++)
                    {
                        let columnName=array[i];
                       
                         if ( i== 2 || i == 3 ){
                                        var dateObj  = new Date(element[columnName]) ;
                                        var month = dateObj.getMonth();
                                        var day = dateObj.getDate() ;
                                        var year = dateObj.getFullYear();
                                        var hour= dateObj.getHours();
                                        var minutes= dateObj.getMinutes();
                                        var seconds= dateObj.getSeconds();
                                        var milliseconds=dateObj.getMilliseconds();
                                        //  var shortDate = year + '/' + day + '/' + month;
                                        //  temp.push(new Date(shortDate.toString()));
                                        row.push(new Date(year,month,day,hour,minutes,seconds,milliseconds));
                         }
                         else
                         {
                            row.push(element[columnName]);
                         }
 
                    }
                   
                    data.addRow(row);
                });
            }
   
            console.log("data",data);
            // for (var i = 0; i < moduleData1.length; i++) {
            //     var temp = [];
            //     for (var j = 0; j < array.length; j++) {
            //         if (j == 0 || j == 1) {
            //             temp.push(moduleData1[i][array[j]]);
            //         }
            //         else if ( j==2 || j == 3 ){
            //             var dateObj  = new Date(moduleData1[i][array[j]]) ;
            //             var month = dateObj.getMonth();
            //             var day = dateObj.getDate() ;
            //             var year = dateObj.getFullYear();
            //             //  var shortDate = year + '/' + day + '/' + month;
            //             //  temp.push(new Date(shortDate.toString()));
            //             temp.push(new Date(year,month,day));
            //         }
            //         else if (ChartConfiguration.Annotation == 'true')
            //         {
            //            temp.push(String(moduleData1[i][array[j]]));
            //         }
            //         console.log(temp);
            //     }
            //     data.addRow([temp][0]);
 
            // }
           
 
        }    //Generalization implementation        
        else  //in case of no records
        {
            GoogleCharts.load('current', {'packages':['timeline']});
            data = new GoogleCharts.api.visualization.arrayToDataTable([
                ['', { role: 'annotation' }],
                ['', '']
            //     data.addColumn({ type: 'string', id: 'Position' }),
            // data.addColumn({ type: 'string', id: 'Name' }),
            // data.addColumn({ type: 'date', id: 'Start' }),
            // data.addColumn({ type: 'date', id: 'End' }),
            // data.addRows([
            //   [ 'President', 'George Washington', new Date(1789, 3, 30), new Date(1797, 2, 4) ],
            //   [ 'President', 'John Adams', new Date(1797, 2, 4), new Date(1801, 2, 4) ],
            //   [ 'President', 'Thomas Jefferson', new Date(1801, 2, 4), new Date(1809, 2, 4) ],
            //   [ 'Vice President', 'John Adams', new Date(1789, 3, 21), new Date(1797, 2, 4)],
            //   [ 'Vice President', 'Thomas Jefferson', new Date(1797, 2, 4), new Date(1801, 2, 4)],
            //   [ 'Vice President', 'Aaron Burr', new Date(1801, 2, 4), new Date(1805, 2, 4)],
            //   [ 'Vice President', 'George Clinton', new Date(1805, 2, 4), new Date(1812, 3, 20)],
            //   [ 'Secretary of State', 'John Jay', new Date(1789, 8, 25), new Date(1790, 2, 22)],
            //   [ 'Secretary of State', 'Thomas Jefferson', new Date(1790, 2, 22), new Date(1793, 11, 31)],
            //   [ 'Secretary of State', 'Edmund Randolph', new Date(1794, 0, 2), new Date(1795, 7, 20)],
            //   [ 'Secretary of State', 'Timothy Pickering', new Date(1795, 7, 20), new Date(1800, 4, 12)],
            //   [ 'Secretary of State', 'Charles Lee', new Date(1800, 4, 13), new Date(1800, 5, 5)],
            //   [ 'Secretary of State', 'John Marshall', new Date(1800, 5, 13), new Date(1801, 2, 4)],
            //   [ 'Secretary of State', 'Levi Lincoln', new Date(1801, 2, 5), new Date(1801, 4, 1)],
            //   [ 'Secretary of State', 'James Madison', new Date(1801, 4, 2), new Date(1809, 2, 3)]
            // ])
        ]);
           
        }
   
        var options = {
            //generic properties
            title: ChartConfiguration.Title,
           
            titleTextStyle: { color: 'black', fontName: 'Arial', fontSize: 16 },
            height: ChartConfiguration.Height,
            width: data.getNumberOfRows() * 50,
            colors: Array.from(ChartConfiguration.ColorsRGB),
    /*        chartArea: { left: "0px", top: "0px", width: "80%", height: "80%" },
            //chartArea: { left: ChartConfiguration.ChartAreaLeft, top: ChartConfiguration.ChartAreaTop, width: ChartConfiguration.ChartAreaWidth, height: ChartConfiguration.Height },
            legend: { position: ChartConfiguration.LegendPosition },  */
            chartArea: {
                left: ChartConfiguration.ChartAreaLeft, top: ChartConfiguration.ChartAreaTop,
                width: ChartConfiguration.ChartAreaWidth, height: ChartConfiguration.ChartAreaHeight
            },
            legend: {
                position: ChartConfiguration.LegendPosition,
                maxLines: ChartConfiguration.LegendMaxLines,
                alignment: ChartConfiguration.LegendAlignment,
                textStyle: {
                    color: ChartConfiguration.LegendTextStyleColor,
                    fontSize: ChartConfiguration.LegendTextStyleFontSize,
                }
            },
 
 
 
 
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
                },
 
                    //   days: {format: ['MMM dd']},
                    //   hours: {format: ['HH:mm', 'ha']}
                    //   format : 'medium'
                 
                 
                    format : 'MMM d HH:mm',
                   
                 
                // format :'yyyy-MM-dd HH:mm:ss Z'
               
            },
 
            // specific properties
            enableInteractivity: ChartConfiguration.EnableInteractivity,
            isStacked: ChartConfiguration.isStacked,
            dataOpacity: 1.0,
            bar: { groupWidth: ChartConfiguration.BarGroupWidth },
 
            seriesType: 'bars',
            series: {1: {type: 'line'}},
/*
            seriesType: ChartConfiguration.SeriesType,
            series: { ChartConfiguration.SeriesColumn : { type: ChartConfiguration.SeriesColumnType } }
*/
            timeline: {showRowLabels: true,tooltipDateFormat: 'MMM d y  h:mma' }
 
            // colorByRowLabel: true,
 
           
           
          };
 
             this.chart = new GoogleCharts.api.visualization.Timeline(document.getElementById(this.elRef.nativeElement.id));
             GoogleCharts.api.visualization.events.addListener(this.chart, 'animationfinish', titleCenter);
             GoogleCharts.api.visualization.events.addListener(this.chart, 'ready', titleCenter);
             this.chart.draw(data, options);
 
            function titleCenter() {
                $("text:contains(" + options.title + ")").attr({ 'x': '30%', 'y': '20' })
             }
    }
}