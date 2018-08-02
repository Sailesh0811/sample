declare var jquery: any;
declare var $: any;
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from '../../../Orders';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GetorderService } from '../../../services/getorder.service';
import { UpdateorderService } from '../../../services/updateorder.service';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Logger } from '../../../services/logger/logger.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-employee-order-history',
  templateUrl: './employee-order-history.component.html'
})

export class EmployeeOrderHistoryComponent implements OnInit {

  employeeOrderHistory: Order[];
  orderDisplay: Order;
  currentDate: number = Date.now();
  totalNoOfPages: number;
  page: pagination = {};
  limit: number = 10;
  currentPage: number = 1;
  pages: number[] = [];
  constructor(
    private http: HttpClient, private getorderservice: GetorderService,
    private updateorderservice: UpdateorderService, private notificationservice: NotificationService) { }

  ngOnInit() {
    $('.ui.dropdown')
      .dropdown()
      ;
  }

  ngAfterViewInit() {
    this.setLimit(10);
    $('.ui.modal').remove();
  }

  viewDetails(orderToDisplay: Order) {
    this.orderDisplay = orderToDisplay;
    $('#order-details-modal').modal('toggle', {
      detachable: false,
      observeChanges: false
    })
      ;
  }

  closeModal(): void {
    $('.small.modal')
    $('#order-details-modal').modal('hide');
  }

  setLimit(limit: number) {
    console.log("limit", limit);
    this.limit = limit;
    this.page.limit = this.limit;
    this.getPageCount();
    this.getAllOrders(1).subscribe(orders => {
      this.employeeOrderHistory = orders;
      console.log(orders, "emp ordr history");
    });
  }

  getPageCount() {
    this.getorderservice.getpagenumber(this.page.limit).subscribe(page => {
    this.page = page;
      this.totalNoOfPages = this.page.totalPages;
    });
    console.log("page count", this.totalNoOfPages);
  }

  getAllOrders(currentPage: number): Observable<Order[]> {
    this.pages = [];
    console.log("page", this.currentPage);
    // if (currentPage == 1) {
    //   for (let i = 1; i <= this.totalNoOfPages; i++) {
    //     if (i > 3)
    //       break;
    //     this.pages.push(i);
    //     console.log("i", i);

    //   }
    // }
    // else if (currentPage == this.totalNoOfPages) {
    //   for (let i = 2; i >= 0; i--) {
    //     if (this.totalNoOfPages - i < 1)
    //       break;
    //     this.pages.push(this.totalNoOfPages - i);
    //   }
    // }
    // else {
    //   this.pages.push(currentPage - 1);
    //   this.pages.push(currentPage);
    //   this.pages.push(currentPage + 1);
    // }
    this.employeeOrderHistory = null;
    this.page.limit = this.limit;
    this.page.currentPage = currentPage;
    this.currentPage = currentPage;
    this.getorderservice.getEmployeeAllOrders(this.page).subscribe(orders => this.employeeOrderHistory = orders);
    return of(this.employeeOrderHistory);
  }

  notify(msg: string) {
    this.notificationservice.notify("success", msg);
  }
}

class pagination {
  'limit'?: number;
  'totalCount'?: number;
  'totalPages'?: number;
  'currentPage'?: number;
  'offset'?: number;
}
