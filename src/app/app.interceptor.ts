import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { AuthenticationService } from './services/authentication/authentication.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { NotificationService } from './services/notification.service';
import { Subject } from 'rxjs/Subject';
import { Notify } from './notify';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: AuthenticationService, private notificationService: NotificationService,
    private router: Router) { }
  intercept(request: HttpRequest<any>, next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.auth.credentials !== null) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.auth.credentials.token}`
        }
      });
  }
  request = request.clone({
    url: `${environment.serverUrl}/${request.url}`
  });
  return next.handle(request).do((event: HttpEvent<any>) => {
    console.log('intercepting');
    if (event instanceof HttpResponse) {
      console.log('success');
      console.log('code' + event.status);
      if (event.status === 201) {
        console.log('router is working');
      }
    }
  }, (err: any) => {
    console.log('intercepting');
    if (err instanceof HttpErrorResponse) {
      console.log(err.message);
      this.notificationService.loader(false);
      if (err.status === 401) {
        this.notificationService.notify('error', 'Session expired!');
        localStorage.removeItem('credentialsUser');
        sessionStorage.removeItem('credentialsUser');
        window.location.reload();
        this.router.navigate(['login']);
      }
    }
  });
}

}
