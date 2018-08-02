import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GetitemsService } from '../../services/getitems.service';
import { SearchFilterPipe } from '../../searchPipe.filter';
import { NotificationService } from '../../services/notification.service';
import { GetcategoryService } from '../../services/getcategory.service';
import { AddcartserviceService } from '../../services/addcartservice.service';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-vendororder',
  templateUrl: './vendororder.component.html',
  styleUrls: ['./vendororder.component.scss']
})
export class VendororderComponent implements OnInit, AfterViewInit {
  itemsList: Item[] = [];
  items: Item[] = [];
  searchText: string;
  category: Category[] = [];
  filterId: number;
  cartList: Item[] = [];
  cartValue: number;
  cartItems: Item[] = [];
  noResults: boolean;

  constructor(private getItemService: GetitemsService, private filter: SearchFilterPipe,
    private notificationService: NotificationService, private categoryService: GetcategoryService,
    private cartService: AddcartserviceService, private router: Router) {
    this.cartValue = 0;
    this.noResults = false;
  }

  ngOnInit() {
    this.notificationService.loader(true);
    this.getItemService.getAvailableItems().subscribe(items => {
      this.notificationService.loader(false);
      this.itemsList = items;
      this.items = items;
      this.itemsList.filter(item => {
        return item.quantity = 0;
      });
      this.cartList = JSON.parse(localStorage.getItem('cart'));

      if (this.cartList !== null) {

        console.log(this.cartList);
        this.itemsList.filter(item => {
          this.cartList.filter(cart => {
            if (item.id === cart.id) {
              return item.quantity = cart.quantity;
            }
          });
        });
      }
      this.itemsList.filter(item => {
        this.cartValue += item.quantity * item.price;
      });
    });
    console.log(this.itemsList);
    this.categoryService.getEmployeeCategory().subscribe(category => this.category = category);
    console.log(this.items);
    this.filterId = 100;
    this.cartService.getCartValue().subscribe(value => {
      this.cartValue = value.value;
      this.cartItems = value.item;
      console.log(value);

    }
    );
  }
  ngAfterViewInit() {
    $('.ui.dropdown')
      .dropdown({
        selectOnKeydown: false,
        showOnFocus: true
      })
      ;

  }
  clickCategory(id: number) {
    console.log(id);
    this.filterId = id;
    this.search();
  }
  search() {
    console.log('dafafd' + 'search');
    this.itemsList = this.filter.transform(this.items, this.searchText, this.filterId);
    console.log(this.itemsList);
    if (this.itemsList.length === 0) {
      this.noResults = true;
    } else {
      this.noResults = false;
    }
  }
  add(item: Item) {
    console.log(item.id);
    this.cartValue += item.price;
    console.log('cartvalue' + this.cartValue);

    this.itemsList.filter(items => {
      if (items.id === item.id) {
        if (items.quantity === null) {
          items.quantity = 1;
        } else {
          items.quantity += 1;
        }
        this.cartService.addCartValue(this.cartValue, this.items);

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
      this.itemsList.filter(items => {
        if (items.id === item.id) {
          if (items.quantity === 1) {
            items.quantity = 0;
          } else {
            items.quantity -= 1;
          }
          this.cartService.addCartValue(this.cartValue, this.items);

        }
        return items;
      });
    }
  }
  showCart() {
    console.log('show cart');
    this.cartItems = this.cartItems.filter(item => {
      return item.quantity !== null;
    });
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    if (this.cartValue > 0) {
      this.router.navigate(['/home/vendorCart']);
    }
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
class Category {
  'id': number;
  'name': string;
}
