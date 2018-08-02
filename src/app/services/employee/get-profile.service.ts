import { Injectable } from '@angular/core';
import { HttpserviceService } from '../httpservice.service';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
@Injectable()
export class GetProfileService {

  constructor(private http: HttpserviceService) { }
  getProfile(): Observable<Profile> {
    return this.http.get('employee/profile');
  }

  updateProfile(profiles: Profile): Observable<Profile> {
    return this.http.post('employee/profile', profiles);
  }

  updatePasswords(password: string, newPassword: string): Observable<Profile> {
    console.log('hitting update password service');
    console.log(password);
    console.log(newPassword);

    const body = new HttpParams().set('currentPassword', password).set('newPassword', newPassword);
    return this.http.post('employee/profile/reset', body);
  }
}
class Profile {
  'added'?: true;
  'firstName'?: string;
  'lastName'?: string;
  'emailId'?: string;
  'employeeCode'?:string;
  'contactNumber'?: string;
  'bytes'?: number;
  'pin'?: number;
  'password'?: string;
  'userUrl'?:string;
}

