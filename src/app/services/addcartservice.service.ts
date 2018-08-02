import { Injectable } from '@angular/core';
import { Notify } from '../notify';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AddcartserviceService {
  private subject = new Subject<Cart>();
  constructor() { }
  getCartValue(): Observable<any> {
    return this.subject.asObservable();
  }
  addCartValue(value: number, item: Item[]) {
    console.log('value' + value);
    item = item.filter (i => {
      return i.quantity > 0;
    });
    console.log('cart service' + item);
    localStorage.setItem('cart', JSON.stringify(item));
    this.subject.next(<Cart>{ 'value': value, 'item': item });
  }
}

class Cart {
  value: number;
  item: Item[];
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
  'availabilty'?: boolean;  
}
