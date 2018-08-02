import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, RequestOptions } from '@angular/http';
import { HttpserviceService } from '../../services/httpservice.service';
import { HttpParams } from '@angular/common/http';
@Injectable()
export class FeedbackService {

constructor(private http: HttpserviceService) { }
  sendFeedback(comment:string):Observable<any>{
    const body = new HttpParams().set('message', comment)
    return this.http.post('employee/profile/feedback', body);
  }

}

