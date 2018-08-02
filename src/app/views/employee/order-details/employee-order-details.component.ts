declare var jquery: any;
declare var $: any;
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from '../../../Orders';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GetorderService } from '../../../services/getorder.service';
import { of } from 'rxjs/observable/of';
import { UpdateorderService } from '../../../services/updateorder.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-employee-order-details',
  templateUrl: './employee-order-details.component.html'
})

export class EmployeeOrderDetailsComponent implements OnInit {

  orders: Order[];
  private messageOrderCancelled: string;

  constructor(
    private http: HttpClient, private getorderservice: GetorderService,
    private updateorderservice: UpdateorderService,
    private notificationservice: NotificationService,
    private authenticationService: AuthenticationService) {
  
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.notificationservice.loader(true);
    this.getOrders().subscribe(order => { this.orders = order;
      this.notificationservice.loader(false); });
  }

  getOrders(): Observable<Order[]> {
    this.notificationservice.loader(false);
    this.getorderservice.getEmployeeActiveOrders().subscribe(order => {this.orders = order;
      this.notificationservice.loader(false);
    });
    return of(this.orders);
  }

  cancelOrder(order: Order) {
    order.status = "CANCELLED";
    this.messageOrderCancelled = "Order Id:" + order.id + " Cancelled";
    this.updateorderservice.cancelOrder(order).subscribe(order => {
      this.getorderservice.getEmployeeActiveOrders().subscribe(order => {
        this.orders = order;
        this.notificationservice.notify("success", this.messageOrderCancelled);
        
      }
      );
    });
  }
}
