import { Component, OnInit, ViewChild, ElementRef, AfterContentInit, OnDestroy } from '@angular/core';
import { chart } from 'highcharts';
import { variable } from '@angular/compiler/src/output/output_ast';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GetreportsService } from '../../../services/employee/getreports.service';
import { DatePipe } from '@angular/common';
import { NotificationService } from '../../../services/notification.service';


declare var $: any;
//importing reportlist dummy data for mock service
let array: any[] = [];
var i = 0;

@Component({
  selector: 'app-employee-reports',
  templateUrl: './employee-reports.component.html',
  styleUrls: ['./employee-reports.component.scss'],
  providers: [DatePipe]
})
export class EmployeeReportsComponent implements OnInit, OnDestroy {
  date: Date;
  today: number = Date.now();
  weekBefore: number;
  reportsForm: FormGroup;//this is for generating the from date,todate,category
  //assigning item wise data
  itemwisedata: itemlist[] = [];
  bytesUsed: number = 0;
  borrowedBytes: number = 0;
  lentBytes: number = 0;
  cash: number = 0;
  orderCount = 0;
  declinedOrderCount = 0;
  cancelledOrderCount = 0;
  trendingItems: itemlist[] = [];
  bytesBorrowedList: borrowDetails[] = [];
  bytesLentList: borrowDetails[] = [];
  bytesUsedList: borrowDetails[] = [];
  cashSpentList: borrowDetails[] = [];
  successfulOrdersList: borrowDetails[] = [];
  cancelledOrdersList: borrowDetails[] = [];
  declinedOrdersList: borrowDetails[] = [];
  minDate: Date;
  constructor(private formBuilder: FormBuilder, private getitemreport: GetreportsService,
    private datepipe: DatePipe, private notification: NotificationService) {
    this.date = new Date();
    this.date.setDate(this.date.getDate() - 7);
    this.weekBefore = this.date.valueOf();

    this.createForm();
  }
  private createForm() {
    this.reportsForm = this.formBuilder.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
    });
  }
  @ViewChild('chartTarget') chartTarget: ElementRef;
  chart: Highcharts.ChartObject;
  ngOnInit() {
    setTimeout(() => {
      this.fetchreport();

    }, 1000);

  }

  ngOnViewChange() {
    $('#bytesBorrowed').remove();
    $('#bytesLent').remove();

  }

  close() {
    $('#bytesBorrowed').modal('hide');
    $('#bytesLent').modal('hide');
    $('#bytesUsed').modal('hide');
    $('#cashSpent').modal('hide');
    $('#successfulOrders').modal('hide');
    $('#declinedOrders').modal('hide');
    $('#cancelledOrders').modal('hide');

  }
  ngOnDestroy() {
    this.chart = null;
    $('.ui.modal').remove();
  }
  showBorrowDetails() {
    $('#bytesBorrowed').modal('show', {
      detachable: false,
      observeChanges: false
    });

  }
  showLentDetails() {
    $('#bytesLent').modal('show', {
      detachable: false,
      observeChanges: false
    });
  }
  showBytesUsedDetails() {
    $('#bytesUsed').modal('show', {
      detachable: false,
      observeChanges: false
    });
  }
  showCashSpentDetails() {
    $('#cashSpent').modal('show', {
      detachable: false,
      observeChanges: false
    });
  }

  showSuccessfulOrderDetails() {
    $('#successfulOrders').modal('show', {
      detachable: false,
      observeChanges: false
    });
  }
  showDeclinedOrderDetails() {
    $('#declinedOrders').modal('show', {
      detachable: false,
      observeChanges: false
    });
  }
  showCancelledOrderDetails() {
    $('#cancelledOrders').modal('show', {
      detachable: false,
      observeChanges: false
    });
  }


  fetchreport() {
    // here write the service for fetching result set json array
    this.notification.loader(true);
    $('#toDate').prop('min', $('#fromDate').val());
    this.minDate = $('#fromDate').val();
    this.fetchCardDetails();
    console.log($('#fromDate').val());
    console.log($('#toDate').val());
    this.getitemreport.getItemReport($('#fromDate').val(), $('#toDate').val()).subscribe(item => {
      this.itemwisedata = item;
      this.drawone();
      this.notification.loader(false);
    });


  }
  fetchCardDetails() {
    console.log('entering fetch card details');
    this.getitemreport.getBytesUsed($('#fromDate').val(),
      $('#toDate').val()).subscribe(bytes => this.bytesUsed = bytes);
    this.getitemreport.getCash($('#fromDate').val(),
      $('#toDate').val()).subscribe(amount => this.cash = amount);
    this.getitemreport.getQuantities($('#fromDate').val(), $('#toDate').val())
      .subscribe(item => { this.trendingItems = item; });
    this.getitemreport.getBorrowedBytes($('#fromDate').val(),
      $('#toDate').val()).subscribe(bytes => this.borrowedBytes = bytes);
    this.getitemreport.getLentBytes($('#fromDate').val(),
      $('#toDate').val()).subscribe(bytes => this.lentBytes = bytes);
    this.getitemreport.getOrderNumber($('#fromDate').val(),
      $('#toDate').val()).subscribe(count => this.orderCount = count);
    this.getitemreport.getDeclinedOrderNumber($('#fromDate').val(),
      $('#toDate').val()).subscribe(declinedCount => this.declinedOrderCount = declinedCount);
    this.getitemreport.getCancelledOrderNumber($('#fromDate').val(),
      $('#toDate').val()).subscribe(declinedCount => this.cancelledOrderCount = declinedCount);
    this.getitemreport.getBytesBorrowedList($('#fromDate').val(),
      $('#toDate').val()).subscribe(list => this.bytesBorrowedList = list);
    this.getitemreport.getBytesLentList($('#fromDate').val(),
      $('#toDate').val()).subscribe(list => this.bytesLentList = list);
    this.getitemreport.getBytesUsedDetails($('#fromDate').val(),
      $('#toDate').val()).subscribe(bytes => this.bytesUsedList = bytes);
    this.getitemreport.getCashSpentDetails($('#fromDate').val(),
      $('#toDate').val()).subscribe(cash => this.cashSpentList = cash);
    this.getitemreport.getSuccessfulOrderDetails($('#fromDate').val(),
      $('#toDate').val()).subscribe(orders => this.successfulOrdersList = orders);
    this.getitemreport.getCancelledOrderDetails($('#fromDate').val(),
      $('#toDate').val()).subscribe(orders => this.cancelledOrdersList = orders);
    this.getitemreport.getDeclinedOrderDetails($('#fromDate').val(),
      $('#toDate').val()).subscribe(orders => this.declinedOrdersList = orders);
  }

  drawone() {
    array = [];
    console.log(this.itemwisedata.length);
    if (this.itemwisedata.length > 0) {
      $('#chartone').show();
      for (let i of this.itemwisedata) {
        array.push([i.name, i.quantity]);
        console.log(array);
      }
      const options: Highcharts.Options = {
        chart: {

          type: 'pie',
          options3d: {
            enabled: true,
            alpha: 26
          }
        },
        title: {
          text: 'Item Graph'
        },
        colors: [
          '#fff176 ',
          '#69f0ae',
          '#b2dfdb',
          '#80699B',
          '#3D96AE',
          '#DB843D',
          '#92A8CD',
          '#A47D7C',
          '#B5CA92'
        ],
        plotOptions: {
          pie: {
            innerSize: 40,
            depth: 20
          },
          column: {
            colorByPoint: true
          }
        },
        series: [{
          name: 'Item bought',
          data: array,
        }]

      };
      this.chart = chart(this.chartTarget.nativeElement, options);
    }
    else {
      $('#chartone').hide();
    }

  }

}
class itemlist {
  name: string;
  quantity: number
}

class borrowDetails {
  id: number;
  name: string;
  date: Date;
  amount: number;
  bytes: number;
  borrow: number;
  cash: number;
}