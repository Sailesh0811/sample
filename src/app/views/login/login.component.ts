import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Logger } from '../../services/logger/logger.service';
import { I18nService } from '../../services/i18n/i18n.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { MockAuthenticationService } from '../../services/authentication/authentication.service.mock';
import { HttpserviceService } from '../../services/httpservice.service';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';

const log = new Logger('Login');
declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  version: string = environment.version;
  error: boolean;
  loginForm: FormGroup;
  isLoading = false;
  firstLogin: boolean;
  isDisabled = true;
  hideNext: boolean;
  avatarArray = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  avatarManager = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  avatar: number;
  avatarCounter: number;
  passwordMismatch: boolean;
  showLogin: boolean;
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private authenticationService: AuthenticationService,
    private http: HttpserviceService,
    private notification: NotificationService) {
    this.createForm();
    this.error = false;
    this.hideNext = true;
    this.avatarCounter = 1;
    this.avatar = 0;
    this.passwordMismatch = true;
    this.showLogin = false;
  }

  ngOnInit() {
    if (this.authenticationService.credentials !== null && 
      this.authenticationService.credentials !== undefined) {
      if (this.authenticationService.credentials.role === 'ROLE_Admin' ||
        this.authenticationService.credentials.role === 'ROLE_Employee') {
        this.router.navigate(['/employee/viewReport']);
      } else if (this.authenticationService.credentials.role === 'ROLE_Vendor') {
        this.router.navigate(['/home/reports']);
      }
    }
  }
  checkFirstLogin() {
    console.log(this.loginForm.controls['emailid'].value);
    this.http.post('users/check', { 'emailId': this.loginForm.controls['emailid'].value + '@coda.global' })
      .subscribe(success => {
        console.log(success);
        this.firstLogin = success;
        this.hideNext = false;
        if (!this.firstLogin) {

        } else {
          this.showLogin = true;
        }
      }, err => {
        if (err.status === 400) {
          this.notification.notify('error', 'Enter a valid email id');
          this.showLogin = false;

        }
        console.log(err);

      });
    this.firstLogin = true;
  }
  ngAfterViewInit() {
    $('.shape1').shape();
    $('.shape').shape();
  }
  changeText() {
    // $('.shape')
    // .shape('flip up').
    // onChange(setTimeout(() => {
    //   this.changeText();
    // }, 3000));
  }
  nextAvatar() {
    this.avatar += 1;
    if (this.avatar > this.avatarManager.length - 1) {
      this.avatar = 0;
    }
    this.avatarCounter = this.avatarManager[this.avatar];
  }
  previousAvatar() {
    this.avatar--;
    if (this.avatar < 0) {
      this.avatar = this.avatarManager.length - 1;
    }
    this.avatarCounter = this.avatarManager[this.avatar];
  }
  checkLength() {
    if (this.loginForm.controls['emailid'].value.length > 0) {
      log.debug(this.loginForm.controls['emailid'].value.length > 0);
      this.isDisabled = false;
    } else {
      log.debug('null');
      this.isDisabled = true;
    }
  }

  login() {
    this.isLoading = true;
    console.log('dadda' + this.loginForm.value.emailid);
    this.authenticationService.login(this.loginForm.value.emailid, this.loginForm.value.password).subscribe(
      user => {
        log.debug(user.firstName);
      },
      error => {
        log.debug(error);
      }
    );
  }
  register() {
    this.authenticationService.register(this.loginForm.value.emailid + '@coda.global', this.loginForm.value.firstName,
      this.loginForm.value.lastName, this.loginForm.value.mobileNumber, this.loginForm.value.confirmPassword,
      this.avatarManager[this.avatar], this.loginForm.value.pin);
  }
  validateRegister() {
    log.info('register');
    if (this.loginForm.value.emailid.length < 0) {
      this.isDisabled = true;
    } else if (this.loginForm.value.confirmPassword.length <= 0 || this.loginForm.value.registerPassword.length <= 0) {
      this.isDisabled = true;
    } else if (this.loginForm.value.confirmPassword !== this.loginForm.value.registerPassword) {
      this.isDisabled = true;
    } else if (this.loginForm.value.mobileNumber.length !== 10) {
      this.isDisabled = true;
    } else if (this.loginForm.value.firstName.length <= 0) {
      this.isDisabled = true;
    } else if (this.loginForm.value.pin.length !== 4) {
      this.isDisabled = true;
    } else if (isNaN(this.loginForm.value.pin)) {
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }
  }
  checkPassword() {


    if (this.loginForm.value.registerPassword === this.loginForm.value.confirmPassword) {

      this.passwordMismatch = true;
    } else {

      this.passwordMismatch = false;
    }

  }
  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }
  forgotPassword() {
    this.authenticationService.forgotPassword(this.loginForm.value.emailid + '@coda.global');
  }
  private createForm() {
    this.loginForm = this.formBuilder.group({
      emailid: ['', Validators.required],
      password: ['', Validators.required],
      remember: true,
      mobileNumber: ['', Validators.required],
      pin: ['', Validators.required],
      registerPassword: ['', Validators.compose([Validators.minLength(8), Validators.required,
      Validators.maxLength(30)])],
      confirmPassword: ['', Validators.minLength(8)],
      firstName: ['', Validators.required],
      lastName: ['', Validators.nullValidator]
    });
  }


}
