import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Router } from '@angular/router';
import { AddcartserviceService } from '../../services/addcartservice.service';
import { items } from '../../Orders';
import { NotificationService } from '../../services/notification.service';
import { AddBytesService } from '../../services/admin/add-bytes.service';
import { Observable } from 'rxjs/Observable';
declare var $: any;
@Component({
  selector: 'app-employeelayout',
  templateUrl: './employeelayout.component.html',
  styleUrls: ['./employeelayout.component.scss']
})
export class EmployeelayoutComponent implements OnInit, AfterViewInit {
  employeeName: string;
  cartValue: number;
  cartItems: Item[] = [];
  lastcreditedDetails: string;
  messageCreditBytes: string;
  role: string;
  totalAmount: number;
  cartLength: number;
  userUrl: string;
  bytes: number = 300;
  constructor(private authenticationService: AuthenticationService,
    private router: Router, private cartService: AddcartserviceService,
    private notification: NotificationService, private addbytesservice: AddBytesService) {
    this.employeeName = this.authenticationService.credentials.firstName;
    this.role = this.authenticationService.credentials.role;
    this.userUrl = this.authenticationService.credentials.userUrl;
    this.cartValue = 0;
    this.totalAmount = 0;
    this.cartLength = 0;
    this.getCart();
  }

  ngOnInit() {
    this.cartService.getCartValue().subscribe(value => {
      this.cartLength = 0;
      this.cartValue = value.value;
      this.cartItems = value.item;
      this.cartItems.filter (cart => {
        this.cartLength += cart.quantity;
      });
      console.log(value);
    }
    );
  }
  getCart() {
    this.cartLength = 0;
    this.cartItems = JSON.parse(localStorage.getItem('cart'));
    if (this.cartItems != null) {
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
      this.cartItems.filter (cart => {
        this.cartLength += cart.quantity;
      });
    }
    console.log(this.cartItems);
    this.cartValue = this.totalAmount;
  }
  ngAfterViewInit() {
    $('.ui.sidebar').sidebar({
      context: $('.layout'),
      transition: 'overlay'
    }).sidebar('attach events', '#mobile_item');
    $('.ui .dropdown').dropdown();
  }
  closeSideBar() {
    $('.ui.sidebar')
  .sidebar('toggle')
;
  }
  showCart() {
    if (this.cartItems !== null) {
    this.cartItems = this.cartItems.filter(item => {
      return item.quantity !==  0;
    });
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    if (this.cartValue > 0) {
      this.router.navigate(['/employee/cart']);
    } else {
      this.notification.notify('info', 'No added items to display');
    }
  } else {
    this.notification.notify('info', 'No added items to display');
  }
  }
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['login']);
  }

  creditBytesDetails() {
    this.getLastUpdateDetails().subscribe(date => this.lastcreditedDetails = date);
    $('.mini.modal')
    $('#credit-bytes-modal').modal('show');
    console.log(this.lastcreditedDetails, 'time');
  }

  getLastUpdateDetails(): Observable<string> {
    return this.addbytesservice.getLastUpdateDetails();
  }

  creditBytes() {
    this.messageCreditBytes = this.bytes + ' Bytes credited globally';
    this.addbytesservice.creditBytes(this.bytes);
    this.notification.notify('success', this.messageCreditBytes);
    this.closeModal();
    this.bytes=300;
  }

  closeModal() {
    $('.small.modal')
    $('#credit-bytes-modal').modal('hide');
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
  'status'?: string;
  'amount'?: number;
  
}
