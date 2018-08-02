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
const log = new Logger('Get Orders Serice');
@Injectable()
export class GetorderService {
  orders: Order[] = [];
  constructor(private http: HttpClient, private httpservice: HttpserviceService) { }

  getAllOrders(): Observable<Order[]> {
    return this.httpservice.get('/orders/history/all');
  }
  getPendingOrders(): Observable<Order[]> {
    return this.httpservice.get('/orders' + '?' + 'status=PENDING');
  }
  getConfirmedOrders(): Observable<Order[]> {
    return this.httpservice.get('/orders/queue');
  }

  getOrdersByDate(orderDate: String): Observable<Order[]> {
    return this.httpservice.get('/orders/history' + '?' + 'orderDate=' + orderDate);
  }

  getEmployeeActiveOrders(): Observable<Order[]> {
    return this.httpservice.get('/employee/orders');
  }

  getEmployeeAllOrders(page: pagination): Observable<Order[]> {
    return this.httpservice.get('/employee/page/history'+'?limit='+page.limit+'&currentPage='+page.currentPage);
  }

  getpagenumber(limit: number): Observable<pagination>{
    return this.httpservice.get('/employee/page/history/pageCount'+'?limit='+limit);
  }
}
class pagination{
  'limit'?: number;
  'totalCount'?: number;
  'totalPages'?: number;
  'currentPage'?: number;
  'offset'?: number;
}
