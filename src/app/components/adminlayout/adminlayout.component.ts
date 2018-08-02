import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { HttpserviceService } from '../../services/httpservice.service';
import { Observable } from 'rxjs/Observable';

declare var $: any;
@Component({
  selector: 'app-adminlayout',
  templateUrl: './adminlayout.component.html'
})
export class AdminlayoutComponent implements OnInit, AfterViewInit {
  employeeName: string;
  lastcreditedDetails: string;
  messageCreditBytes: string;

  constructor(private authenticationService: AuthenticationService,private router: Router,private httpservice: HttpserviceService, private notificationService: NotificationService) {
    this.employeeName = this.authenticationService.credentials.firstName;
  }

  ngOnInit() {

  }
  ngAfterViewInit() {
    $('.ui.sidebar').sidebar({
      context: $('.layout'),
      transition: 'overlay'
    }).sidebar('attach events', '#mobile_item');

  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['login']);
  }

  creditBytesDetails(){
    this.getLastUpdateDetails().subscribe(msg => this.lastcreditedDetails = msg);
    $('.mini.modal')
      $('#credit-bytes-modal').modal('show');
      console.log(this.lastcreditedDetails,"time");
      
    return this.lastcreditedDetails;
    }

  getLastUpdateDetails(): Observable<string>{
    return this.httpservice.post('admin/credit',"");
  }

   creditBytes(){
     this.messageCreditBytes="300 Bytes credited globally";
     this.httpservice.get('admin/credit').subscribe();
     this.notificationService.notify("success",this.messageCreditBytes);
     this.closeModal();
   }

   closeModal(){
    $('.small.modal')
    $('#credit-bytes-modal').modal('hide');
   }
}