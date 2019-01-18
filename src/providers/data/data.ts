import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import * as toArrayBuffer from 'to-array-buffer';
//import { Socket } 'cz.blocshop.socketsforcordova'
var cordova: any;
/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {
  //socket: any;
  plat: string;
  ip: string = '192.168.100.118';
  port: number = 8888;
  id: number;

  constructor(private platform: Platform) {
    console.log('Hello DataProvider Provider');
    platform.ready().then(res => {
      if (res === 'cordova') {
        this.plat = 'cordova';


      }
    })

  }

  // this.socket.onData = function(data) {
  //   // invoked after new batch of data is received (typed array of bytes Uint8Array)
  // };
  // socket.onError = function(errorMessage) {
  //   // invoked after error occurs during connection
  // };
  // socket.onClose = function(hasError) {
  //   // invoked after connection close
  // };

  connect() {
    if (this.plat == 'cordova') {
      (<any>window).chrome.sockets.tcp.create({}, (createInfo) => {
        let socketTcpId = createInfo.socketId;
        console.log('ID - ' + socketTcpId);

        (<any>window).chrome.sockets.tcp.connect(socketTcpId, this.ip, this.port, (result) => {
          console.log("Connected to server " + result);
          this.id = socketTcpId;
          (<any>window).chrome.sockets.tcp.setPaused(socketTcpId, false);
          ///this.getStatus(socketTcpId);
        });
      });
    }

  }

  getStatus(): Promise<any> {
    return new Promise((resolve, reject) => {
      let amountReceived = 0;
      // (<any>window).chrome.sockets.tcp.onReceiveError.addListener(recError);

      // function recError(error) {
      //   console.log('Error - '+JSON.stringify(error));
      // }




      let content = "{\"PosSerialNumber\":\"100100000643\",\"PosVendor\":\"Inspur\"}";

      let content2 = "{\"POSSerialNumber\":\"100100000643\",\"IssueTime\":\"20180913100500\",\"TransactionType\":0,\"PaymentMethod\":0,\"SaleType\":0,\"LocalPurchaseOrder\":\"CA3300440024488\",\"Cashier\":\"20\",\"BuyerTPIN\":\"\",\"BuyerName\":\"\",\"BuyerTaxAccountName\":\"\",\"BuyerAddress\":\"\",\"BuyerTel\":\"\",\"OriginalInvoiceCode\":\"\",\"OriginalInvoiceNumber\":\"\",\"Items\":[{\"ItemId\":1,\"Description\":\"5-PKT TURNUP JEAN\",\"Barcode\":\"\",\"Quantity\":1,\"UnitPrice\":55.00,\"Discount\":0.00,\"TaxLabels\":[\"A\"],\"TotalAmount\":55.00,\"isTaxInclusive\":true,\"RRP\":0} ] }";

      let data1 = this.str2arrayBuffer(content2);


      // var dataString = data1;
      // var data = new ArrayBuffer(data1.length);
      // for (var i = 0; i < data1.length; i++) {
      //  data[i] = dataString.charCodeAt(i);
      // }

      console.log('Data - ' + JSON.stringify(data1));
      // this.receiveData();
      (<any>window).chrome.sockets.tcp.send(this.id, data1, (result) => {
        console.log("Response from server " + JSON.stringify(result));


      });

      (<any>window).chrome.sockets.tcp.onReceive.addListener(function (info) {


        console.log('Data Received!!');
        (<any>window).chrome.sockets.tcp.close(this.id);
        let data = this.arrayBuffer2str(info.data);
        console.log('Data - ' + JSON.parse(data));
        resolve(data);


      })
    }).catch(err => {
      console.log(err);
    })
  }

  receiveData() {
    console.log('Recieve data started');
    let amountReceived = 0;
    (<any>window).chrome.sockets.tcp.onReceive.addListener((info) => {
      console.log('Data Received!!');
      amountReceived += info.data.byteLength;
      let arr = new Uint8Array(info.data);
      let textChunk = String.fromCharCode.apply(null, arr);
      console.log(textChunk);

    });


    // let amountReceived = 0;
    // function recvListener(info) {
    //   console.log('Data Received!!');
    //   amountReceived += info.data.byteLength;
    //   let arr = new Uint8Array(info.data);
    //   let textChunk = String.fromCharCode.apply(null, arr);
    //   console.log(textChunk);
    // }
  }


  arrayBuffer2str(buf): string {
    var str = '';
    var ui8 = new Uint8Array(buf);
    for (var i = 0; i < ui8.length; i++) {
      str = str + String.fromCharCode(ui8[i]);
    }
    return str;
  }

  str2arrayBuffer(str): ArrayBuffer {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0; i < str.length; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
}
