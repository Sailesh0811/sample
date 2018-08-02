import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './services/authentication/authentication.service';
import { MockAuthenticationService } from './services/authentication/authentication.service.mock';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor( public router: Router, private authenticationservice: AuthenticationService) {}
  public redirectUrl: string;
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('inside guard');
    if (this.authenticationservice.credentials.role === 'ROLE_Vendor') {
      console.log('fadfad');
      return true;
    }
    console.log(state.url);
    this.router.navigate(['login'], { replaceUrl: true });
    return false;
  }
}
