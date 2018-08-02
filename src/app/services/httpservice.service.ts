import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HttpserviceService {

  constructor(private http: HttpClient) { }

  post(url: string, body: any): Observable<any> {
    console.log('post');
    return this.http.post(url, body);
  }
  get(url: string): Observable<any>  {
    return this.http.get<any>(url);
  }

}
