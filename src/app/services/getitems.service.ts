import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Logger } from './logger/logger.service';
import { AuthenticationService } from './authentication/authentication.service';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { HttpService } from './http/http.service';
const log = new Logger('Get Items Serice');

@Injectable()
export class GetitemsService {
  item: Item[] = [];

  constructor(private http: HttpClient) { }
  getItems(): Observable<Item[]> {
     return this.http.get<Item[]>('/items');
  }
  getAvailableItems(): Observable<Item[]> {
    return this.http.get<Item[]>('/employee/menu');
  }
}
class Item {
  'added'?: true;
  'categoryId'?: number;
  'description'?: string;
  'id'?: number;
  'imageUrl'?: string;
  'name'?: string;
  'price'?: number;
  'quantity'?: number;
  'status'?: boolean;
  'rating'?: number;
  'ratingList': [
    {
      'itemId'?: number;
      'rating'?: number;
      'review'?: string;
      'user'?: {
        'bytes'?: number;
        'contactNumber'?: number;
        'emailId'?: string;
        'employeeCode'?: number;
        'firstName'?: string;
        'id'?: number;
        'lastName'?: string;
        'password'?: string;
        'pin'?: number;
        'role'?: string;
        'slackId'?: string;
        'token'?: string;
        'userUrl'?: string;
      }
    }
  ];
  'userRating'?: number;
}

