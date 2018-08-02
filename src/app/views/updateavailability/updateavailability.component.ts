import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UpdateavailabilityService } from '../../services/updateavailability.service';
import { GetitemsService } from '../../services/getitems.service';
import { GetcategoryService } from '../../services/getcategory.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { UpdateitemsService } from '../../services/updateitems.service';
import { HttpService } from '../../services/http/http.service';
import { HttpserviceService } from '../../services/httpservice.service';
import { SearchFilterPipe } from '../../searchPipe.filter';
import { NotificationService } from '../../services/notification.service';
declare var $: any;
@Component({
  selector: 'app-updateavailability',
  templateUrl: './updateavailability.component.html',
  styleUrls: ['./updateavailability.component.scss']
})
export class UpdateavailabilityComponent implements OnInit, AfterViewInit {
  itemarray: Item[] = [];
  itemList: Item[] = [];
  item: Item;
  itemToBeUpdated: Item;
  query: string;
  itemDetails: Item;
  visible: boolean;
  categories: number;
  category: Category[] = [];
  updateItemForm: FormGroup;
  selected: number;
  isDisabled: boolean;
  alertHide = true;
  noResults: boolean;
  constructor(private notificationService: NotificationService, private updateservice: UpdateavailabilityService, private getitemservice: GetitemsService,
    private getcategory: GetcategoryService, private formBuilder: FormBuilder, private http: HttpserviceService, private updateItemService: UpdateitemsService
    , private filter: SearchFilterPipe) {
    this.createForm();
    this.categories = 0;
    this.createForm();
  }
  ngOnInit() {
    $('#itemUpdated').hide();
    // this.getitemservice.getItem(id).subscribe(itemDetails => {
    //   this.itemDetails = itemDetails;
    //   this.updateItemForm.patchValue({
    //     itemName: this.itemDetails.name,
    //     itemCat: this.itemDetails.categoryId,
    //     itemPrice: this.itemDetails.price,
    //     itemDesc: this.itemDetails.description
    //   });
    // });
    this.getitemservice.getItems().subscribe(item => {
      this.itemarray = item;
      this.itemList = item;
    });
    this.getcategory.getCategory().subscribe(category => this.category = category);
    console.log(this.category), "cat";
    this.isDisabled = false;
    this.categories = 100;
  }
  ngAfterViewInit() {
    $('.special.cards .image').dimmer({
      on: 'hover'
    });
    $('.ui.dropdown')
      .dropdown({
        selectOnKeydown: true,
        showOnFocus: false
      })
      ;
    console.log($('#loadcheck').length);
  }
  viewOptions(item: Item) {
    this.itemToBeUpdated = item;
    this.updateItemForm.patchValue({
      itemname: this.itemToBeUpdated.name,
      itemcat: this.itemToBeUpdated.categoryId,
      itemprice: this.itemToBeUpdated.price,
      itemdesc: this.itemToBeUpdated.description
    });
    console.log(item);
    $('.small.modal')
    $('#items-option-modal').modal('setting', 'closable', false)
    $('#items-option-modal').modal('show');
  }
  closeModal() {
    $('.small.modal')
    $('#items-option-modal').modal('hide');
  }
  checkStatus() {
    this.changeprop(this.categories);
  }
  changeprop(id: number) {
    console.log(id);
    this.categories = id;
    this.itemarray = this.filter.transform(this.itemList, this.query, this.categories);
    if (this.itemarray.length === 0) {
      this.noResults = true;
      // this.notificationService.notify('error', 'Sorry no items matched your search');
    } else {
      this.noResults = false;
    }
  }
  changepropUpdateItem(id: number, imageUrl: string) {
  
     this.selected = id;
    this.itemToBeUpdated.categoryId = this.selected;
    this.itemToBeUpdated.imageUrl = imageUrl;
    console.log("inside change prop update item", id);

  }
  dim(item: Item) {
    if ($('#' + item.id + "status").prop("checked") == true) {
      console.log('Unavailable');
      item.availability = true;
      this.updateservice.updateAvailability(item);
    }
    else {
      item.availability = false;
      this.updateservice.updateAvailability(item);
      console.log('Available');
    }
  }
  //for updating item details
  verify() {
    if (this.updateItemForm.controls['itemname'].value.length > 0) {
      if (this.updateItemForm.controls['itemprice'].value > 0) {
        if (this.updateItemForm.controls['itemdesc'].value.length > 0) {
          if (this.selected > 0) {
            this.isDisabled = false;
          }
        }
      }
    }
  }
  private createForm() {
    this.updateItemForm = this.formBuilder.group({
      itemname: ['', Validators.required],
      itemcat: ['', Validators.required],
      itemprice: ['', Validators.required],
      itemdesc: ['', Validators.required]
    });
  }
  updateItem(itemToBeUpdated: Item) {
    console.log('inside update item');
    this.item=itemToBeUpdated;
      this.item.name = this.updateItemForm.value.itemname;
      this.item.categoryId = this.itemToBeUpdated.categoryId;
      this.item.description = this.updateItemForm.value.itemdesc;
      this.item.price = this.updateItemForm.value.itemprice;
      this.item.imageUrl = this.itemToBeUpdated.categoryId+"";
      console.log(this.item);
       this.http.post('items/update_item', this.item)
       .subscribe((response: Response) => console.log(response));
      this.closeModal();
  }
  

updateAvailability(item: Item) {
  this.http.post('items/update_status', item)
    .subscribe((response: Response) => console.log(response));
  setTimeout(() => {
    window.location.reload();
  }, 2000);
  this.visible = true;
}
deleteItem(item: Item) {
  this.http.post('items/delete', item)
    .subscribe((response: Response) => console.log(response)); setTimeout(() => {
      window.location.reload();
    }, 2000);
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