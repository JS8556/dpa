import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginService } from '../../app/services/login.service';
import { ObjStorageProvider } from '../../providers/obj-storage/obj-storage';
import { Dialogs } from '@ionic-native/dialogs';
import { Network } from '@ionic-native/network';

import { MainPage } from '../main/main';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private id:string = '';
  private user:any;
  constructor(public navCtrl: NavController, private loginService:LoginService, private dialogs:Dialogs, private network: Network, private storageProvider: ObjStorageProvider) {

  }

  login(id){
    this.id = id;

    console.log(this.isConnected());
    if (this.isConnected()) { // JE PRIPOJENI
      this.loginService.getUsers(this.id).subscribe(response => {
        console.log(response);
        this.user = response;
  
        if(this.user.id != null){     
          this.dialogs.confirm('Welcome ' + this.user.name + ' ' + this.user.surname, 'Confirm', ['OK'])
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
        
        this.dialogs.confirm('Welcome ' + this.user.name + ' ' + this.user.surname, 'Confirm', ['OK'])
        .then(() => {
          console.log('OK ID');
          this.navCtrl.push(MainPage, {
            user:this.user
          });
        });

      });

      
    }   

  }


  isConnected(): boolean {
    let conntype = this.network.type;
    return conntype && conntype !== 'unknown' && conntype !== 'none';
  }

}
