import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Logger } from './logger/logger.service';
import { AuthenticationService } from './authentication/authentication.service';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { UpdateitemsService } from './updateitems.service';
import { NotificationService } from './notification.service';
const log = new Logger('Update Items Service');
@Injectable()
export class UpdateavailabilityService {

  constructor(private http: HttpClient,
  private notificationService: NotificationService) { }
  updateItem(item: Item) {
    this.notificationService.loader(true);
    this.http.post('items/update_item', item)
    .subscribe(response => {log.info(response);
      this.notificationService.loader(false);
    });
  }
  updateAvailability(item: Item) {
   
    this.http.post('items/update_status', item)
    .subscribe(response => {log.info(response);
    
    });
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
  'availability'?:boolean;
}