import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { Dialogs } from '@ionic-native/dialogs';
import { QRScanner } from '@ionic-native/qr-scanner';
import { HttpModule } from '@angular/http';
import { LoginService } from './services/login.service'

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MainPage } from '../pages/main/main';
import { DetailsPage } from '../pages/details/details';
import { TimelinePage } from '../pages/timeline/timeline';
import { TimechartPage } from '../pages/timechart/timechart';

import { ChartModule } from 'angular2-highcharts';
import * as HighCharts from 'highcharts';
import * as HighchartsMore from 'highcharts-more';
import * as XRange from 'highcharts/modules/xrange';
HighchartsMore(HighCharts);
XRange(HighCharts);

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MainPage,
    DetailsPage,
    TimelinePage,
    TimechartPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ChartModule.forRoot(HighCharts, HighchartsMore, XRange),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MainPage,
    DetailsPage,
    TimelinePage,
    TimechartPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Dialogs,
    QRScanner,
    LoginService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
