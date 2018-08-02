import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from '../authentication/authentication.service';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { HttpParams } from '@angular/common/http';
import { HttpserviceService } from '../../services/httpservice.service';
@Injectable()
export class UserService {

    constructor(private http: HttpserviceService) { }
    getAllUsers() {
        return this.http.get('/admin/get_all_users');
    }
    editUser(user: any) {
        return this.http.post('/admin/edit_user', user);
    }
    deleteUser(user: number) {
        const body = new HttpParams().set('userId', user + '');
        return this.http.post('/admin/delete_user', body);
    }
    addUser(user: any) {
        return this.http.post('/admin/add_user', user);
    }
}
