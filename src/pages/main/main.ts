import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Dialogs } from '@ionic-native/dialogs';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { ObjStorageProvider } from '../../providers/obj-storage/obj-storage';


import { DetailsPage } from '../details/details';
import { TimelinePage } from '../timeline/timeline';

import { NgZone } from '@angular/core';

@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage {

  private user:any;
  private nameUser:any;
  private scan:any;
  private scanOrder:any;

  private zone:any;  

  constructor(public navCtrl: NavController, private dialogs:Dialogs, public params:NavParams, private qrScanner: QRScanner, private storageProvider: ObjStorageProvider) {
    this.user = params.get('user');
    this.nameUser = this.user.name + ' ' + this.user.surname;
    this.zone = new NgZone({ enableLongStackTrace: false });
  }

  detailsOrder(order){
    this.navCtrl.push(DetailsPage, {
      order:order
    });
  }

  timelineOrder(order){
    this.navCtrl.push(TimelinePage, {
      order:order,
      user:this.user
    });
  }

  scanCode(){

    
    // Optionally request the permission early
    this.qrScanner.prepare()
    .then((status: QRScannerStatus) => {
      if (status.authorized) {
        // camera permission was granted

        let ionApp = <HTMLElement>document.getElementsByTagName('ion-app')[0];
        // start scanning
        let scanSub = this.qrScanner.scan().subscribe((text: string) => {
          console.log('Scanned something', text);
          this.scan = text;
          this.scanOrder = JSON.parse(text);
          
          

          this.qrScanner.hide(); // hide camera preview
          scanSub.unsubscribe(); // stop scanning
          //ionApp.style.display = 'block';

          this.dialogs.confirm('Order: ' + this.scanOrder.par1 + ' ' + this.scanOrder.par2, 'Confirm', ['OK', 'Cancel'])
          .then((bId) => {
            if(bId == 1){
              this.zone.run(() => {
                this.user.orders.push(this.scanOrder);
                this.storageProvider.addObj(this.user.id, this.user);
              });
              
            }
          });

        });

        //ionApp.style.display = 'none';
        // show camera preview
        this.qrScanner.show();

        // wait for user to scan something, then the observable callback will be called

      } else if (status.denied) {
        // camera permission was permanently denied
        // you must use QRScanner.openSettings() method to guide the user to the settings page
        // then they can grant the permission from there
      } else {
        // permission was denied, but not permanently. You can ask for permission again at a later time.
      }
    })
    .catch((e: any) => console.log('Error is', e));

  }

  deleteOrder(order){
    alert('Deleting order'); 
    this.zone.run(() => {
      this.user.orders = this.user.orders.filter(obj => obj !== order);
    });
    this.storageProvider.deleteObj(this.user.id, this.user);
  }

}