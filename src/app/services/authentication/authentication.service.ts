import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Logger } from '../logger/logger.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpserviceService } from '../httpservice.service';
import { NotificationService } from '../notification.service';
export interface Credentials {
  // Customize received credentials here
  firstName?: string;
  token?: string;
  role?: string;
  userUrl?: string;
}

export interface LoginContext {
  emailid: string;
  password: string;
  remember?: boolean;
}

const credentialsKey = 'credentialsUser';
const log = new Logger('AuthenticationService');
/**
 * Provides a base for authentication workflow.
 * The Credentials interface as well as login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class AuthenticationService {

  user: User = {};
  private _credentials: Credentials = {};
  public redirectUrl: string;
  error: boolean;
  constructor(private http: HttpserviceService, private router: Router,
    private activatedRoute: ActivatedRoute, private notification: NotificationService) {
    const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      log.info('jj');
      this._credentials = JSON.parse(savedCredentials);
    }
  }

  /**
   * Authenticates the user.
   * @param {LoginContext} context The login parameters.
   * @return {Observable<Credentials>} The user credentials.
   */
  login(email: string, password: string): Observable<any> {
    this.http.post('users/login',
      { emailId: email + '@coda.global', password: password })
      .subscribe(response => {
        console.log(response);
        let firstName: string;
        let token: string;
        let role: string;
        let userUrl: string;
        this.user.firstName = firstName;
        firstName = response['firstName'];
        token = response['token'];
        role = response['role'];
        userUrl = response['userUrl'];
        this.setCredentials({ firstName: firstName, token: token, role: role, userUrl: userUrl }, true);
        this._credentials = { firstName: firstName, token: token, role: role, userUrl: userUrl };

        if (role === 'ROLE_Vendor') {
          log.debug('role vendor');
          this.router.navigate(['home'], { replaceUrl: true });
        } else if (role === 'ROLE_Admin') {
          log.info('admin');
          this.router.navigate(['employee/viewReport'], { replaceUrl: true });
        } else if (role === 'ROLE_Employee') {
          this.router.navigate(['employee/viewReport'], { replaceUrl: true });
          log.info('employee');
        }

      }, error => {
        console.log(error);
        if (error.status === 400) {
          this.notification.notify('error', 'Invalid credentials');
        }
        this.error = true;
      });

    return of(this.user);
  }
  register(emailId: string, firstName: string, lastName: string, contactNumber: number,
    password: string, userUrl: any, pin: number) {
    this.http.post('users/register', {
      'emailId': emailId,
      'firstName': firstName,
      'lastName': lastName,
      'contactNumber': contactNumber,
      'password': password,
      'pin': pin,
      'userUrl': userUrl
    }).subscribe(response => {
      log.info(response);
      this.notification.notify('success', 'You have been successfully regisered');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }, error => {
      log.info(error);
      this.notification.notify('error', 'Not registered try again');
      this.router.navigate(['login']);
    });
  }
  forgotPassword(email: string) {
    this.http.post('users/forgot', { emailId: email })
      .subscribe(response => {
        this.notification.notify('success', 'Your password is sent to your slack account');
      }, error => {
        this.notification.notify('error', 'Some problem error occured');
      });
  }

  /**
   * Logs out the user and clear credentials.
   * @return {Observable<boolean>} True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    // this.setCredentials();
    this._credentials = null;
    localStorage.removeItem(credentialsKey);
    return of(true);
  }

  /**
   * Checks is the user is authenticated.
   * @return {boolean} True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    log.debug(this._credentials.token !== undefined ? true : false);
    return this._credentials.token !== undefined ? true : false;
  }

  /**
   * Gets the user credentials.
   * @return {Credentials} The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials | null {
    log.info(this._credentials);
    return this._credentials;
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param {Credentials=} credentials The user credentials.
   * @param {boolean=} remember True to remember credentials across sessions.
   */
  public setCredentials(credentials: User, remember: boolean) {
    localStorage.setItem(credentialsKey,
      JSON.stringify({
        'firstName': credentials.firstName, 'token': credentials.token,
        'role': credentials.role, userUrl: credentials.userUrl
      }));

  }

}

class User {
  token?: string;
  firstName?: string;
  role?: string;
  userUrl?: string;
}
