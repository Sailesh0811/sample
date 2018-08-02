import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Logger } from '../logger/logger.service';
import { MockAuthenticationService } from './authentication.service.mock';
import { AuthenticationService } from './authentication.service';

const log = new Logger('AuthenticationGuard');

@Injectable()
export class AuthenticationGuard implements CanActivate {

  constructor(public router: Router,
    public authenticationService: AuthenticationService) { }

  canActivate(): boolean {
    console.log('called');
    if (this.authenticationService.isAuthenticated()) {
      log.debug('Authenticated!');
      return true;
    }
    this.router.navigate(['/'], { replaceUrl: true });
    return false;
  }

}
