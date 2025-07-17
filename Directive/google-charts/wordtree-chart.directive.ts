import { Directive , ElementRef,OnChanges,SimpleChanges, HostListener, Input, OnInit} from '@angular/core';
import{GoogleCharts} from 'google-charts';
declare var google: any;
@Directive({
  selector: '[appWordtreeChart]'
})
export class WordtreeChartDirective implements OnChanges{

   @Input('') appWordtreeChartConfig: any;
  constructor(private elRef: ElementRef) {}
 
  ngOnInit() {
    debugger;

      //console.log("appconfig",this.appWordtreeChartConfig);
      GoogleCharts.load("visualization", "1.1", { packages: ["corechart"] });
   

} 

ngOnChanges(changes: SimpleChanges){

    setTimeout(() => {
        GoogleCharts.load('current', { packages: ['wordtree'] });
        GoogleCharts.setOnLoadCallback(this.drawChart(this.appWordtreeChartConfig.ChartConfiguration,
            this.appWordtreeChartConfig.moduleData));
  }, 100);

 
}

    private drawChart(ChartConfiguration, moduleData1): any {
        debugger;
        if (moduleData1.length != 0) {

            GoogleCharts.load('current', { packages: ['wordtree'] });
            var data = new GoogleCharts.api.visualization.DataTable(moduleData1);
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
        }   //Generalization implementation
        else  //in case of no records 
        {
            GoogleCharts.load('current', { packages: ['wordtree'] });
            data = new GoogleCharts.api.visualization.arrayToDataTable([
                ['', { role: 'annotation' }],
                ['', '']
            ]);
        }

      var options = {
          //generic properties
          chart: {
              title: ChartConfiguration.Title
          },
          titleTextStyle: { color: 'black', fontName: 'Arial', fontSize: 16 },
          height: ChartConfiguration.Height,
          width: ChartConfiguration.Width,
          colors: Array.from(ChartConfiguration.ColorsRGB),
          chartArea: { left: "30px", top: "30px", width: "80%", height: "65%" },
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
          Format: ChartConfiguration.Format,
          Type: ChartConfiguration.Type,
          Word: ChartConfiguration.Word
      };


      var chart = new GoogleCharts.api.visualization.WordTree(document.getElementById(this.elRef.nativeElement.id));
      GoogleCharts.api.visualization.events.addListener(chart, 'ready', titleCenter);
      chart.draw(data, options);

        function titleCenter() {
            $("text:contains(" + options.chart.title + ")").attr({ 'x': '30%', 'y': '20' })
        }
   }
}