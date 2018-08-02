import { Component, OnInit, ViewChild, ElementRef, AfterContentInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, MinLengthValidator } from '@angular/forms';
import { GetProfileService } from '../../../services/employee/get-profile.service';
import { FeedbackService } from '../../../services/employee/feedback.service';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { timeout } from 'rxjs/operators';
import { NotificationService } from '../../../services/notification.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: []
})
export class ProfileComponent implements OnInit, OnDestroy {

  profileForm: FormGroup;
  feedbackForm: FormGroup;
  passwordForm: FormGroup;
  isDisabled = true;
  isHidden = true;
  visiblity = true;
  message = false;
  profileDetails: Profile;
  visible = false;
  btnvisibility = true;
  bytes: number;
  pinTypeChangeHit = 0;
  avatarArray = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  avatarManager = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  avatar: number;
  avatarCounter: number;
  constructor(private formBuilder: FormBuilder,
    private profileservice: GetProfileService, private sendfeedback: FeedbackService,
    private router: Router, private notification: NotificationService,
    private auth: AuthenticationService) {
    this.createForm();
    this.createFeedback();
    this.createPasswordForm();
    this.avatar = 0;
    this.avatarCounter = 1;
  }
  ngOnInit() {
    $('#profileUpdated').hide();
    $('#passwordSame').hide();
    this.notification.loader(true);
    this.profileservice.getProfile().subscribe(profileDetails => {
      this.notification.loader(false);
      this.profileDetails = profileDetails;
      console.log(this.profileDetails);
      this.profileForm.patchValue({
        firstName: this.profileDetails.firstName,
        lastName: this.profileDetails.lastName,
        emailId: this.profileDetails.emailId,
        employeeCode: this.profileDetails.employeeCode,
        contactNumber: this.profileDetails.contactNumber,
        pin: this.profileDetails.pin
      });
      this.avatarCounter = parseInt(this.profileDetails.userUrl);
      this.feedbackForm.patchValue({
        email: this.profileDetails.emailId,
      });
      this.bytes = this.profileDetails.bytes;
    });
  }
  ngOnDestroy() {
    $('.ui.modal').remove();
  }



  verify() {
    this.isDisabled = true;
    if (this.profileForm.controls.firstName.valid) {
      this.isDisabled = true;
      if (this.profileForm.controls.lastName.valid) {
        this.isDisabled = true;
        if (this.profileForm.value.pin.trim().length === 4 && !isNaN(this.profileForm.value.pin)) {
          this.isDisabled = true;
          if ((this.profileForm.controls['contactNumber'].value > 6000000000)
            && (this.profileForm.controls['contactNumber'].value < 9999999999)) {
            this.isDisabled = false;
          }
        }
      }
    }
  }
  validate() {
    this.visiblity = true;
    if (this.passwordForm.controls['password'].value != null) {
      if (this.passwordForm.controls['password'].value.length > 7) {
        this.visiblity = true;
        if (this.passwordForm.controls['newPassword'].value!=null) {
        if (this.passwordForm.controls['newPassword'].value.length > 7 &&
          (this.passwordForm.controls['newPassword'].value == this.passwordForm.controls['confirmPassword'].value)) {
          this.visiblity = false;
          $('#passwordMismatch').hide();
        }
        else if (this.passwordForm.controls['newPassword'].value.length > 7) {
          console.log(this.passwordForm.controls['confirmPassword'].value.length);
          if(this.passwordForm.controls['confirmPassword'].value!=null){
          if (this.passwordForm.controls['confirmPassword'].value.length > 0 && this.passwordForm.controls['newPassword'].value != this.passwordForm.controls['confirmPassword'].value) {
            console.log('password mismatch');
            $('#passwordMismatch').show();
          }
        }
        }
      }
    }
  }
}
updatePassword() {
  this.visiblity = true;
  if (this.passwordForm.controls['password'].value.length > 0) {
    this.visiblity = true;
    if (this.passwordForm.controls['newPassword'].value.length > 0 &&
      (this.passwordForm.controls['newPassword'].value == this.passwordForm.controls['confirmPassword'].value)) {
      $('#passwordMismatch').hide();
      this.visiblity = false;
      this.profileservice.updatePasswords(this.passwordForm.value.password,
        this.passwordForm.value.newPassword).subscribe(credentials => {
          $('#updateSuccess').show();
          setTimeout(() => {
            $('#updateSuccess').hide();
            $('.ui.medium.modal').modal('hide');
            setTimeout(() => {
              this.passwordForm.reset();
            }, 1000);

          }, 1000);

        }, error => {
          console.log('error');
          $('#updateFailed').show();
          setTimeout(() => {
            $('#updateFailed').hide();

          }, 3000);

        }
        );
    }
    else if (this.passwordForm.controls['newPassword'].value.length > 0 &&
      (this.passwordForm.controls['newPassword'].value != this.passwordForm.controls['confirmPassword'].value)) {
      console.log('password mismatch');
      $('#passwordMismatch').show();
    }
  }
}
  private createForm() {
  this.profileForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    emailId: ['', Validators.required],
    employeeCode: ['', Validators.required],
    contactNumber: ['', [Validators.required]],
    pin: ['', Validators.required],
    bytes: ['', Validators.required],
  });
}
nextAvatar() {
  this.avatar += 1;
  if (this.avatar > this.avatarManager.length - 1) {
    this.avatar = 0;
  }
  this.avatarCounter = this.avatarManager[this.avatar];
  console.log('avatar' + this.avatar);
  console.log('avatar counter' + this.avatarCounter);
  this.verify();
}
previousAvatar() {
  this.avatar--;
  if (this.avatar < 0) {
    this.avatar = this.avatarManager.length - 1;
  }
  this.avatarCounter = this.avatarManager[this.avatar];
  console.log('avatar' + this.avatar);
  console.log('avatar counter' + this.avatarCounter);
  this.verify();
}

  private createFeedback() {
  this.feedbackForm = this.formBuilder.group({
    email: ['', Validators.required],
    comment: ['', Validators.required],
  });
}

  private createPasswordForm() {
  this.passwordForm = this.formBuilder.group({
    password: ['', Validators.compose([Validators.minLength(8), Validators.required,
    Validators.maxLength(30)])],
    newPassword: ['', Validators.compose([Validators.minLength(8), Validators.required,
    Validators.maxLength(30)])],
    confirmPassword: ['', Validators.compose([Validators.minLength(8), Validators.required,
    Validators.maxLength(30)])]
  });
}


feedback() {

  $('#feedbackSentAlert').hide();
  $('#feedback').modal('show', {
    detachable: false,
    observeChanges: false
  });
}

showPasswordForm() {

  $('#updateFailed').hide();
  $('#passwordMismatch').hide();
  $('#updateSuccess').hide();
  $('#passwordChange').modal('show', {
    detachable: false,
    observeChanges: false
  });
}

close() {

  $('#feedback').modal('hide');
  $('#passwordChange').modal('hide');
  this.feedbackForm.reset();
  this.passwordForm.reset();
}


pinVisibilityChange() {
  if (this.pinTypeChangeHit == 0) {
    $('#pin').prop('type', 'text');
    this.pinTypeChangeHit = 1;
  }
  else {
    $('#pin').prop('type', 'password');
    this.pinTypeChangeHit = 0;
  }


}
updateProfile() {
  this.isDisabled = true;
  if (this.profileForm.controls['firstName'].value.length > 0) {
    this.isDisabled = true;
    if (this.profileForm.controls['lastName'].value.length > 0) {
      this.isDisabled = true;
      if (this.profileForm.controls['pin'].value.length == 4) {
        this.isDisabled = true;

        if ((this.profileForm.controls['contactNumber'].value > 6000000000) && (this.profileForm.controls['contactNumber'].value < 9999999999)) {
          this.isDisabled = false;
          this.profileDetails.firstName = this.profileForm.value.firstName;
          this.profileDetails.lastName = this.profileForm.value.lastName;
          this.profileDetails.emailId = this.profileForm.value.emailId;
          this.profileDetails.contactNumber = this.profileForm.value.contactNumber;
          this.profileDetails.pin = this.profileForm.value.pin;
          this.profileDetails.bytes = this.profileForm.value.bytes;
          this.profileDetails.userUrl = this.avatarCounter + "";
          console.log(this.profileDetails);
          this.profileservice.updateProfile(this.profileDetails).subscribe(credentials => {
           this.notification.notify('success','profile updated successfully');
          }, error => {
            console.log('error');
          });
        }
      }
    }
  }
}



sendFeedback() {
  this.btnvisibility = true;
  if (this.feedbackForm.controls['comment'].value.length > 0) {
    console.log("feedback recorded and sent through mail");
    $('#feedbackSentAlert').show();
    setTimeout(() => {
      $('.ui.modal').modal('hide');
      this.sendfeedback.sendFeedback($('#comment').val()).subscribe();
      this.feedbackForm.reset();
    }, 2000);
  }
}


comments() {
  this.btnvisibility = true;
  if (this.feedbackForm.controls['comment'].value.length > 0) {
    this.btnvisibility = false;
  }
}
}

class Profile {
  'added'?: true;
  'firstName'?: string;
  'lastName'?: string;
  'emailId'?: string;
  'employeeCode'?: string;
  'contactNumber'?: string;
  'bytes'?: number;
  'pin'?: number;
  'password'?: string;
  'userUrl'?: string;

}
