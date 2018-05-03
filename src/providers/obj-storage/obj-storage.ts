import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
/*
  Generated class for the ObjStorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ObjStorageProvider {

  private user: any;
  private ordersSync: any;

  constructor(private storage: Storage) {
    console.log('Hello ObjStorageProvider Provider');
  }

  //na prihlaseni je potreba pristup na net, toto asi nebude potreba
  getObj(id):any{

    return new Promise(resolve => {
      this.storage.get(id).then((val:any) => {
        console.log('Obj: ' + val);
        if(val != null)
        {
          this.user = val;
        }else{
          this.user = JSON.parse('{ "id": "1234", "name": "1234", "surname": "", "orders": [] }');
          console.log(this.user);
        }
        resolve(this.user);
      });
    });
  }

  getToSync(){
    return new Promise<any[]>(resolve => {
      this.storage.get('tosync').then((val:any) => {
        console.log('Obj: ' + val);
        if(val)
        {
          this.ordersSync = val;
        }else{
          this.ordersSync = [];
        }
        resolve(this.ordersSync);
      });
    });
  }

  setToSync(order){
    var ordersToSync: any[];
    var indexDel = -1;
    this.getToSync()
    .then(data => {
      ordersToSync = data;
      for (var index = 0; index < ordersToSync.length; index++) {
        if(ordersToSync[index].order_id == order.order_id && ordersToSync[index].user_id == order.user_id){
          indexDel = index;
        }        
      }
      if(indexDel > 0){
        ordersToSync.splice(indexDel, 1);
        ordersToSync.push(order);
      }else{
        ordersToSync.push(order);
      }
      this.storage.set('tosync', ordersToSync);
    });
  }

  deleteToSync(){
    this.storage.set('tosync', []);
  }

  addObj(id, obj){
    this.user = obj;
    this.storage.set(id, this.user);
  }

  changeObj(id, obj){
    this.user = obj;
    this.storage.set(id, this.user);
  }

  deleteObj(id, obj){
    this.user = obj;
    this.storage.set(id, this.user);
  }

}
