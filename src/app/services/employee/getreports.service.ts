import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Logger } from '../logger/logger.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { HttpParams } from '@angular/common/http';
import { HttpserviceService } from '../../services/httpservice.service';

@Injectable()
export class GetreportsService {
  itemlistdata: itemlist[] = [];
  constructor(private http: HttpClient) { }

  getItemReport(fromDate: Date, toDate: Date): Observable<any> {
    const body = new HttpParams().set('fromDate', fromDate.toString()).set('toDate', toDate.toString());
    return this.http.post('employee/reports', body)
  }

  getBytesUsed(fromDate: Date, toDate: Date): Observable<any> {
    const body = new HttpParams().set('fromDate', fromDate.toString()).set('toDate', toDate.toString());
    return this.http.post('employee/reports/getbytesused', body)
  }
  getBytesUsedDetails(fromDate: Date, toDate: Date): Observable<any> {
    return this.http.get('employee/reports/paid_bytes' + '?fromDate=' + fromDate.toString() + '&toDate=' + toDate.toString())
  }
  getCash(fromDate: Date, toDate: Date): Observable<any> {
    const body = new HttpParams().set('fromDate', fromDate.toString()).set('toDate', toDate.toString());
    return this.http.post('employee/reports/getcash', body)
  }
  getCashSpentDetails(fromDate: Date, toDate: Date): Observable<any> {
    const body = new HttpParams().set('fromDate', fromDate.toString()).set('toDate', toDate.toString());
    return this.http.get('employee/reports/paid_cash' + '?fromDate=' + fromDate.toString() + '&toDate=' + toDate.toString())
  }
  getBorrowedBytes(fromDate: Date, toDate: Date): Observable<any> {
    const body = new HttpParams().set('fromDate', fromDate.toString()).set('toDate', toDate.toString());
    return this.http.post('employee/reports/getborrow', body)
  }

  getLentBytes(fromDate: Date, toDate: Date): Observable<any> {
    const body = new HttpParams().set('fromDate', fromDate.toString()).set('toDate', toDate.toString());
    return this.http.post('employee/reports/getLent', body)
  }
  getQuantities(fromDate: Date, toDate: Date): Observable<any> {
    const body = new HttpParams().set('fromDate', fromDate.toString()).set('toDate', toDate.toString());
    return this.http.post('employee/reports/most_bought', body)
  }
  getOrderNumber(fromDate: Date, toDate: Date): Observable<any> {
    return this.http.get('employee/reports/order_count' + '?fromDate=' + fromDate.toString() + '&toDate=' + toDate.toString() + '&status=DELIVERED');
  }
  getSuccessfulOrderDetails(fromDate: Date, toDate: Date): Observable<any> {
    return this.http.get('employee/reports/order_details' + '?fromDate=' + fromDate.toString() + '&toDate=' + toDate.toString() + '&status=DELIVERED')

  }
  getCancelledOrderDetails(fromDate: Date, toDate: Date): Observable<any> {
    return this.http.get('employee/reports/order_details' + '?fromDate=' + fromDate.toString() + '&toDate=' + toDate.toString() + '&status=CANCELLED')
  }
  getDeclinedOrderDetails(fromDate: Date, toDate: Date): Observable<any> {
    return this.http.get('employee/reports/order_details' + '?fromDate=' + fromDate.toString() + '&toDate=' + toDate.toString() + '&status=DECLINED')

  }
  getDeclinedOrderNumber(fromDate: Date, toDate: Date): Observable<any> {
    return this.http.get('employee/reports/order_count' + '?fromDate=' + fromDate.toString() + '&toDate=' + toDate.toString() + '&status=DECLINED');
  }
  getCancelledOrderNumber(fromDate: Date, toDate: Date): Observable<any> {
    return this.http.get('employee/reports/order_count' + '?fromDate=' + fromDate.toString() + '&toDate=' + toDate.toString() + '&status=CANCELLED');
  }

  getBytesBorrowedList(fromDate: Date, toDate: Date): Observable<any> {
    return this.http.get('employee/reports/borrowed_bytes' + '?fromDate=' + fromDate.toString() + '&toDate=' + toDate.toString());
  }
  getBytesLentList(fromDate: Date, toDate: Date): Observable<any> {
    return this.http.get('employee/reports/lent_bytes' + '?fromDate=' + fromDate.toString() + '&toDate=' + toDate.toString());
  }

}
class itemlist {
  name: string;
  quantity: number
}

class borrowDetails {
  id: number;
  name: string;
  date: Date;
  amount: number;
}