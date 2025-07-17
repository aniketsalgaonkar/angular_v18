// susan - added this service

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
//import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class ChartsService {
  private chartDataSubject = new Subject<any>();

  // Observable to subscribe to changes in chart data
  chartData$ = this.chartDataSubject.asObservable();

  updateChartData(configdata: any, data: any) {
    // Notify subscribers (like your directive) about the updated data
    this.chartDataSubject.next({ configdata, data });
  }
}
