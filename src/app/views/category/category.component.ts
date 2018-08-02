import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
declare var $: any;

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  addCategoryForm: FormGroup;
  item: Item;
  query: string;
  category: Category = {};
  cat: Category = {};
  categoryList: Category[] = [];
  editCategoryForm: FormGroup;
  selected: number;
  isDisabled: boolean;
  visible: boolean;
  idArray: number[] = [];
  found: boolean;
  display = false;
  newCat: Category = {};
  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
  }
  ngOnInit() {
    this.createForm();
    this.getCategory();
    this.idArray = [];
  }
  ngAfterViewInit() {
    this.idArray = [];
  }
  private getCategoryAdd() {
    this.http.get<Category[]>('/category').subscribe(list => {
      this.categoryList = list;
      console.log(this.categoryList);
      for (var i = 1; i < 6; i++) {
        this.found = false;
        for (var j = 0; j < this.categoryList.length; j++) {
          if (i === this.categoryList[j].id) {
            this.found = true;
          }

        }
        if (!this.found) {
          this.idArray.push(i);
          console.log('i' + i);

        }
      }
    });

  }
  private getCategory() {
    this.http.get<Category[]>('/category').subscribe(list => {
      this.categoryList = list;
      console.log(this.categoryList);
    });
  }

  editCategory(category: Category) {
 console.log("inside edit category");
 console.log(this.editCategoryForm.value.categoryname);
 
    this.cat=category;
    this.cat.name = this.editCategoryForm.value.categoryname;

    this.http.post('/category/updateCategory',  this.cat)
      .subscribe((response: Response) => console.log(response)); 
      this.closeUpdateCategoryModal()
  }
  deleteItem(cat: Category) {
    const body = new HttpParams().set('categoryId', cat.id.toString());
    this.http.post('/category/deleteCategory', body)
      .subscribe((response: Response) => console.log(response)); setTimeout(() => {
        window.location.reload();
      }, 2000);

  }
  changeprop(id: number) {
    this.selected = id;
    console.log("in changeproppp" + this.selected)
    for (var i = 0; i < this.categoryList.length; i++) {
      $("#" + this.categoryList[i].id).css("border", "none");
    }

    $("#" + id).css("border-bottom", "3px solid blue");
    console.log(this.selected);
    this.verify();
  }
  dim(cat: Category) {
    if ($('#' +cat.id + "status").prop("checked") == false) {
      console.log('available');
      this.http.post('category/deleteCategory', cat)
        .subscribe((response: Response) => console.log(response));
      this.visible = true;

    }
    else {
      console.log('unavailable');
      this.http.post('category/recreateCategory', cat)
        .subscribe((response: Response) => console.log(response));
      this.visible = true;
    }

  }
  changepropadd(id: number) {
    this.selected = id;
    console.log("in changeproppp" + this.selected)
    for (var i = 0; i < this.categoryList.length; i++) {
      $("#" + this.categoryList[i].id).css("border", "none");
    }

    $("#" + id).css("border-bottom", "3px solid blue");
    console.log(this.selected);
    this.verifyadd();
  }



  verify() {

    if (this.editCategoryForm.controls['itemcategory'].value.length > 0) {

      if (this.selected > 0) {
        this.isDisabled = false;
        console.log("isDisabled" + this.isDisabled);
      }
    }
  }
  verifyadd() {

    if (this.addCategoryForm.controls['itemcategoryadd'].value.length > 0) {

      if (this.selected > 0) {
        this.isDisabled = false;
        console.log("isDisabled" + this.isDisabled);
      }
    }
  }

  addCategory() {
    this.isDisabled = true;

    if (this.addCategoryForm.controls['itemcategoryadd'].value.length > 0) {


      if (this.selected > 0) {
        this.category.name = this.addCategoryForm.value.itemcategoryadd;
        this.category.id = this.selected;
        this.visible = true;
        this.http.post('/category/addCategory', this.category)
          .subscribe((response: Response) => console.log(response));
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }

    }
  }

  private createForm() {
    this.addCategoryForm = this.formBuilder.group({
      itemcategoryadd: ['', Validators.required]

    });
    this.editCategoryForm = this.formBuilder.group({
      categoryname: ['', Validators.required]

    });
  }
  updateCategory(cat: Category) {

    this.category = cat;
    this.editCategoryForm.patchValue({
      categoryname: this.category.name,
    });
    $('.small.modal')
    $('#editModel').modal('setting', 'closable', false)
    $('#editModel') .modal('show');
  }

  AddCatModal() {
    this.display = true;
    if (this.idArray.length == 0) { this.getCategoryAdd(); }
    $('.ui.small.modal')
    $('#addModal')
      .modal('setting','closable',false)
      .modal('show',)
      ;
  }

  closeUpdateCategoryModal() {
    $('.small.modal')
    $('#editModel').modal('hide');
  }
  closeModal(){
    $('.ui.small.modal')
    $('#addModal')
      .modal('hide')
      ;
      this.addCategoryForm.controls['itemcategoryadd'].setValue("");
    }

  addNewCat(){
    if (this.addCategoryForm.controls['itemcategoryadd'].value.length > 0) {
      this.newCat.name = this.addCategoryForm.controls['itemcategoryadd'].value;
      this.newCat.status = true;
      this.newCat.categoryUrl = "defaultCatIcon";
    }
    console.log("here");
    
    this.http.post("category/add_Category",this.newCat)
    .subscribe((response: Response) => console.log(response));setTimeout(() => {
      window.location.reload();
    }, 2000);
      this.closeModal();  
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
  'id'?: number;
  'name'?: string;
  'status'?: boolean;
  'categoryUrl'?: string;
}

