import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Logger } from './logger/logger.service';
import { AuthenticationService } from './authentication/authentication.service';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Order } from '../Orders';
import { HttpserviceService } from './httpservice.service';

@Injectable()
export class UpdateorderService {
  orders: Order[] = [];

  constructor(private http: HttpClient, private httpservice: HttpserviceService) { }

  updateOrder(order: Order): Observable<Order[]> {
    return this.httpservice.post('/orders', order);
  }

  cancelOrder(order: Order): Observable<Order[]> {
    return this.httpservice.post('/employee/orders', order);
  }
}
