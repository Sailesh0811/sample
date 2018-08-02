declare var jquery: any;
declare var $: any;
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from '../../Orders';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GetorderService } from '../../services/getorder.service';
import { UpdateorderService } from '../../services/updateorder.service';
import { of } from 'rxjs/observable/of';
import { debounceTime } from 'rxjs/operators';
import { NotificationService } from '../../services/notification.service';


@Component({
   selector: 'app-order-queue',
   templateUrl: './order-queue.component.html'
 })

export class OrderQueueComponent implements OnInit {

   orderQueue : Order[];
   messageOrderReady:string;
   messageOrderDelivered :string;
   orderQueuestatus:string;
   private orderQueueUrl:'api/orderQueue';

 constructor(
   private http: HttpClient, private getorderservice: GetorderService,
   private updateorderservice: UpdateorderService,private notificationservice: NotificationService) { }

   ngOnInit() {}

   ngAfterViewInit(){
     this.getOrderQueue().subscribe(orderQueue =>{ this.orderQueue = orderQueue;
      console.log(orderQueue,"orders");
    });
     }

    getOrderQueue (): Observable<Order[]>{
        this.getorderservice.getConfirmedOrders().subscribe(order =>{this.orderQueue = order;
          console.log(order);});
       return of(this.orderQueue);
     }

   orderReady(order:Order){
     order.status="PICKUP";
     this.messageOrderReady="Order Id:"+order.id+" Ready";
     this.updateorderservice.updateOrder(order).subscribe(orderQueue =>{
       this.getorderservice.getConfirmedOrders().subscribe(order =>
       {
        this.orderQueue = order;        
        this.notificationservice.notify("success",this.messageOrderReady);              
      }
      );
      });
   }

   orderPickedUp(order:Order){
      order.status="DELIVERED";
      this.messageOrderDelivered="Order Id:"+order.id+" Delivered";
      this.updateorderservice.updateOrder(order).subscribe(orderQueue =>{
        this.getorderservice.getConfirmedOrders().subscribe(order =>
        {
         this.orderQueue = order;
         this.notificationservice.notify("success",this.messageOrderDelivered);              
       }
       );
       });
   }
 }