import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http/http.service';
import { NotificationService } from '../../services/notification.service';
import { HttpserviceService } from '../../services/httpservice.service';
import { AddcartserviceService } from '../../services/addcartservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendorcart',
  templateUrl: './vendorcart.component.html',
  styleUrls: ['./vendorcart.component.scss']
})
export class VendorcartComponent implements OnInit {
  cartValue: number;
  cartItems: Item[] = [];
  totalAmount: number;
  order: Order;
  remainingAmount: number;
  payWithBytes: boolean;
  check: boolean;
  insufficient: boolean;
  employeeCode: string;
  pin: string;
  cash: boolean;
  orderSummary: OrderDetails;
  orderDetails: OrderDetails[] = [];
  verifyDisabled: boolean;
  isEmployee: boolean;
  isPin: boolean;
  userComments: string;
  placeOrder: boolean;
  constructor(private http: HttpserviceService, private notification: NotificationService,
    private cartService: AddcartserviceService, private router: Router) {
    this.totalAmount = 0;
    this.cash = false;
    this.order = {};
    this.check = true;
    this.cartValue = 0;
    this.isEmployee = true;
    this.isPin = true;
    this.employeeCode = '';
    this.pin = '';
    this.userComments = '';
    this.placeOrder = false;
    this.verifyDisabled = true;
  }
  ngOnInit() {
    this.getCart();
  }
  getCart() {
    this.totalAmount = 0;
    this.cartItems = JSON.parse(localStorage.getItem('cart'));
    this.cartItems = this.cartItems.filter(item => {
      console.log(item.quantity);
      if (item.quantity === null || item.quantity === 0) {
      } else {
        item.amount = item.quantity * item.price;
        this.totalAmount += item.amount;
        console.log(this.totalAmount);
        return item;
      }
    });
    this.cartValue += this.totalAmount;
    console.log(this.cartItems);
  }
  add(item: Item) {
    console.log(this.cartValue);
    this.cartValue += item.price;

    this.cartItems.filter(items => {
      if (items.id === item.id) {
        if (items.quantity === null) {
          items.quantity = 1;
        } else {
          items.quantity += 1;
        }
      }
      return items;
    });
    this.cartService.addCartValue(this.cartValue, this.cartItems);
    this.getCart();
  }
  reduce(item: Item) {
    if (item.quantity > 0) {
      if (this.cartValue > 0) {
        console.log(this.cartValue);
        this.cartValue -= item.price;
        if (this.cartValue < 0) {
          this.cartValue = 0;
        }
      }
      this.cartItems.filter(items => {
        if (items.id === item.id) {
          if (items.quantity === 1) {
            items.quantity = 0;
          } else {
            items.quantity -= 1;
          }
        }
        return items;
      });
    }
    this.cartService.addCartValue(this.cartValue, this.cartItems);
    this.getCart();
    if (this.cartItems.length === 0) {
      this.notification.notify('info', 'No added items to display');
      this.router.navigate(['/home/newOrder']);
    }
  }
  validate() {
    if (this.employeeCode.length !== 4 || this.pin.length !== 4) {
      this.verifyDisabled = true;
    } else {
      this.verifyDisabled = false;
    }
  }
  checkOut() {
    this.verifyDisabled = true;
    this.order.items = this.cartItems;
    this.order.totalAmount = this.totalAmount;
    console.log(this.employeeCode);
    console.log(this.pin);
    this.order.user = {};
    this.order.user.employeeCode = this.employeeCode;
    this.order.user.pin = this.pin;
    this.notification.loader(true);
    this.http.post('/orders/check', this.order).subscribe(success => {
      console.log(success);
      this.remainingAmount = parseFloat(success.toString());
      console.log(this.remainingAmount);
      if (this.remainingAmount <= 0) {
        this.order.amountInBytes = this.totalAmount;
        this.order.amountInCash = 0;
        this.orderSummary = {};
        this.orderSummary.type = 'Bytes';
        this.orderSummary.cash = this.totalAmount;
        this.orderDetails.push(this.orderSummary);
        this.remainingAmount = 0;
      } else if (this.remainingAmount > 0) {
        this.orderSummary = {};
        this.orderSummary.cash = this.remainingAmount;
        this.orderSummary.type = 'Cash';
        this.orderDetails.push(this.orderSummary);
        this.notification.notify('error', 'Insufficient balance pay cash' + this.remainingAmount);
        this.orderSummary = {};
        this.orderSummary.type = 'Bytes';
        this.orderSummary.cash = this.totalAmount - this.remainingAmount;
        this.orderDetails.push(this.orderSummary);
      }
      this.placeOrder = true;
      this.notification.loader(false);
      this.check = false;
    }, error => {
      if (error.status === 400) {
        this.notification.notify('error', 'Invalid credentials');
        this.check = true;
      }
      this.notification.loader(false);
    });
    

  }

  createNewOrder() {
    this.order.amountInBytes = this.totalAmount - this.remainingAmount;
    this.order.amountInCash = this.remainingAmount;
    this.order.userComments = this.userComments;
    this.notification.loader(true);
    this.http.post('/orders/new', this.order).subscribe(response => {
      localStorage.removeItem('cart');
      this.cartItems = [];
      this.cartValue = 0;
      this.cartService.addCartValue(0, []);
      this.notification.loader(false);
      this.notification.notify('success', 'Your order is placed successfully');
      this.router.navigate(['/home/orderQueue']);
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
  'amount'?: number;
}
class Order {
  'items'?: Item[];
  'totalAmount'?: number;
  'amountInBytes'?: number;
  'amountInCash'?: number;
  'user'?: User;
  'userComments'?: string;
}

class User {
  'employeeCode'?: string;
  'pin'?: string;
  'id'?: number;
}
class OrderDetails {
  'type'?: string;
  'cash'?: number;
}
