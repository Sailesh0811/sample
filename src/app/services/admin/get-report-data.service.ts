import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from '../authentication/authentication.service';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { HttpParams } from '@angular/common/http';
import { HttpserviceService } from '../../services/httpservice.service';
@Injectable()
export class GetReportDataService {
  reportlistdata: reportlist[] = [];
  itemlistdata: itemlist[] = [];
  constructor(private http: HttpserviceService) { }
  getWeeklyGraph(fromDate: Date, toDate: Date): Observable<reportlist[]> {
    const body = new HttpParams().set('fromDate', fromDate.toString()).set('toDate', toDate.toString());
    return this.http.post('admin/reports/employee', body)
  }
   getItemReport(fromDate: Date, toDate: Date): Observable<itemlist[]> {

    const body = new HttpParams().set('fromDate', fromDate.toString()).set('toDate', toDate.toString());
    return this.http.post('admin/reports/itemwise', body)
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

  getCancelledOrderCount(fromDate: Date, toDate: Date):Observable<any>{
    return this.http.get('/reports/order_count'+'?fromDate='+fromDate.toString()+'&toDate='+toDate.toString()+'&status=CANCELLED' );
  }

  getDeclinedOrderCount(fromDate: Date, toDate: Date):Observable<any>{
    return this.http.get('/reports/order_count'+'?fromDate='+fromDate.toString()+'&toDate='+toDate.toString()+'&status=DECLINED' );
  }
  getDetailedCashReport(fromDate: Date, toDate: Date):Observable<any>{
    return this.http.get('admin/reports/paid_cash'+'?fromDate='+fromDate.toString()+'&toDate='+toDate.toString());
  }
  getDetailedBytesReport(fromDate: Date, toDate: Date):Observable<any>{
    return this.http.get('admin/reports/paid_bytes'+'?fromDate='+fromDate.toString()+'&toDate='+toDate.toString());
  }
  getSuccessfulOrderDetails(fromDate: Date, toDate: Date):Observable<any>{
     return this.http.get('/reports/order_details'+'?fromDate='+fromDate.toString()+'&toDate='+toDate.toString()+'&status=DELIVERED') 
  }
  getCancelledOrderDetails(fromDate: Date, toDate: Date):Observable<any>{
    return this.http.get('/reports/order_details'+'?fromDate='+fromDate.toString()+'&toDate='+toDate.toString()+'&status=CANCELLED') 
 }
  getDeclinedOrderDetails(fromDate: Date, toDate: Date):Observable<any>{
    return this.http.get('/reports/order_details'+'?fromDate='+fromDate.toString()+'&toDate='+toDate.toString()+'&status=DECLINED') 
  }

}
class reportlist {
  userId: number;
  totalAmount: number;
  firstName:string;
  lastName:string;
}

class itemlist {
  name: string;
  quantity: number
}
