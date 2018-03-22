import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Dialogs } from '@ionic-native/dialogs';
import { TimechartPage } from '../timechart/timechart';
import { ObjStorageProvider } from '../../providers/obj-storage/obj-storage';

import { NgZone } from '@angular/core';

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

  constructor(public navCtrl: NavController, private dialogs:Dialogs, public params:NavParams, private storageProvider: ObjStorageProvider) {
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
      this.bLabel = 'Pause';
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
    this.dialogs.confirm('Finish order?', 'Confirm', ['OK', 'Cancel'])
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
        
    });
    
  }


  deleteTime(i:number){
    alert('Deleting time');
    this.zone.run(() => {
      this.order.timeS.splice(i, 1);
      this.order.timeE.splice(i, 1);
    });
    this.storageProvider.changeObj(this.user.id, this.user);

  }

}