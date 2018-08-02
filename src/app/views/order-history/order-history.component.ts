declare var jquery: any;
declare var $: any;
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from '../../Orders';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GetorderService } from '../../services/getorder.service';
import { UpdateorderService } from '../../services/updateorder.service';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
@Component({
    selector: 'app-order-history',
    templateUrl: './order-history.component.html'
  })
  export class OrderHistoryComponent implements OnInit{
    orderHistory : Order[];
    orderDisplay: Order = {};
    orderDate: string;
    currentDate:number = Date.now();
    constructor(
      private http: HttpClient, private getorderservice: GetorderService,
       private updateorderservice: UpdateorderService) { }
    ngOnInit() {
    }
    ngAfterViewInit(){
      console.log(new Date(this.currentDate).getFullYear() + "-" + (new Date(this.currentDate).getMonth()+1) + "-" + new Date(this.currentDate).getDate(), "date");
      this.getorderservice.getOrdersByDate(new Date(this.currentDate).getFullYear() + "-" + (new Date(this.currentDate).getMonth()+1) + "-" + new Date(this.currentDate).getDate()).subscribe(orders =>this.orderHistory = orders);
      }
     viewDetails(orderToDisplay : Order){
       this.orderDisplay=orderToDisplay;    
       $('.small.modal')
        $('#order-details-modal').modal('show');
     }
     getAllOrders (): Observable<Order[]>{
      this.orderDate=null;
      this.getorderservice.getAllOrders().subscribe(orders =>this.orderHistory = orders);
      console.log("orders",this.orderHistory);
      return of(this.orderHistory);    
      }
      closeModal() : void{
        $('.small.modal')
        $('#order-details-modal').modal('hide');
       }
      getOrdersByDate(orderDate: string): Observable<Order[]>{
        console.log(this.orderDate,"date");
        if(orderDate==""){
          this.getAllOrders().subscribe(orders => this.orderHistory = orders);
        }
        this.getorderservice.getOrdersByDate(orderDate).subscribe(orders =>this.orderHistory = orders);
        return of(this.orderHistory);    
      }
  }