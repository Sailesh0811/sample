declare var jquery: any;
declare var $: any;
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from '../../Orders';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPending } from 'q';
import { Observable } from 'rxjs/Rx';
import { GetorderService } from '../../services/getorder.service';
import { UpdateorderService } from '../../services/updateorder.service';
import { of } from 'rxjs/observable/of';
import { NotificationService } from '../../services/notification.service';
@Component({
  selector: 'app-pending-orders',
  templateUrl: './pending-orders.component.html'
})

export class PendingOrdersComponent implements OnInit {

  pendingOrders: Order[] = null;
  pendingOrderstatus: string;
  messageOrderConfirmed: string;
  messageOrderDeclined: string;
  orderDeclined: Order;
  userComments: string;

  constructor(
    private http: HttpClient, private getorderservice: GetorderService,
    private updateorderservice: UpdateorderService,
    private notificationservice: NotificationService) {
      Observable.interval(30000)
     .switchMap(() => this.getPendingOrders()).map((orders) => orders)
       .subscribe((orders) => {
         this.pendingOrders = orders;     
       })
     }

  ngOnInit() {
    
   }

  ngAfterViewInit() {
   
   setInterval(this.getPendingOrders().subscribe(orders => this.pendingOrders = orders),60000);
    }

    getComments(order: Order): string{
      this.userComments= order.userComments;
      return(this.userComments);
    }

  getPendingOrders(): Observable<Order[]> {
    this.getorderservice.getPendingOrders().subscribe(orders => {this.pendingOrders = orders;console.log(orders,"pending");
    });
    return of(this.pendingOrders);

  }

  acceptOrder(order: Order) {
    order.status = 'CONFIRMED';
    this.messageOrderConfirmed = "Order Id:" + order.id + " Confirmed";
    this.updateorderservice.updateOrder(order).subscribe(pendingOrders =>{
      this.getorderservice.getPendingOrders().subscribe(order =>
      { 
       this.pendingOrders = order;
       this.notificationservice.notify("success", this.messageOrderConfirmed);
     }
     );
     }); 
  }

  declineOrderGetComments(order :Order){
    this.orderDeclined=order;
    $('.small.modal')
    $('#decline-order').modal('show');
  }

  declineOrder(order: Order,comment:string) {
    order.status = 'DECLINED';
    order.comments = comment;
    this.messageOrderDeclined = "Order Id:" + order.id + " Declined";
    this.updateorderservice.updateOrder(order).subscribe(pendingOrders =>{
      this.getorderservice.getPendingOrders().subscribe(order =>
      { 
       this.pendingOrders = order;
       this.notificationservice.notify("success",this.messageOrderDeclined);               
     }
     );
     }); 
  }
}
