import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dialogs } from '@ionic-native/dialogs';
import { Observable } from 'rxjs/Observable';
import { ObjStorageProvider } from '../obj-storage/obj-storage';


/*
  Generated class for the WebDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WebDataProvider {

  constructor(public http: HttpClient, private dialogs:Dialogs, private storage: ObjStorageProvider) {
    console.log('Hello WebDataProvider Provider');
  }


  getUser(id) {
    return new Promise(resolve => {
      this.http.get('https://app.wista.cz/api/v1/mon/users/'+id+'/orders').subscribe(data => {
        resolve(data);
      }, (err) => {
        console.log(err);
        this.dialogs.alert('Login error')
        .then(() => console.log('Login error'));
      });
    });
  }

  postUser(order) {
    return new Promise((resolve, reject) => {
      this.http.post('https://app.wista.cz/api/v1/mon/users/orders', JSON.stringify(order))
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
          console.log(err);
          this.dialogs.alert('Post error')
          .then(() => console.log('Post error'));
        });
    });
  }

  postUsersSync(orders:any[]){
    let allPosts = [];
    let updatedOrders = [];

    if(orders.length > 0){
      for(let i = 0; i < orders.length; i++) {
       allPosts.push(this.postUser(orders[i]));                
      }
      Observable.forkJoin(allPosts).subscribe(res => {    
        updatedOrders = res;
        this.dialogs.alert('Synchronization successful')
        .then(() => console.log('Synchronization successful'));
        this.storage.deleteToSync();
      },
       (err:any) => {
        this.dialogs.alert('Synchronization failed')
        .then(() => console.log('Synchronization failed'));
      });
    }
  }


}