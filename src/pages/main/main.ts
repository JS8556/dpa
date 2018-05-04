import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Dialogs } from '@ionic-native/dialogs';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { ObjStorageProvider } from '../../providers/obj-storage/obj-storage';
import { WebDataProvider } from '../../providers/web-data/web-data';
import { Network } from '@ionic-native/network';

import { DetailsPage } from '../details/details';
import { TimelinePage } from '../timeline/timeline';

import { NgZone } from '@angular/core';
import { PopoverController } from 'ionic-angular';
import { PopoverPage } from '../popover/popover'


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

  constructor(public navCtrl: NavController, private dialogs:Dialogs, public params:NavParams, private qrScanner: QRScanner, private storageProvider: ObjStorageProvider, private network: Network, private WDProvider: WebDataProvider, public popoverCtrl: PopoverController) {
    this.user = params.get('user');
    this.nameUser = this.user.firstname + ' ' + this.user.surname;
    this.zone = new NgZone({ enableLongStackTrace: false });
    this.setDateTimes();
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

          this.dialogs.confirm('Order: ' + this.scanOrder.name + ' ' + this.scanOrder.customer, 'Confirm', ['OK', 'Cancel'])
          .then((bId) => {
            if(bId == 1){
              //kontrola jestli uz zakazka neni zpracovavana uzivatelem
              let index = this.user.orders.findIndex(x => x.id == this.scanOrder.id);
              //pokud neni tak
              if(index > -1){
                this.zone.run(() => {
                  this.user.orders.push(this.scanOrder);
                  this.storageProvider.addObj(this.user.id, this.user);                
                });
  
                let orderProc = {
                  order_id: this.scanOrder.id,
                  user_id: this.user.id,
                  finished: 0,
                  displayed: 1,
                  timeS: [],
                  timeE: []
                };
                if(this.isConnected()){
                  this.WDProvider.postUser(orderProc);
                }else{
                  this.storageProvider.setToSync(orderProc);
                }
              }else{//pokuj ji uz uzivatel zpracovava
                this.dialogs.alert('You are already processing this order')
                .then(() => console.log('You are already processing this order'));
              }
              
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

    let orderProc = {
      order_id: this.scanOrder.id,
      user_id: this.user.id,
      finished: 0,
      displayed: 0,
      timeS: [],
      timeE: []
    };
    if(this.isConnected()){
      this.WDProvider.postUser(orderProc);
    }else{
      this.storageProvider.setToSync(orderProc);
    }
  }

  setDateTimes(){
    if(this.user.orders.length > 0){
      for (var index = 0; index < this.user.orders.length; index++) {
        let newTimeS: any[];
        let newTimeE: any[];
        newTimeS = [];
        newTimeE = [];
        for (var k = 0; k < this.user.orders[index].timeS.length; k++) {
          newTimeS.push(new Date(this.user.orders[index].timeS[k]))         
        }
        for (var j = 0; j < this.user.orders[index].timeE.length; j++) {
          newTimeE.push(new Date(this.user.orders[index].timeE[j]))         
        }
        this.user.orders[index].timeS = newTimeS;
        this.user.orders[index].timeE = newTimeE;
      }
    }
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
  }

  isConnected(): boolean {
    let conntype = this.network.type;
    return conntype && conntype !== 'unknown' && conntype !== 'none';
  }

}