import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginService } from '../../app/services/login.service';
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
  constructor(public navCtrl: NavController, private loginService:LoginService, private dialogs:Dialogs, private network: Network, private storageProvider: ObjStorageProvider, private WDProvider: WebDataProvider) {

  }


  ionViewDidEnter(){
    this.storageProvider.getToSync().then((val:any) => {
      this.ordersSync = val;
      if(this.ordersSync.length > 0)
      {
        this.dialogs.alert('Unsynchronized data, wait for synchronization')
        .then(() => {
          console.log('Unsynchronized data');
          this.WDProvider.postUsersSync(this.ordersSync);
        });
        
      }
    });
  }

  login(id){
    this.id = id;

    console.log(this.isConnected());
    if (this.isConnected()) { // JE PRIPOJENI
      this.loginService.getUsers(this.id).subscribe(response => {
        console.log(response);
        this.user = response;
  
        if(this.user.id != null){     
          this.dialogs.confirm('Welcome ' + this.user.firstname + ' ' + this.user.surname, 'Confirm', ['OK'])
          .then(() => {
            console.log('OK ID');
            this.navCtrl.push(MainPage, {
              user:this.user
            });
          });
        }else{
          this.dialogs.alert('ID not found')
          .then(() => console.log('Wrong ID'));
        }
  
      });
    }
    else{
      // NENI PRIPOJENI
      this.storageProvider.getObj(this.id).then((val:any) => {
        console.log(val);
        this.user = val;
        
        this.dialogs.confirm('Welcome ' + this.user.firstname + ' ' + this.user.surname, 'Confirm', ['OK'])
        .then(() => {
          console.log('OK ID');
          this.navCtrl.push(MainPage, {
            user:this.user
          });
        });

      });

      
    }   

  }

  login1(id){
    if(this.isConnected()){
      this.WDProvider.getUser(id)
      .then(data => {
        this.user = data;
        console.log(this.user);
        this.dialogs.confirm('Welcome ' + this.user.name + ' ' + this.user.surname, 'Confirm', ['OK'])
        .then(() => {
          console.log('OK ID');
          this.navCtrl.push(MainPage, {
            user:this.user
          });
        });
      });
    }else{
      this.dialogs.alert('No network connection')
      .then(() => console.log('No network connection'));
    }

    
  }

  login2(){
    this.user = JSON.parse('{ "id": 1, "firstname": "Jaja", "surname": "Maly", "orders": [] }');
  }

  isConnected(): boolean {
    let conntype = this.network.type;
    return conntype && conntype !== 'unknown' && conntype !== 'none';
  }

}
