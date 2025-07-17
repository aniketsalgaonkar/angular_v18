import { Directive, ElementRef, OnChanges, SimpleChanges, HostListener, Input, OnInit } from '@angular/core';
import{GoogleCharts} from 'google-charts';
declare var google: any;
@Directive({
    selector: '[appGanttChart]'
})
export class GanttChartDirective implements OnChanges {

    @Input('') appGanttChartConfig: any;
    @Input('') appGanttChartDT: any;
    public chart: any;
    constructor(private elRef: ElementRef) { }

    ngOnInit() {
        debugger;

        console.log("appconfig", this.appGanttChartConfig);
        GoogleCharts.load('current', {'packages':['gantt']});

    }

    ngOnChanges(changes: SimpleChanges) {

        setTimeout(() => {
            GoogleCharts.load('current', {'packages':['gantt']});
            GoogleCharts.setOnLoadCallback(this.drawChart(this.appGanttChartConfig.ChartConfiguration,
                this.appGanttChartConfig.moduleData, this.appGanttChartDT));
        }, 5000);

    }

    daysToMilliseconds(days) {
        return days * 24 * 60 * 60 * 1000;
      }

    public drawChart(ChartConfiguration, moduleData1, dT): any {
        debugger;
  
     /*
        data.addRows([
            ['Research', 'Find sources',
            new Date(2015, 0, 1), new Date(2015, 0, 5), null,  100,  null],
            ['Write', 'Write paper',
            null, new Date(2015, 0, 9), this.daysToMilliseconds(3), 25, 'Research,Outline'],
            ['Cite', 'Create bibliography',
            null, new Date(2015, 0, 7), this.daysToMilliseconds(1), 20, 'Research'],
            ['Complete', 'Hand in paper',
            null, new Date(2015, 0, 10), this.daysToMilliseconds(1), 0, 'Cite,Write'],
            ['Outline', 'Outline paper',
            null, new Date(2015, 0, 6), this.daysToMilliseconds(1), 100, 'Research']
        ]);
      */
      
        var data: any;
        if (dT != null && dT != undefined) {
            GoogleCharts.load('current', {'packages':['gantt']});
            data = new GoogleCharts.visualization.DataTable(dT.value);

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

            GoogleCharts.load('current', {'packages':['gantt']});
            data = new GoogleCharts.api.visualization.DataTable(moduleData1);
            
            data.addColumn('string', 'TaskID');
            data.addColumn('string', 'TaskName');
            data.addColumn('string', 'Resource');
            data.addColumn('date', 'StartDate');
            data.addColumn('date', 'EndDate');
            data.addColumn('number', 'Duration');
            data.addColumn('number', 'PercentComplete');
            data.addColumn('string', 'Dependencies');
               
            var addRowData = Object.keys(moduleData1[0]);

            var NewData: any;
            NewData = $(addRowData).each(function (i) {
                addRowData[i];
            }).get().join(',');

            var array = NewData.split(',');

          

            for (var i = 0; i < moduleData1.length; i++) {
                var temp = [];
                for (var j = 0; j < array.length; j++) {
                    if (j == 0 || j == 1 || j == 2 || j == 7) {
                        temp.push(moduleData1[i][array[j]]);
                    }
                    else if ( j==3 || j == 4 ){
                        var dateObj  = new Date(moduleData1[i][array[j]]) ; 
                        var month = dateObj.getMonth() + 1;
                        var day = dateObj.getDate() ;
                        var year = dateObj.getFullYear();
                        //  var shortDate = year + '/' + day + '/' + month;
                        //  temp.push(new Date(shortDate.toString()));
                        temp.push(new Date(year,month,day));
                    }
                    else if ( j==5 || j == 6 ) {
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

        }    //Generalization implementation         
        else  //in case of no records 
        {
            GoogleCharts.load('current', {'packages':['gantt']});
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
            series: {1: {type: 'line'}}
/*
            seriesType: ChartConfiguration.SeriesType,
            series: { ChartConfiguration.SeriesColumn : { type: ChartConfiguration.SeriesColumnType } }
*/
          };


          this.chart = new GoogleCharts.api.visualization.ChartWrapper({
            'containerId': document.getElementById(this.elRef.nativeElement.id),
            'chartType': 'Gantt',
            'dataTable': data,
            'options': { 
                width: 400,
                height: 240,
                title: 'Company Performance',
                vAxis: { title: 'Year', titleTextStyle: { color: 'red'}}
            },
        });
             //this.chart = new GoogleCharts.api.visualization.Gantt(document.getElementById(this.elRef.nativeElement.id));
             
             GoogleCharts.api.visualization.events.addListener(this.chart, 'animationfinish', titleCenter);
             GoogleCharts.api.visualization.events.addListener(this.chart, 'ready', titleCenter);
             enablePagination(this.chart, 10,this.appGanttChartConfig.moduleData, document.getElementById('prevButton'), document.getElementById('nextButton'));
             this.chart.draw(data, options);
  
            function titleCenter() {
                $("text:contains(" + options.title + ")").attr({ 'x': '30%', 'y': '20' })
             }

             function enablePagination(chart, ps,moduleData, prevButton, nextButton) 
        {
        
            var currentPage = -1;
            var pageSize = 10;
            prevButton = document.getElementById('prevButton');
            nextButton = document.getElementById('nextButton');

            // pad the datatable to have an exact number of pages, otherwise the bars' size in the
            // last page will be artificially increased
            //var dt = chart.getDataTable();
            var dt = data;
            console.log("gantt dt",data)
            // if (dt.getNumberOfRows() % pageSize != 0) {
            //     for (var i = pageSize - (dt.getNumberOfRows() % pageSize); i > 0; i--) {
            //         dt.addRow(['', 0]);
            //     }
            // }
            
            var paginate = function (dir) {
                alert(dir);
                var numRows = dt.getNumberOfRows();
                currentPage += dir;
                var rows = [];
                for (var i = pageSize * currentPage; i < pageSize * (currentPage + 1) && i < numRows; i++) {
                    rows.push(i);
                }
                chart.setView({ rows: rows });
                //chart.draw(data, options);
                //    this.chart.draw();
                currentPage == 0 ? prevButton.setAttribute('disabled', 'disabled') : prevButton.removeAttribute('disabled');
                currentPage == numRows / pageSize - 1 ? nextButton.setAttribute('disabled', 'disabled') : nextButton.removeAttribute('disabled');
            }
            prevButton.onclick = function () { paginate(-1) };
            nextButton.onclick = function () { paginate(1) };
            paginate(1);

        }
    }
   
}
