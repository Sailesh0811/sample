import { Injectable } from '@angular/core';
import { HttpserviceService } from './httpservice.service';

@Injectable()
export class GetcategoryService {

  constructor(private http: HttpserviceService) { }
  getCategory() {
    return this.http.get('/category');
  }
  getEmployeeCategory() {
    return this.http.get('/category');
  }
}
