import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateitemsService } from '../../services/updateitems.service';
declare var $: any;
@Component({
 selector: 'app-updateitems',
 templateUrl: './updateitems.component.html',
 styleUrls: ['./updateitems.component.scss']
})
export class UpdateitemsComponent implements OnInit {
 updateItemForm: FormGroup;
 isDisabled = true;
 selected: number;
 item: Item = {};
 visible= false;
 constructor(private formBuilder: FormBuilder, private updateitemservice: UpdateitemsService) {
   this.createForm();
 }

 ngOnInit() {

 }
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
     itemprice: ['', Validators.required],
     itemdesc: ['', Validators.required]
   });
 }

 changeprop(id: number) {
   this.selected = id;

   for (var i = 0; i < 4; i++) {
     $("#" + i).css("border", "none");
   }
   $("#" + id).css("border-bottom", "3px solid blue");
 }
 updateItem() {
   this.isDisabled = true;
   // console.log('sdsd' + this.updateItemForm.value.itemdesc);
   if (this.updateItemForm.controls['itemname'].value.length > 0) {
     if (this.updateItemForm.controls['itemprice'].value > 0) {
       if (this.updateItemForm.controls['itemdesc'].value.length > 0) {
         if (this.selected > 0) {
           this.item.name = this.updateItemForm.value.itemname;
           this.item.description = this.updateItemForm.value.itemdesc;
           this.item.categoryId = this.selected;
           this.item.price = this.updateItemForm.value.itemprice;
           console.log(this.item.price);
           this.item.status = true;
           console.log(this.item);
           this.updateitemservice.updateItems(this.item).subscribe(credentials => {
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

class Item {
 'added'?: true;
 'categoryId'?: number;
 'description'?: string;
 'id'?: 0;
 'imageUrl'?: string;
 'name'?: string;
 'price'?: 0;
 'quantity'?: 0;
 'status'?: boolean;
 'availability'?: boolean;
}