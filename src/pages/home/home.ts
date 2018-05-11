import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ObjStorageProvider } from '../../providers/obj-storage/obj-storage';
import { Dialogs } from '@ionic-native/dialogs';
import { Network } from '@ionic-native/network';
import { WebDataProvider } from '../../providers/web-data/web-data';

import { MainPage } from '../main/main';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private id:string = '';
  private user:any;
  private ordersSync:any[];
  constructor(public navCtrl: NavController, private dialogs:Dialogs, private network: Network, private storageProvider: ObjStorageProvider, private WDProvider: WebDataProvider) {

  }


  ionViewDidEnter(){
    this.storageProvider.getToSync().then((val:any) => {
      this.ordersSync = val;
      if(this.ordersSync.length > 0)
      {
        this.dialogs.alert('Nesynchronizovaná data, počkejte na synchronizaci')
        .then(() => {
          console.log('Unsynchronized data');
          this.WDProvider.postUsersSync(this.ordersSync);
        });
        
      }
    });
  }

  login1(id){
    if(this.isConnected()){
      this.WDProvider.getUser(id)
      .then(data => {
        this.user = data;
        console.log(this.user);
        this.dialogs.confirm('Vítejte ' + this.user.firstname + ' ' + this.user.surname, 'Potvrdit', ['OK'])
        .then(() => {
          console.log('OK ID');
          this.navCtrl.push(MainPage, {
            user:this.user
          });
        });
      });
    }else{
      this.dialogs.alert('Síť nenalezena')
      .then(() => console.log('No network connection'));
    }

    
  }

  isConnected(): boolean {
    let conntype = this.network.type;
    return conntype && conntype !== 'unknown' && conntype !== 'none';
  }

}
