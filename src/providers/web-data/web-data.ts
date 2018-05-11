import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dialogs } from '@ionic-native/dialogs';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { ObjStorageProvider } from '../obj-storage/obj-storage';
import { HttpHeaders } from '@angular/common/http';


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
        this.dialogs.alert('Error - přihlášení')
        .then(() => console.log('Login error'));
      });
    });
  }

  postUser(order) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };
    return new Promise((resolve, reject) => {
      this.http.post('https://app.wista.cz/api/v1/mon/users/orders', JSON.stringify(order), httpOptions)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
          console.log(err);
          this.dialogs.alert('Error - nepodařilo se poslat zakázku')
          .then(() => console.log('Post error'));
        });
    });
  }

  postUsersSync(orders:any[]){
    let allPosts = [];
    let updatedOrders = [];

    console.log(orders);
    if(orders.length > 0){
      for(let i = 0; i < orders.length; i++) {
       allPosts.push(this.postUser(orders[i]));                
      }
      Observable.forkJoin(allPosts).subscribe(res => {    
        updatedOrders = res;
        this.dialogs.alert('Synchronizace úspěšná')
        .then(() => console.log('Synchronization successful'));
        this.storage.deleteToSync();
      },
       (err:any) => {
        this.dialogs.alert('Synchronizace neúspěšná')
        .then(() => console.log('Synchronization failed'));
      });
    }
  }


}
