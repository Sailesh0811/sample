import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Logger } from './logger/logger.service';
import { AuthenticationService } from './authentication/authentication.service';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
const log = new Logger('Update Items Serice');
@Injectable()
export class UpdateitemsService {
  item: Item = {};
  token: string;
  constructor(private http: HttpClient, private authenticationservice: AuthenticationService) { }
  updateItems(item: Item): Observable<Item> {
     this.http.post('http://localhost:8080/items/update_item', item)
    .subscribe((response: Response) => log.info(response));
    return of(this.item);
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
  'availability'?: boolean;
}
