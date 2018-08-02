import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MockAuthenticationService } from './authentication.service.mock' ;
import { Logger } from '../logger/logger.service';
const log = new Logger('VendorGuard');

@Injectable()
export class VendorGuard implements CanActivate {

  constructor(private authenticationService: MockAuthenticationService , private router: Router) {}
  canActivate(): boolean {
      return true;
    }
}

