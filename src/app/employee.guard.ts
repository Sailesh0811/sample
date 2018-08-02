import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './services/authentication/authentication.service';
import { MockAuthenticationService } from './services/authentication/authentication.service.mock';

@Injectable()
export class EmployeeGuard implements CanActivate {
  constructor(public router: Router, private authenticationservice: AuthenticationService) { }
  public redirectUrl: string;
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('inside employee guard');
    if (this.authenticationservice.credentials.role === 'ROLE_Employee' ||
      this.authenticationservice.credentials.role === 'ROLE_Admin') {
      console.log('employee guard');
      return true;
    }
    console.log(state.url);
    this.router.navigate(['login'], { replaceUrl: true });
    return false;
  }
}
