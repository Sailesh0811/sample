import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from '../../services/admin/user.service';
import { NotificationService } from '../../services/notification.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UserFilterPipe } from '../../userFilter.pipe';
declare var $: any;
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, AfterViewInit {
  users: User[] = [];
  usersList: User[] = [];
  firstName: string;
  lastName: string;
  employeeCode: string;
  pin: string;
  contactNumber: string;
  emailId: string;
  bytes: string;
  id: number;
  updateForm: FormGroup;
  query: string;
  noResults: boolean;
  addUserForm: FormGroup;
  role: string;
  constructor(private userService: UserService,
    private notification: NotificationService,
    private formBuilder: FormBuilder, private filter: UserFilterPipe) {
    this.noResults = false;
  }

  ngOnInit() {
    this.createForm();
    this.createAddUserForm();
    this.notification.loader(true);
    this.userService.getAllUsers().subscribe(user => {
      this.users = user;
      this.usersList = user;
      this.roleFilter();
      this.notification.loader(false);
    }, error => {
      console.log(error);
      this.notification.loader(false);
    });
  }
  ngAfterViewInit() {
    $('.coupled.modal').modal({
      allowMultiple: false
    });

    $('.second.modal').modal('attach events', '.first.modal .button');


  }
  search() {
    console.log('dafafd' + 'search');
    this.users = this.filter.transform(this.usersList, this.query.trim());
    console.log(this.users);
    if (this.users.length === 0) {
      this.noResults = true;
    } else {
      this.noResults = false;
    }
  }
  showUser(user: User) {
    $('#update').modal('toggle');
    console.log(user.firstName);
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.employeeCode = user.employeeCode;
    this.contactNumber = user.contactNumber;
    this.bytes = user.bytes;
    this.id = user.id;
    this.updateForm.patchValue({
      bytes: this.bytes,
      remarks: ''
    });
  }
  private createForm() {
    this.updateForm = this.formBuilder.group({
      bytes: ['', Validators.required],
      remarks: ['', Validators.required]
    });
  }
  updateBytes() {
    let editUser: User;
    editUser = {};
    editUser.id = this.id;
    editUser.bytes = this.updateForm.value.bytes;
    editUser.remarks = this.updateForm.value.remarks;
    this.userService.editUser(editUser).subscribe(response => {
      $('#update').modal('toggle');
      this.notification.notify('success', 'Bytes updated successfully');
      this.userService.getAllUsers().subscribe(resp => {
        this.users = resp;
        this.usersList = resp;
        this.roleFilter();
      });
    }, error => {
      this.notification.notify('error', 'Sorry some error occurred');
    });
  }
  closeModal() {
    $('.second.modal').modal('toggle');
  }
  deleteUser() {

    this.userService.deleteUser(this.id).subscribe(resp => {
      $('.second.modal').modal('toggle');
      this.notification.notify('success', 'User ' + this.firstName + ' is deleted');
      this.userService.getAllUsers().subscribe(response => {
        this.users = response;
        this.usersList = response;
        this.roleFilter();
      });
    }, error => {
      this.notification.notify('error', 'Sorry some error occurred');
    });
  }
  confirmDelete() {
    $('.second.modal').modal({
      transition: 'fade up'
    }).modal('show');
  }
  openAddUserModal() {

    $('#addUser').modal('toggle');

  }
  createAddUserForm() {
    this.addUserForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      employeeCode: ['', Validators.required],
      pin: ['', Validators.required],
      email: ['', ''],
      role: ['', Validators.required]

    });
  }
  addUser() {
    let user: User;
    user = {};
    user.firstName = this.addUserForm.value.firstName;
    user.lastName = this.addUserForm.value.lastName;
    user.employeeCode = this.addUserForm.value.employeeCode;
    user.pin = this.addUserForm.value.pin;
    user.emailId = this.addUserForm.value.email + '@coda.global' ;
    console.log('role' + this.addUserForm.value.role);
    user.role = this.addUserForm.value.role;
    user.bytes = '0';
    if (user.role === 'employee') {
      user.role = '3';
      user.pin = null;
    } else if (user.role === 'contractor') {
      user.role = '4';
      user.emailId = null;
    }
    $('#addUser').modal('toggle');
    this.notification.loader(true);
    this.userService.addUser(user).subscribe(response => {
      this.notification.loader(false);
      this.notification.notify('success', 'User added successfully');
      this.userService.getAllUsers().subscribe(users => {
        this.users = users;
        this.roleFilter();
      });
    }, error => {
      this.notification.loader(false);
      this.notification.notify('error', 'Soory some error occurred');
    });
  }
  roleFilter() {
    this.users = this.users.filter(users => {
      if (users.role === 'ROLE_Employee') {
        users.role = 'Employee';
      } else if (users.role === 'ROLE_Admin') {
        users.role = 'Admin';
      } else if (users.role === 'Vendor') {
        users.role = 'Vendor';
      } else if (users.role === 'ROLE_Contractor') {
        users.role = 'Contractor';
      }
      if (users.bytes === null) {
        users.bytes = '0';
      }
      return users;
    });
  }
}
class User {
  'firstName'?: string;
  'lastName'?: string;
  'emailId'?: string;
  'employeeCode'?: string;
  'role'?: string;
  'status'?: boolean;
  'userUrl'?: string;
  'bytes'?: string;
  'contactNumber'?: string;
  'id'?: number;
  'remarks'?: string;
  'pin'?: string;
}
