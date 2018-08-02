
import { Component, OnInit, ViewChild, ElementRef, AfterContentInit, OnDestroy } from '@angular/core';
import { chart } from 'highcharts';
import { variable } from '@angular/compiler/src/output/output_ast';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GetitemreportService } from '../../../services/getitemreport.service';
import { DatePipe } from '@angular/common';
import { GetReportDataService } from '../../../services/admin/get-report-data.service';
import { NotificationService } from '../../../services/notification.service';

declare var $: any;
//importing reportlist dummy data for mock service
let array: any[] = [];
let arraytwo: any[] = [];
var i = 0;
@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.scss'],
  providers: [DatePipe]
})
export class AdminReportsComponent implements OnInit, OnDestroy {
  today: number = Date.now();
  date: Date;
  weekBefore: number;
  reportsForm: FormGroup;//this is for generating the from date,todate,category
  //assigning item wise data
  weekwisedata: weekly[] = [];
  itemwisedata: itemlist[] = [];
  tableone: boolean;
  tabletwo: boolean;
  cashReceived = 0;
  declinedCount = 0;
  cancelCount = 0;
  bytesRemaining = 0;
  mostBought: itemlist[] = [];
  leastBought: itemlist[] = [];
  notBought: itemlist[] = [];
  orderCount = 0;
  cashTransactions: Transaction[] = [];
  bytesTransactions: Transaction[] = [];
  successfulOrdersList:Transaction[]=[];
  cancelledOrdersList:Transaction[]=[];
  declinedOrdersList:Transaction[]=[];
  constructor(private formBuilder: FormBuilder, private getitemreport: GetReportDataService,
    private datepipe: DatePipe, private notification: NotificationService) {
    this.date = new Date();
    this.date.setDate(this.date.getDate() - 7);
    this.weekBefore = this.date.valueOf();
    console.log("transferring.." + this.today.toString());
    this.createForm();
    this.reportsForm.controls['category'].setValue(1, { onlySelf: true });
  }

  private createForm() {
    this.reportsForm = this.formBuilder.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      category: ['', Validators.required]
    });
  }


  @ViewChild('chartTarget') chartTarget: ElementRef;
  @ViewChild('chartTargettwo') chartTargettwo: ElementRef;
  chart: Highcharts.ChartObject;
  ngOnInit() {
    setTimeout(() => {
      this.fetchreport();
     
    }, 1000);
    $('.ui.dropdown').dropdown();

  }
  ngOnDestroy() {
    this.chart = null;
    $('.ui.modal').remove();
  }

  close() {
    $('.ui.modal').modal('hide');
  }

  showDetailedCashReport() {
    $('#cashReceived').modal('show', {
      detachable: false,
      observeChanges: false
    });
  }
  showDetailedBytesReport() {
    $('#bytesReceived').modal('show', {
      detachable: false,
      observeChanges: false
    });
  }
  showSuccessfulOrderDetails(){
    $('#successfulOrders').modal('show', {
      detachable: false,
      observeChanges: false
    });
  }
  showDeclinedOrderDetails(){
    $('#declinedOrders').modal('show', {
      detachable: false,
      observeChanges: false
    });
  }
  showCancelledOrderDetails(){
    $('#cancelledOrders').modal('show', {
      detachable: false,
      observeChanges: false
    });
  }

  fetchCardDetails() {
    console.log('entering fetch card details');
    this.getitemreport.getCashReceived($('#fromDate').val(), $('#toDate').val()).subscribe(cashReceived => this.cashReceived = cashReceived);
    this.getitemreport.getBytesReceived($('#fromDate').val(), $('#toDate').val()).subscribe(bytes => this.bytesRemaining = bytes);
    this.getitemreport.getMostBought($('#fromDate').val(), $('#toDate').val()).subscribe(item => this.mostBought = item);
    this.getitemreport.getLeastBought($('#fromDate').val(), $('#toDate').val()).subscribe(item => { this.leastBought = item; });
    this.getitemreport.getOrderNumber($('#fromDate').val(), $('#toDate').val()).subscribe(count => this.orderCount = count);
    this.getitemreport.getNotBought($('#fromDate').val(), $('#toDate').val()).subscribe(item => { this.notBought = item; });
    this.getitemreport.getCancelledOrderCount($('#fromDate').val(), $('#toDate').val()).subscribe(count => this.cancelCount = count);
    this.getitemreport.getDeclinedOrderCount($('#fromDate').val(), $('#toDate').val()).subscribe(count => this.declinedCount = count);
    this.getitemreport.getDetailedCashReport($('#fromDate').val(), $('#toDate').val()).subscribe(list => this.cashTransactions = list);
    this.getitemreport.getDetailedBytesReport($('#fromDate').val(), $('#toDate').val()).subscribe(list => this.bytesTransactions = list);
    this.getitemreport.getSuccessfulOrderDetails($('#fromDate').val(),
    $('#toDate').val()).subscribe(orders => this.successfulOrdersList=orders);
    this.getitemreport.getCancelledOrderDetails($('#fromDate').val(),
    $('#toDate').val()).subscribe(orders => this.cancelledOrdersList=orders);
    this.getitemreport.getDeclinedOrderDetails($('#fromDate').val(),
    $('#toDate').val()).subscribe(orders => this.declinedOrdersList=orders);
  }



  fetchreport() {
    this.notification.loader(true);
    $('#toDate').prop('min', $('#fromDate').val());
    this.fetchCardDetails();
    if (this.reportsForm.controls['category'].value == 1) {
      console.log('one');
      this.getitemreport.getWeeklyGraph($('#fromDate').val(), $('#toDate').val()).subscribe(item => {
        this.weekwisedata = item;
        this.itemwisedata = [];
        this.drawone();
        $('#chartTwo').hide();
        this.notification.loader(false);
      });

    } else if (this.reportsForm.controls['category'].value == 2) {
      console.log('two');
      this.getitemreport.getItemReport($('#fromDate').val(), $('#toDate').val()).subscribe(item => {
        this.itemwisedata = item;
        this.weekwisedata = [];
        this.drawtwo();
        $('#chartOne').hide();
        this.notification.loader(false);
      });
    }

  }

  drawone() {

    arraytwo = [];
    if (this.weekwisedata.length > 0) {
      console.log('oneone');
      $('#chartOne').show();
      for (let i of this.weekwisedata) {
        arraytwo.push([i.firstName + ' ' + i.lastName, i.totalAmount]);
        console.log(arraytwo)
      }
      const options: Highcharts.Options = {
        chart: {
          type: 'column'
        },
        title: {
          text: 'UserWise Graph'
        },
        colors: [
          '#3D96AE',
          '#DB843D',
          '#92A8CD',
          '#A47D7C',
          '#B5CA92',
          '#4572A7',
          '#AA4643',
          '#89A54E',
          '#80699B'
        ],
        xAxis: {
          type: 'category',
          labels: {
            rotation: -25,
            style: {
              fontSize: '13px',
              fontFamily: 'Verdana, sans-serif'
            }
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Price(Rs)'
          }
        },
        legend: {
          enabled: false
        },
        tooltip: {
          pointFormat: 'Cost: <b>Rs {point.y:.1f}</b>'
        },
        series: [{
          name: 'itemname',
          data: arraytwo
        }],
        plotOptions: {
          column: {
            colorByPoint: true
          }
        }

      };

      this.chart = chart(this.chartTarget.nativeElement, options);

    }
    else if (this.weekwisedata.length == 0) {
      $('#chartOne').hide();
    }
  }
  drawtwo() {
    array = [];
    if (this.itemwisedata.length > 0) {
      console.log('two');
      for (let i of this.itemwisedata) {
        array.push([i.name, i.quantity]);
        console.log(array);
      }

      const options: Highcharts.Options = {

        chart: {
          type: 'column'
        },
        title: {
          text: 'ItemWise Graph'
        },
        colors: [
          '#4572A7',
          '#AA4643',
          '#89A54E',
          '#80699B',
          '#3D96AE',
          '#DB843D',
          '#92A8CD',
          '#A47D7C',
          '#B5CA92'
        ],
        xAxis: {
          type: 'category',
          labels: {
            rotation: -25,
            style: {
              fontSize: '13px',
              fontFamily: 'Verdana, sans-serif'
            }
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Quantity (number)'
          }
        },
        legend: {
          enabled: false
        },
        tooltip: {
          pointFormat: 'Items Sold: <b>{point.y:.1f} Quantity</b>'
        },
        series: [{
          name: 'itemname',
          data: array
        }],
        plotOptions: {
          column: {
            colorByPoint: true
          }
        }

      };


      this.chart = chart(this.chartTargettwo.nativeElement, options);
      $('#chartTwo').show();
    }
    else {
      $('#chartTwo').hide();
    }
  }
}

class weekly {
  userId: number;
  totalAmount: number;
  firstName: string;
  lastName: string;
}

class itemlist {
  name: string;
  quantity: number
}

class Transaction {
  id: number;
  name: string;
  orderInitiationTime: Date;
  cash: number;
  bytes: number;
  borrow: number;

}