import { Component } from '@angular/core';
import { NavController, NavParams, ViewController  } from 'ionic-angular';
import { HomePage } from '../home/home';

import { ObjStorageProvider } from '../../providers/obj-storage/obj-storage';
import { Dialogs } from '@ionic-native/dialogs';
import { Network } from '@ionic-native/network';
import { WebDataProvider } from '../../providers/web-data/web-data';

@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html'
})
export class PopoverPage {

  constructor(public navCtrl: NavController, public params:NavParams, public viewCtrl: ViewController, private storageProvider: ObjStorageProvider, private WDProvider: WebDataProvider, private dialogs:Dialogs, private network: Network) {
    
  }

  logout(){
    this.viewCtrl.dismiss();
    this.navCtrl.setRoot(HomePage);
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