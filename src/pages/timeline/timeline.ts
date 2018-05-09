import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Dialogs } from '@ionic-native/dialogs';
import { TimechartPage } from '../timechart/timechart';
import { ObjStorageProvider } from '../../providers/obj-storage/obj-storage';
import { WebDataProvider } from '../../providers/web-data/web-data';
import { Network } from '@ionic-native/network';

import { NgZone } from '@angular/core';

import { PopoverController } from 'ionic-angular';
import { PopoverPage } from '../popover/popover';

@Component({
  selector: 'page-timeline',
  templateUrl: 'timeline.html'
})
export class TimelinePage {

  private order:any;
  private bLabel:string;
  private sTime:Date;
  private eTime:Date;
  private data:any[];
  private bDis:any;
  private user:any;

  private zone:any;

  constructor(public navCtrl: NavController, private dialogs:Dialogs, public params:NavParams, private storageProvider: ObjStorageProvider, private network: Network, private WDProvider: WebDataProvider, public popoverCtrl: PopoverController) {
    this.order = params.get('order');
    this.user = params.get('user');
    this.setBLabel();
    this.zone = new NgZone({ enableLongStackTrace: false });
    if (this.order.finished == 0) {
      this.bDis = null;
    }else{
      this.bDis = true;
    }
    
  }

  setBLabel(){
    if(this.order.timeS.length == this.order.timeE.length){
      this.bLabel = 'Start';
    }else{
      this.bLabel = 'Zastavit';
    }
  }

  colorChangeFinished(){
    if(this.order.timeS.length == this.order.timeE.length){
      return true;
    }else{
      return false;
    }
  }

  changeTimeOrder(){
    this.zone.run(() => {
      if(this.order.timeS.length == this.order.timeE.length){
        this.sTime = new Date();
        this.order.timeS.push(this.sTime);
      }else{
        this.eTime = new Date();
        this.order.timeE.push(this.eTime);
      }
    });   
    this.setBLabel();
    this.storageProvider.changeObj(this.user.id, this.user);

    let orderProc = {
      order_id: this.order.id,
      user_id: this.user.id,
      finished: 0,
      displayed: 1,
      timeS: this.prepareTimes(this.order.timeS),
      timeE: this.prepareTimes(this.order.timeE)
    };
    if(this.isConnected()){
      this.WDProvider.postUser(orderProc);
    }else{
      this.storageProvider.setToSync(orderProc);
    }
  }

  showChart(){
    this.data = [];
    for (var index = 0; index < this.order.timeE.length; index++) {
      this.data.push(
        {
          x: new Date(this.order.timeS[index]).getTime(),
          x2: new Date(this.order.timeE[index]).getTime(),
          y: 0,
          partialFill: 1
        }
      );     
    }

    this.navCtrl.push(TimechartPage, {
      data:this.data,
      order:this.order
    });
  }

  finishOrder(){
    this.dialogs.confirm('Ukončit zpracování?', 'Potvrdit', ['OK', 'Zrušit'])
    .then(() => {
      this.zone.run(() => {
        if(this.order.timeS.length == this.order.timeE.length){
          
        }else{
          this.eTime = new Date();
          this.order.timeE.push(this.eTime);
        }
        this.order.finished = 1;
        this.bDis = true;
        this.storageProvider.changeObj(this.user.id, this.user);
      });

      let orderProc = {
        order_id: this.order.id,
        user_id: this.user.id,
        finished: 1,
        displayed: 1,
        timeS: this.prepareTimes(this.order.timeS),
        timeE: this.prepareTimes(this.order.timeE)
      };
      if(this.isConnected()){
        this.WDProvider.postUser(orderProc);
      }else{
        this.storageProvider.setToSync(orderProc);
      }  
    });
    
  }


  deleteTime(i:number){
    alert('Mazání času');
    this.zone.run(() => {
      this.order.timeS.splice(i, 1);
      if(typeof this.order.timeE[i] === 'undefined') {
      }
      else {
        this.order.timeE.splice(i, 1);
      }      
    });
    this.storageProvider.changeObj(this.user.id, this.user);

    let orderProc = {
      order_id: this.order.id,
      user_id: this.user.id,
      finished: 0,
      displayed: 1,
      timeS: this.prepareTimes(this.order.timeS),
      timeE: this.prepareTimes(this.order.timeE)
    };
    if(this.isConnected()){
      this.WDProvider.postUser(orderProc);
    }else{
      this.storageProvider.setToSync(orderProc);
    }

  }

  prepareTimes(times:any[]){
    let isoTimes = [];
    for (var index = 0; index < times.length; index++) {
      isoTimes.push(times[index].toISOString().slice(0, 19).replace('T', ' '));      
    }
    return isoTimes;
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