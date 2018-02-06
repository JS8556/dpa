import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Dialogs } from '@ionic-native/dialogs';


@Component({
  selector: 'page-details',
  templateUrl: 'details.html'
})
export class DetailsPage {

  private order:any;


  constructor(public navCtrl: NavController, private dialogs:Dialogs, public params:NavParams) {
    this.order = params.get('order');
  }


}