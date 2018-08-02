import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdditemsService } from '../../services/additems.service';
import { GetcategoryService } from '../../services/getcategory.service';
declare var $: any;
@Component({
  selector: 'app-additems',
  templateUrl: './additems.component.html',
  styleUrls: ['./additems.component.scss']
})
export class AdditemsComponent implements OnInit, AfterViewInit {
  addItemForm: FormGroup;
  isDisabled = true;
  selected: number;
  item: Item = {};
  visible = false;
  category: Category[] = [];
  constructor(private formBuilder: FormBuilder, private additemservice: AdditemsService,
    private getcategory: GetcategoryService) {
    this.createForm();
  }

  ngOnInit() {
    this.getcategory.getCategory().subscribe(category => this.category = category);
    this.selected = 1;
  }
  ngAfterViewInit() {
    $('.ui.dropdown')
      .dropdown({
        selectOnKeydown: false,
        showOnFocus: true
      });
  }
  verify() {
    this.isDisabled = true;
    if (this.addItemForm.controls['itemname'].value.length > 0) {
      this.isDisabled = true;
      if (this.addItemForm.controls['itemprice'].value > 0 && !isNaN(this.addItemForm.value.itemprice)) {
        this.isDisabled = true;
        if (this.addItemForm.controls['itemdesc'].value.length > 0) {
          this.isDisabled = true;
          if (this.selected > 0) {
            this.isDisabled = false;
          }
        }
      }
    }
  }


  private createForm() {
    this.addItemForm = this.formBuilder.group({
      itemname: ['', Validators.required],
      itemprice: ['', Validators.required],
      itemdesc: ['', Validators.required],
      itemcategory: ['', Validators.required]
    });
  }

  changeprop(id: number) {
    this.selected = id;
  }
  addItem() {
    this.isDisabled = true;
    if (this.addItemForm.controls['itemname'].value.length > 0) {
      if (this.addItemForm.controls['itemprice'].value > 0) {
        if (this.addItemForm.controls['itemdesc'].value.length > 0) {
          if (this.selected > 0) {
            this.item.name = this.addItemForm.value.itemname;
            this.item.description = this.addItemForm.value.itemdesc;
            this.item.categoryId = this.selected;
            this.item.price = this.addItemForm.value.itemprice;
            this.item.status = true;
            this.item.availability = true;
            this.item.imageUrl= this.item.categoryId+"";
            console.log(this.item);
            this.additemservice.addItems(this.item).subscribe(credentials => {
            }, error => {
              console.log('error');
            });
            this.visible = true;
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }

        }
      }
    }
  }
}

class Category {
  'id'?: number;
  'name'?: string;
  'status'?: boolean;
  'categoryUrl'?: string;
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