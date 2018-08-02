import { Component, OnInit, Pipe, PipeTransform, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { GetitemsService } from '../../services/getitems.service';
import { SearchFilterPipe } from '../../searchPipe.filter';
import { NotificationService } from '../../services/notification.service';
import { GetcategoryService } from '../../services/getcategory.service';
import { AddcartserviceService } from '../../services/addcartservice.service';
import { HttpserviceService } from '../../services/httpservice.service';
import { List } from 'lodash';
declare var $: any;
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, AfterViewInit {
  itemsList: Item[] = [];
  items: Item[] = [];
  searchText: string;
  category: Category[] = [];
  temp1: Category[] = [];
  temp2: Category[] = [];
  selectedItemList: Category[] = [];
  itemsListbyCategory: Item[] = [];
  itemsSearchedbyCategory: Item[] = [];
  filterId: number;
  cartList: Item[] = [];
  cartValue: number;
  itemSelected: Item;
  ratingValue: number;
  review: string;
  noResults: boolean;
  shopStatus: boolean;
  constructor(private getItemService: GetitemsService, private filter: SearchFilterPipe,
    private notificationService: NotificationService, private categoryService: GetcategoryService,
    private cartService: AddcartserviceService, private httpService: HttpserviceService) {
    this.cartValue = 0;
    this.ratingValue = 0;
    this.noResults = false;
    this.shopStatus = false;
  }

  ngOnInit() {
    this.notificationService.loader(true);
    this.searchText=' ';
    this.searchText='';
    this.getItemService.getAvailableItems().subscribe(items => {
      this.notificationService.loader(false);
      this.itemsList = items;
      this.items = items;
      this.itemsList.filter(item => {
        return item.quantity = 0;
      });
      this.cartList = JSON.parse(localStorage.getItem('cart'));
      console.log(this.cartList + 'cartlist');
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
    this.httpService.get('employee/orders/pantryStatus').subscribe(resp => {
      this.shopStatus = resp;
    });
  }
  ngAfterViewInit() {
    $('.ui.dropdown')
      .dropdown({
        selectOnKeydown: false,
        showOnFocus: false
      })

    $('.ui.modal').remove();


  }
  clickCategory(cat: Category) {
    if (this.selectedItemList.indexOf(cat) == -1) {
      this.selectedItemList.push(cat);
    }
    this.search();

  }

  ngAfterViewChecked() {
    $('#categorySelect').dropdown('clear');
  }
  clearSelectedCategories() {
    this.selectedItemList = [];
    this.search();
  }

  search() { 
 
    this.itemsSearchedbyCategory = [];
    if (this.selectedItemList.length == 0) {
     
      this.itemsSearchedbyCategory = this.filter.transform(this.items, this.searchText.trim(), 100); 
    } else {
      this.selectedItemList.forEach(element => {
        
        this.itemsListbyCategory = this.filter.transform(this.items, this.searchText.trim(), element.id);
        this.itemsListbyCategory.forEach(itemSearch => {
          this.itemsSearchedbyCategory.push(itemSearch);
        })
      });
    }
    this.itemsList = this.itemsSearchedbyCategory;
    if (this.itemsList.length === 0) {
      this.noResults = true;
    } else {
      this.noResults = false;
    }
  }



  deselectedItem(item: Category) {

    this.temp1 = this.selectedItemList.slice(0, this.selectedItemList.indexOf(item));
    this.temp2 = this.selectedItemList.slice(this.selectedItemList.indexOf(item) + 1, this.selectedItemList.length + 1);
    this.selectedItemList = this.temp1.concat(this.temp2);
    this.search();

  }
  add(item: Item) {
    console.log(this.cartValue);
    this.cartValue += item.price;

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
  setRating(value: number) {
    console.log('set rating' + value);
    this.ratingValue = value;
    console.log('rating value' + this.ratingValue);
  }
  ratingsReviews(item: Item) {

    this.itemSelected = item;
    console.log("item", item);
    console.log(this.itemSelected.rating);
    $('.ui.rating')
    $('#item-user-rating').rating({
      initialRating: this.itemSelected.userRating,
      maxRating: 5,
      clearable: true,
      onRate: function (value: number) {
        localStorage.setItem('rating', JSON.stringify({ 'rating': value }));
        console.log(this.ratingValue = value);
      },
    });
    console.log(this.ratingValue);
    $('.long.modal')
    $('#rating-review-modal').modal('toggle', {
      detachable: false,
      observeChanges: false
    })
      ;
  }

  updateRatingReview(review: string, id: number) {
    console.log("update review", this.itemSelected.userRating, review, id);
    console.log(JSON.parse(localStorage.getItem('rating'))['rating']);
    // this.notificationService.loader(true);
    this.httpService.post('/employee/menu',
      { rating: JSON.parse(localStorage.getItem('rating'))['rating'], review: review, itemId: id })
      .subscribe(() => this.notificationService.loader(false));
    this.closeModal();
  }

  closeModal() {
    $('.long.modal')
    $('#rating-review-modal').modal('hide')
      ;
    this.review = '';
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

class Category {
  'id'?: number;
  'name'?: string;
  'status'?: boolean;
  'categoryUrl'?: string;
}
