import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  // private url = 'http://localhost:3000';
  private url = 'http://192.168.1.82:3000';
  public socket;

  constructor(public http: HttpClient) { 
    this.socket = io(this.url);
  }

  public verifyUser = () => {

    return Observable.create((observer) => {

      this.socket.on('verifyUser', (data) => {
        observer.next(data);
        console.log("verify user")

      }); // end Socket

    }); // end Observable
    

  } // end verifyUser

  public sendNotification = (userEmail) =>{

    console.log("send-notification-called", userEmail);
    this.socket.emit('sendMyNotification',userEmail);
  }

 

  public getNotification = () =>{ 

    console.log("get-notification-called")
    return Observable.create((observer) => {
      this.socket.on('YourNotifications',notificationData=>{
        observer.next(notificationData);
        console.log("notifiation recieved from the server is:",notificationData);

      });
    });

  }


  public exitSocket = () => {    

    console.log("exit socket called")

    this.socket.disconnect();

  } 
}
