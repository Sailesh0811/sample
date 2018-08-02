declare var jquery: any;
declare var $: any;
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { HttpserviceService } from '../../services/httpservice.service';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-credit-bytes',
    templateUrl: './credit-bytes.component.html'
  })

  export class CreditBytesComponent implements OnInit{

    lastcreditedDetails: string;
    messageCreditBytes: string;

    constructor(
      private http: HttpClient, private httpservice: HttpserviceService, private notificationService: NotificationService) { }

    ngOnInit() {
    }

    creditBytesDetails(){
      this.getLastUpdateDetails().subscribe(msg => this.lastcreditedDetails = msg);
      $('.mini.modal')
        $('#credit-bytes-modal').modal('show');
        console.log(this.lastcreditedDetails,"time");
        
      return this.lastcreditedDetails;
      }

    getLastUpdateDetails(): Observable<string>{
      return this.httpservice.post('admin/credit',"");
    }

     creditBytes(){
       this.messageCreditBytes="300 Bytes credited globally";
       this.httpservice.get('admin/credit').subscribe();
       this.notificationService.notify("success",this.messageCreditBytes);
     }

     closeModal(){
      $('.small.modal')
      $('#credit-bytes-modal').modal('hide');
     }
  }
