import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Logger } from './logger/logger.service';
import { AuthenticationService } from './authentication/authentication.service';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { HttpParams } from '@angular/common/http';
import { HttpserviceService } from '../services/httpservice.service';

const log = new Logger('Update Items Serice');

@Injectable()
export class GetitemreportService {
 weekdata: weekly[] = [];
 reportlistdata: reportlist[] = [];
 itemlistdata: itemlist[] = [];
 constructor(private http: HttpserviceService) { }
 getItemReport(fromDate: Date, toDate: Date): Observable<itemlist[]> {
   return this.http.get('/reports/itemwise'+'?fromDate='+fromDate.toString()+'&toDate='+toDate.toString() );
 }

 getWeeklyGraph(fromDate: Date, toDate: Date): Observable<weekly[]> {
   return this.http.get('/reports/graph'+'?fromDate='+fromDate.toString()+'&toDate='+toDate.toString() );
 }
 getCashReceived(fromDate: Date, toDate: Date):Observable<any>{
   return this.http.get('/reports/cash'+'?fromDate='+fromDate.toString()+'&toDate='+toDate.toString() );
 }
 getBytesReceived(fromDate: Date, toDate: Date):Observable<any>{
   return this.http.get('admin/reports'+'?fromDate='+fromDate.toString()+'&toDate='+toDate.toString() );
 }

 getLeastBought(fromDate: Date, toDate: Date):Observable<any>{
   return this.http.get('/reports/least_bought'+'?fromDate='+fromDate.toString()+'&toDate='+toDate.toString() );
 }
 
 getMostBought(fromDate: Date, toDate: Date):Observable<any>{
   return this.http.get('/reports/most_bought'+'?fromDate='+fromDate.toString()+'&toDate='+toDate.toString() );
 }

 getOrderNumber(fromDate: Date, toDate: Date):Observable<any>{
   return this.http.get('/reports/order_count'+'?fromDate='+fromDate.toString()+'&toDate='+toDate.toString()+'&status=DELIVERED' );
 }

 getNotBought(fromDate: Date, toDate: Date):Observable<any>{
   return this.http.get('/reports/not_bought'+'?fromDate='+fromDate.toString()+'&toDate='+toDate.toString() );
 }

  getDeclinedOrderCount(fromDate: Date, toDate: Date):Observable<any>{
    return this.http.get('/reports/order_count'+'?fromDate='+fromDate.toString()+'&toDate='+toDate.toString()+'&status=DECLINED' );
  }

  getCancelledOrderCount(fromDate: Date, toDate: Date):Observable<any>{
    return this.http.get('/reports/order_count'+'?fromDate='+fromDate.toString()+'&toDate='+toDate.toString()+'&status=CANCELLED' );
  }
  getDetailedCashReport(fromDate: Date, toDate: Date):Observable<any>{
    return this.http.get('admin/reports/paid_cash'+'?fromDate='+fromDate.toString()+'&toDate='+toDate.toString());
  }
  getDetailedBytesReport(fromDate: Date, toDate: Date):Observable<any>{
    return this.http.get('admin/reports/paid_bytes'+'?fromDate='+fromDate.toString()+'&toDate='+toDate.toString());
  }

}

class weekly {
 orderInitiationTime: Date;
 totalAmount: number;
}

class reportlist {
 id: number;
 orderInitiationTime: Date;
 totalAmount: number;
}

class itemlist {
 name: string;
 quantity: number;
}