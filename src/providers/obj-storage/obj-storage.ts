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

  constructor(private storage: Storage) {
    console.log('Hello ObjStorageProvider Provider');
  }

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
