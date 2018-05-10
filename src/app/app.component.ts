import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ObjStorageProvider } from '../providers/obj-storage/obj-storage';
import { Dialogs } from '@ionic-native/dialogs';
import { Network } from '@ionic-native/network';
import { WebDataProvider } from '../providers/web-data/web-data';

import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private network: Network, private storageProvider: ObjStorageProvider, private WDProvider: WebDataProvider, private dialogs:Dialogs) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      let disconnectSubscription = network.onDisconnect().subscribe(() => {
        console.log('network was disconnected :-(');
        this.dialogs.alert('Síť nenalezena, pracujete v offline režimu')
          .then(() => {
              

            });
      });
      let connectSubscription = network.onConnect().subscribe(() => {
        console.log('network connected!');
        // We just got a connection but we need to wait briefly
         // before we determine the connection type. Might need to wait.
        // prior to doing any api requests as well.
        this.dialogs.alert('Síť nalezena, pracujete v online režimu')
          .then(() => {
            setTimeout(() => {
              if (network.type === 'wifi') {
                console.log('we got a wifi connection, woohoo!');
                this.synchronize();
              }
            }, 3000);

            });
        
      });
    });
  }

  synchronize(){
    if(this.isConnected()){
        this.storageProvider.getToSync().then((val:any) => {
            let ordersSync = val;
            if(ordersSync.length > 0)
            {
              this.dialogs.alert('Nesynchronizovaná data, počkejte na synchronizaci')
              .then(() => {
                  console.log('Unsynchronized data');
                  this.WDProvider.postUsersSync(ordersSync);
                });
              
            }else{
              this.dialogs.alert('Žádná data k synchronizaci')
              .then(() => {
                  console.log('No sync data');

                });
            }
          });
    }else{
        this.dialogs.alert('Síť nenalezena')
        .then(() => {
            console.log('No network connection');
            
          });
    }
    
  }

  isConnected(): boolean {
    let conntype = this.network.type;
    return conntype && conntype !== 'unknown' && conntype !== 'none';
  }
}

