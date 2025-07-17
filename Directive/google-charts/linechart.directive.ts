import { Directive, ElementRef, OnChanges, SimpleChanges, HostListener, Input, OnInit } from '@angular/core';
import{GoogleCharts} from 'google-charts';
declare var google: any;
@Directive({
    selector: '[appLineChart]',
    standalone:true
})
export class LineChartDirective implements OnChanges {

    @Input('') appLineChartConfig: any;
    @Input('') appLineChartDT: any;
    @Input('') chartData: any;
    @Input('') indexColumn?: any;
    public Chart: any;
    constructor(private elRef: ElementRef) { }

    ngOnInit() {
        debugger;
         GoogleCharts.load("visualization", "1.1", { packages: ["corechart"] });
     }

    ngOnChanges(changes: SimpleChanges) {
        if(changes['chartData'] && this.chartData) {

            setTimeout(() => {
                // GoogleCharts.load("visualization", "1.1", { packages: ["corechart"] });
                // GoogleCharts.setOnLoadCallback(this.drawChart(this.appLineChartConfig.ChartConfiguration,
                //     this.chartData, this.appLineChartDT));
                // Load the Google Charts library
                GoogleCharts.load('current', {
                    packages: ['corechart'],
                    callback: () => {
                    // This callback function ensures the chart is drawn after loading the Google Charts library
                    this.drawChart(this.appLineChartConfig.ChartConfiguration, this.chartData, this.appLineChartDT);
                    }
                });
            }, 100);
        }
  

    }

    public drawChart(ChartConfiguration, moduleData1, dT): any {
        debugger;
        /*
                var data = GoogleCharts.api.visualization.arrayToDataTable([
                    ['Year', 'Sales', 'Expenses'],
                    ['2004', 1000, 400],
                    ['2005', 1170, 460],
                    ['2006', 660, 1120],
                    ['2007', 1030, 540]
                ]);
                
         */

        var data: any;
        if (dT != null && dT != undefined) {
            GoogleCharts.load('visualization', '1.1', { packages: ['line', 'corechart'] });
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
       
                }
                data.addRow([temp][0]);
            }

        }


        if ((moduleData1.length != 0) && (dT == null||dT == undefined)) {

            GoogleCharts.load('visualization', '1.1', { packages: ['line', 'corechart'] });
            data = new GoogleCharts.api.visualization.DataTable(moduleData1);

            var addRowData = Object.keys(moduleData1[0]);

            var NewData: any;
            NewData = $(addRowData).each(function (i) {
                addRowData[i];
            }).get().join(',');

            var array = NewData.split(',');
            let index = -1;
            console.log(this.indexColumn)
            // Check if indexColumn is defined and exists in moduleData1[0]
            if (this.indexColumn != undefined && Object.keys(moduleData1[0]).includes(this.indexColumn)) {
                index = Object.keys(moduleData1[0]).indexOf(this.indexColumn);
                data.addColumn("string", this.indexColumn); // Add indexColumn as a string
            }

            // Loop through all keys in moduleData1[0] and add columns
            Object.keys(moduleData1[0]).forEach((key, i) => {
                // If it's the first column and indexColumn wasn't found, add as string
                if (i === 0 && index === -1) {
                    data.addColumn("string", key);
                } 
                // Otherwise, if it's not the indexColumn, add as number
                else if (key !== this.indexColumn) {
                    data.addColumn("number", key);
                }
            });

            // Adding rows with appropriate type handling
            for (var i = 0; i < moduleData1.length; i++) {
                var temp = [];

                // If indexColumn is present, the first value should be a string
                if (index != -1) {
                    temp.push(String(moduleData1[i][array[index]])); // Ensure it is treated as a string
                }

                for (var j = 0; j < array.length; j++) {
                    // If indexColumn is not present, the first value should be a string
                    if (j === 0 && index === -1) {
                        temp.push(String(moduleData1[i][array[j]])); // Ensure the first value is a string
                    }  
                    else if (j !== index) {
                        // Other values should be numbers
                        let value = Number(moduleData1[i][array[j]]);
                        
                        // If the value is not a valid number, handle the error
                        if (isNaN(value)) {
                            console.warn(`Value at row ${i}, column ${j} is not a valid number:`, moduleData1[i][array[j]]);
                            temp.push(null); // Push `null` for invalid numbers
                        } else {
                            temp.push(value); // Add valid numbers
                        }
                    }
                }

                // Add the row with the correct types (string for the first column and numbers for the rest)
                data.addRow(temp);
            }

            console.log(data, "Final Data for chart")
            
            // for (var i = 0; i < moduleData1.length; i++) {
            //     var temp = [];
            //     for (var j = 0; j < array.length; j++) {
            //         if (j == 0) {
            //             temp.push(moduleData1[i][array[j]]);
            //         }
            //         else {
            //             temp.push(Number(moduleData1[i][array[j]]));
            //         }


            //     }
            //     data.addRow([temp][0]);



            // }
            //console.log(data);
        }
            //Generalization implementation

        else  //in case of no records 
        {
            GoogleCharts.load('visualization', '1.1', { packages: ['line', 'corechart'] });
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
                chartArea: { left: 80, top: 10, width: "80%", height: "65%" },
                //  chartArea: { left: ChartConfiguration.ChartAreaLeft, top: ChartConfiguration.ChartAreaTop, width: ChartConfiguration.ChartAreaWidth, height: ChartConfiguration.Height },
                legend: { position: ChartConfiguration.LegendPosition },
                tooltip: { trigger: ChartConfiguration.ToolTipTrigger },
                animation: {
                    duration: ChartConfiguration.AnimationDuration,
                    easing: ChartConfiguration.AnimationEasing,
                    startup: ChartConfiguration.AnimationStartup
                },
                // specific properties
                selectionMode: ChartConfiguration.SelectionMode,
                aggregationTarget: ChartConfiguration.AggregationTarget,
                crosshair: {
                    trigger: ChartConfiguration.CrosshairTrigger,
                    orientation: ChartConfiguration.CrosshairOrientation,
                    color: ChartConfiguration.CrosshairColor,
                    opacity: 1.0
                },

                vAxis: {
                    maxValue: ChartConfiguration.VAxisMaxValue,
                    minValue: ChartConfiguration.VAxisMinValue,
                    title: ChartConfiguration.VAxisTitle,
                    // titleTextStyle:
                    // {
                    //     color: ChartConfiguration.VAxisTitleColor
                    // },
                    textStyle: { fontSize: 10 },
                    gridlines: {color: '#f5f5f5'},
                    minorGridlines:{color: '#f5f5f5'}
                },

                hAxis: {
                    title: ChartConfiguration.HAxisTitle,
                    // titleTextStyle:
                    // {
                    //     color: ChartConfiguration.HAxisTitleColor
                    // },
                    textStyle: { fontSize: 10 },
                    gridlines: {color: '#f5f5f5'},
                    minorGridlines:{color: '#f5f5f5'}
                }

            };
           
            this.Chart = new GoogleCharts.api.visualization.LineChart(document.getElementById(this.elRef.nativeElement.id));
            // GoogleCharts.api.visualization.events.addListener(this.Chart, 'animationfinish', titleCenter);
             this.Chart.draw(data, options);


        //    function titleCenter() {
        //     $("text:contains(" + options.title + ")").attr({ 'x': '35%', 'y': '30px' })
        // }
     }

}