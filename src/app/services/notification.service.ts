import { Injectable } from '@angular/core';
import { Notify } from '../notify';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NotificationService {
  private subject = new Subject<Notify>();
  private load = new Subject<{ load: boolean }>();
  constructor() { }

  getNotification(): Observable<any> {
    return this.subject.asObservable();
  }
  notify(type: string, message: string) {
    console.log(type + 'type');
    console.log(' message' + message);
    this.subject.next(<Notify>{ type: type, message: message });
  }
  getLoad() {
    return this.load.asObservable();
  }
  loader(load: boolean) {
    this.load.next(<{ load: boolean }>{ load: load });
  }
}
