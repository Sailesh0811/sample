import { Component, OnInit } from '@angular/core';
import { AddcartserviceService } from '../../services/addcartservice.service';
import { HttpserviceService } from '../../services/httpservice.service';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartValue: number;
  cartItems: Item[] = [];
  totalAmount: number;
  order: Order;
  remainingAmount: number;
  payWithBytes: boolean;
  check: boolean;
  insufficient: boolean;
  mode: string;
  bytesLended: BytesLender;
  borrow: boolean;
  employeeCode: string;
  pin: string;
  borrowList: BytesLender[] = [];
  borrowAmount: number;
  amountInBytes: number;
  userComments: string;
  orderSummary: OrderDetails;
  orderDetails: OrderDetails[] = [];
  verifyDisabled: boolean;
  isEmployee: boolean;
  isPin: boolean;
  placeOrder: boolean;
  shopStatus: boolean;
  constructor(private cartService: AddcartserviceService,
    private http: HttpserviceService, private notification: NotificationService,
    private router: Router) {
    this.totalAmount = 0;
    this.payWithBytes = false;
    this.check = true;
    this.insufficient = false;
    this.borrow = false;
    this.borrowAmount = 0;
    this.cartValue = 0;
    this.verifyDisabled = true;
    this.isEmployee = true;
    this.isPin = true;
    this.employeeCode = '';
    this.pin = '';
    this.placeOrder = false;
    this.shopStatus = true;
  }

  ngOnInit() {
    this.getCart();
    this.http.get('employee/orders/pantryStatus').subscribe(resp => {
      this.shopStatus = resp;
    });
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
        this.cartValue = this.totalAmount;
        return item;
      }
    });
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
        this.cartService.addCartValue(this.cartValue, this.cartItems);
        this.getCart();
      }
      return items;
    });
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
          this.cartService.addCartValue(this.cartValue, this.cartItems);
          this.getCart();
        }
        return items;
      });
    }
    if (this.cartItems.length === 0) {
      this.notification.notify('info', 'No added items to display');
      this.router.navigate(['/employee/menu']);
    }
  }
  checkout() {
    this.order = {};
    this.order.items = this.cartItems;
    this.order.totalAmount = this.totalAmount;
    this.order.borrowList = [];
    // checking whether the user has enough bytes in his account
    this.notification.loader(true);
    this.http.post('/employee/orders/check', this.order).subscribe(success => {
      this.remainingAmount = parseFloat(success);
      if (this.remainingAmount <= 0) {
        console.log('true');
        this.amountInBytes = this.totalAmount;
        this.payWithBytes = true;
        this.check = false;
        this.orderSummary = {};
        this.orderSummary.type = 'Bytes';
        this.orderSummary.cash = this.amountInBytes;
        this.orderDetails.push(this.orderSummary);
        this.notification.loader(false);
      }
      if (this.remainingAmount > 0) {
        // if the user does not have enough bytes
        this.amountInBytes = this.totalAmount - this.remainingAmount;
        this.orderSummary = {};
        this.orderSummary.type = 'Bytes';
        this.orderSummary.cash = this.amountInBytes;
        this.orderDetails.push(this.orderSummary);
        this.notification.loader(false);
        setTimeout(() => {
          this.notification.notify('error',
            'seems like you dont have sufficient bytes you need ' + this.remainingAmount);
        }, 1500);
        this.check = false;
        this.insufficient = true;
      }
      console.log(success);

    },
      error => {
        console.log(error);
        this.notification.loader(false);
      }
    );
  }

  payBytes() {
    this.order = {};
    this.order.amountInBytes = this.amountInBytes;
    this.order.items = this.cartItems;
    this.order.totalAmount = this.totalAmount;
    this.order.amountInCash = 0;
    this.order.borrowList = [];
    this.order.userComments = this.userComments;
    this.notification.loader(true);
    this.http.post('/employee/orders/new', this.order).subscribe(
      success => {
        console.log('Payment successful order confirmed');
        this.notification.loader(false);
        this.notification.notify('success', 'Payment successful order confirmed');
        localStorage.removeItem('cart');
        this.cartItems = [];
        this.cartValue = 0;
        this.cartService.addCartValue(0, []);

        this.router.navigate(['/employee/orderDetails']);
        console.log(success);
      },
      err => {
        console.log(err);
        this.notification.notify('error', 'Unable to process your payment');
      }
    );
  }
  validate() {
    if (this.employeeCode.length !== 4 || this.pin.length !== 4) {
      this.verifyDisabled = true;
    } else {
      this.verifyDisabled = false;
    }
  }
  clearDetails() {
    this.orderDetails = [];
    this.placeOrder = false;
    this.mode = '';
    this.insufficient = false;
    this.remainingAmount = 0;
    this.borrowList = [];
    this.payWithBytes = false;
  }
  payInsufficient() {
    $('.ui.checkbox').checkbox({
      enable: true
    });
    console.log(this.mode);
    if (this.mode === 'cash') {
      // if the user needs to pay by cash create new order with cash with the remaining amount to be paid
      // with cash
      console.log(this.remainingAmount);
      this.order = {};
      this.order.items = this.cartItems;
      this.order.totalAmount = this.totalAmount;
      console.log(this.remainingAmount + '>0');
      this.order.amountInBytes = this.amountInBytes;
      this.order.amountInCash = this.remainingAmount;
      this.order.borrowList = this.borrowList;
      this.order.userComments = this.userComments;
      this.orderSummary = {};
      this.orderSummary.type = 'Cash';
      this.orderSummary.cash = this.order.amountInCash;
      this.orderDetails.push(this.orderSummary);
      this.notification.loader(true);
      this.http.post('/employee/orders/new', this.order).subscribe(
        success => {

          console.log('Payment successful order confirmed');
          // this.router.navigate(['/employee/menu']);
          localStorage.removeItem('cart');
          this.cartItems = [];
          this.cartValue = 0;
          this.cartService.addCartValue(0, []);
          this.notification.loader(false);
          setTimeout(() => {
            this.notification.notify('success', 'Payment successful order confirmed');
          }, 1500);
          console.log(success);
          this.router.navigate(['/employee/orderDetails']);
        },
        err => {
          console.log(err);
          this.notification.notify('error', 'Unable to process your payment');
          this.notification.loader(false);
        }
      );

    }
    if (this.mode === 'borrow') {
      this.borrow = true;
      this.insufficient = false;
      // this.bytesLended = {};
      // this.bytesLended.employeeCode;
      // this.bytesLended.pin;
    }
  }
  borrowBytes() {
    this.bytesLended = {};
    // getting borrowed user id and pin
    console.log(this.employeeCode);
    console.log(this.pin);
    this.bytesLended.employeeCode = this.employeeCode;
    this.bytesLended.pin = this.pin;
    this.employeeCode = '';
    this.pin = '';
    this.bytesLended.bytesNeeded = this.remainingAmount;
    console.log(this.bytesLended);
    this.order = {};
    this.notification.loader(true);
    this.http.post('/employee/orders/borrow', this.bytesLended).subscribe(success => {
      console.log(success);
      if (success.bytesNeeded >= 0) {
        // if the borrowed user has enough bytes create the order
        console.log('borrow success');
        this.order.items = this.cartItems;
        success.bytesLent = this.remainingAmount;
        this.borrowList.push(success);
        this.insufficient = false;
        this.orderSummary = {};
        this.orderSummary.type = 'Borrow from ' + success.employeeCode;
        this.orderSummary.cash = success.bytesLent;
        this.orderDetails.push(this.orderSummary);
        this.orderDetails = this.orderDetails.filter(order => {
          return order.cash > 0;
        });
        this.placeOrder = true;
        this.mode = '';
        this.notification.loader(false);
      } else if (success.bytesNeeded < 0) {
        this.borrow = false;
        this.insufficient = true;
        this.bytesLended = {};
        // if the borrowed user does not enough money
        console.log(success.employeeCode);
        if (success.bytesLent > 0) {
          this.orderSummary = {};
          this.orderSummary.type = 'Borrow from ' + success.employeeCode;
          this.orderSummary.cash = success.bytesLent;
          this.orderDetails.push(this.orderSummary);
          this.bytesLended.bytesNeeded = Math.abs(success.bytesNeeded);
          this.remainingAmount = Math.abs(success.bytesNeeded);
          this.bytesLended.employeeCode = this.employeeCode;
          this.bytesLended.pin = this.pin;
          this.borrowList.push(success);
        }
        this.orderDetails = this.orderDetails.filter(order => {
          return order.cash > 0;
        });
        console.log('lesser bytes');
        this.verifyDisabled = true;
        this.notification.loader(false);
        setTimeout(() => {
          this.notification.notify('error', 'You borrowed ' + success.bytesLent + 'from' + success.employeeCode);
        }, 1500);
      }
    }, err => {
      this.notification.loader(false);
      if (err.status === 400) {
        setTimeout(() => {
          this.notification.notify('error', 'Invalid credentials');
        }, 1500);
      }
      console.log(err);
    });
  }
  borrowCheck(bytesLended: BytesLender) {
    console.log(bytesLended);
    this.http.post('/employee/orders/borrow', bytesLended).subscribe(
      response => {
        if (response.bytesNeeded > 0) {
          console.log('More bytes needed');
          this.notification.notify('error', 'You still need ' + response.bytesNeeded);
        }
        console.log(response);

      },
      err => {
        console.log(err);
        if (err.bytesNeeded > 0) {
          console.log('More bytes needed');
        }
        // this.notification.notify('success', 'Payment successful order confirmed');
        // this.router.navigate(['/employee/menu']);
      }
    );
  }
  createNewOrder() {
    console.log('create new order');
    this.order = {};
    this.order.items = this.cartItems;
    this.borrowList.filter(borrow => {
      console.log('bytes lent' + borrow.bytesLent);
      if (borrow.bytesLent > 0) {
        return borrow;
      }
    });
    this.order.borrowList = this.borrowList;
    this.order.totalAmount = this.totalAmount;
    this.order.amountInCash = 0;
    this.order.amountInBytes = this.amountInBytes;
    this.order.userComments = this.userComments;
    this.notification.loader(true);
    this.http.post('/employee/orders/new', this.order).subscribe(
      response => {
        console.log('Payment successful order confirmed');
        this.notification.loader(false);
        setTimeout(() => {
          this.notification.notify('success', 'Your order is placed successfully');
        }, 1500);
        this.borrow = false;
        localStorage.removeItem('cart');
        this.cartItems = [];
        this.cartValue = 0;
        this.cartService.addCartValue(0, []);
        this.router.navigate(['/employee/menu']);

      },
      err => {
        console.log(err);
        this.notification.loader(false);
        // this.router.navigate(['/employee/menu']);
      }
    );
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
  'borrowList'?: BytesLender[];
  'userComments'?: string;
}
class BytesLender {
  'employeeCode'?: string;
  'pin'?: string;
  'bytesLent'?: number;
  'bytesNeeded'?: number;
  'userId'?: number;
}
class OrderDetails {
  'type'?: string;
  'cash'?: number;
}
