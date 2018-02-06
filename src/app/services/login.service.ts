import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/Rx';


@Injectable()
export class LoginService{
    http: any;
    baseUrl: String;

    constructor(http:Http){
        this.http = http;
        this.baseUrl = 'https://demo7517930.mockable.io/users/';
    }

    getUsers(id){
        if(id=="1234"){
            this.baseUrl = 'https://demo7517930.mockable.io/users/';
        }else{
            this.baseUrl = 'https://demo7517930.mockable.io/usersNO/';
        }
        return this.http.get(this.baseUrl)
            .map(res => res.json());
    }

}