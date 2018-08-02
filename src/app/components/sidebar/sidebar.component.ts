import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { NotificationComponent } from '../notification/notification.component';
import { Router } from '@angular/router';
import { AddcartserviceService } from '../../services/addcartservice.service';
import { NotificationService } from '../../services/notification.service';
declare var $: any;
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewInit {
  employeeName: string;
  cartValue: number;
  cartItems: Item[] = [];
  lastcreditedDetails: string;
  messageCreditBytes: string;
  role: string;
  totalAmount: number;
  cartLength: number;
  constructor(private authenticationService: AuthenticationService, private router: Router,
    private cartService: AddcartserviceService, private notification: NotificationService) {
    this.employeeName = this.authenticationService.credentials.firstName;
    this.role = this.authenticationService.credentials.role;
    this.cartValue = 0;
    this.cartLength = 0;
    this.totalAmount = 0;
  }

  ngOnInit() {
    this.cartService.getCartValue().subscribe(value => {
      this.cartLength = 0;
      this.cartValue = value.value;
      this.cartItems = value.item;
      this.cartItems.filter(cart => {
        this.cartLength += cart.quantity;
      });
      console.log(value);
    }
    );
    this.getCart();
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
      this.cartItems.filter(cart => {
        this.cartLength += cart.quantity;
      });
    }
    console.log(this.cartItems);
    this.cartValue = this.totalAmount;
  }
  showCart() {
    if (this.cartItems !== null) {
      this.cartItems = this.cartItems.filter(item => {
        return item.quantity !== 0;
      });
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
      if (this.cartValue > 0) {
        this.router.navigate(['/home/vendorCart']);
      } else {
        this.notification.notify('info', 'No added items to display');
      }
    } else {

      this.notification.notify('info', 'No added items to display');
    }
  }
  ngAfterViewInit() {
    $('.ui.sidebar').sidebar({
      context: $('.layout'),
      transition: 'overlay'
    }).sidebar('attach events', '#mobile_item');
    $('.ui.sticky')
      .sticky({
        context: ''
      })
      ;
    $('.ui .dropdown').dropdown();
  }
  logout() {
    this.authenticationService.logout();

    this.router.navigate(['login']);
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

