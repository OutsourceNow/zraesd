import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private socket: DataProvider) {

  }

  connect() {
    this.socket.connect();
  }

  getStatus() {
    this.socket.getStatus().then(res => {
       console.log(res);
    })
  }
}
