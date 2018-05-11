import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { Dialogs } from '@ionic-native/dialogs';
import { QRScanner } from '@ionic-native/qr-scanner';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MainPage } from '../pages/main/main';
import { DetailsPage } from '../pages/details/details';
import { TimelinePage } from '../pages/timeline/timeline';
import { TimechartPage } from '../pages/timechart/timechart';
import { PopoverPage } from '../pages/popover/popover';

import { ChartModule } from 'angular2-highcharts';
import * as HighCharts from 'highcharts';
import * as HighchartsMore from 'highcharts-more';
import * as XRange from 'highcharts/modules/xrange';
import { ObjStorageProvider } from '../providers/obj-storage/obj-storage';
import { WebDataProvider } from '../providers/web-data/web-data';
HighchartsMore(HighCharts);
XRange(HighCharts);

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MainPage,
    DetailsPage,
    TimelinePage,
    TimechartPage,
    PopoverPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    ChartModule.forRoot(HighCharts, HighchartsMore, XRange),
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MainPage,
    DetailsPage,
    TimelinePage,
    TimechartPage,
    PopoverPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Dialogs,
    QRScanner,
    Network,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ObjStorageProvider,
    WebDataProvider
  ]
})
export class AppModule {}
