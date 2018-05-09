import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-timechart',
  templateUrl: 'timechart.html'
})
export class TimechartPage {

  private data:any;
  private dataF:any;
  private order:any;
  chartOptions:any;

  constructor(public navCtrl: NavController, public params:NavParams) {
    this.data = params.get('data');
    this.order = params.get('order');
    this.dataF = [{
        x: Date.UTC(2014, 11, 8),
        x2: Date.UTC(2014, 11, 9),
        y: 0
    }, {
        x: Date.UTC(2014, 11, 10),
        x2: Date.UTC(2014, 11, 23),
        y: 0
    }]

    this.chartOptions = {
        chart: {
          type: 'xrange'
        },
        title: {
            text: 'Timeline graf'
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: ''
            },
            categories: [this.order.par1],
            reversed: true
        },
        series: [{
            name: 'Timeline',
            // pointPadding: 0,
            // groupPadding: 0,
            borderColor: 'gray',
            pointWidth: 20,
            data: this.data,
            dataLabels: {
                enabled: true
            }
        }]
      }

  }


}