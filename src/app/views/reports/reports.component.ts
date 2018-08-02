import { Component, OnInit, ViewChild, ElementRef, AfterContentInit, OnDestroy } from '@angular/core';
import { chart } from 'highcharts';
import { variable } from '@angular/compiler/src/output/output_ast';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GetitemreportService } from '../../services/getitemreport.service';
import { DatePipe } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
declare var $: any;
//importing reportlist dummy data for mock service
let array: any[] = [];
let arraytwo: any[] = [];
var i = 0;
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  providers: [DatePipe]
})
export class ReportsComponent implements OnDestroy {
  today: number = Date.now();
  date: Date;
  weekBefore: number;
  reportsForm: FormGroup;//this is for generating the from date,todate,category
  //assigning item wise data
  weekwisedata: weekly[] = [];
  reportlist: reportlist[] = [];
  itemwisedata: itemlist[] = [];
  tableone: boolean;
  tabletwo: boolean;
  cashReceived = 0;
  cancelCount = 0;
  declinedCount = 0;
  bytesRemaining = 0;
  mostBought: itemlist[] = [];
  leastBought: itemlist[] = [];
  cashTransactions: Transaction[] = [];
  bytesTransactions: Transaction[] = [];
  notBought: itemlist[] = [];
  orderCount = 0;
  constructor(private formBuilder: FormBuilder, private getitemreport: GetitemreportService,
    private datepipe: DatePipe, private notificationService: NotificationService) {
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

  showDetailedCashReport() {
    $('#cashReceived').modal('show');
  }
  showDetailedBytesReport() {
     $('#bytesReceived').modal('show');
  }

  fetchCardDetails() {
    console.log('entering fetch card details');
    this.getitemreport.getCashReceived($('#fromDate').val(),
     $('#toDate').val()).subscribe(cashReceived => this.cashReceived = cashReceived);
    this.getitemreport.getBytesReceived($('#fromDate').val(),
     $('#toDate').val()).subscribe(bytes => this.bytesRemaining = bytes);
    this.getitemreport.getMostBought($('#fromDate').val(),
     $('#toDate').val()).subscribe(item => this.mostBought = item);
    this.getitemreport.getLeastBought($('#fromDate').val(),
     $('#toDate').val()).subscribe(item => { this.leastBought = item; });
    this.getitemreport.getOrderNumber($('#fromDate').val(),
     $('#toDate').val()).subscribe(count => this.orderCount = count);
    this.getitemreport.getNotBought($('#fromDate').val(),
     $('#toDate').val()).subscribe(item => { this.notBought = item; });
    this.getitemreport.getDeclinedOrderCount($('#fromDate').val(),
     $('#toDate').val()).subscribe(count => this.declinedCount = count);
    this.getitemreport.getCancelledOrderCount($('#fromDate').val(),
     $('#toDate').val()).subscribe(count => this.cancelCount = count);
    this.getitemreport.getDetailedCashReport($('#fromDate').val(),
     $('#toDate').val()).subscribe(list => this.cashTransactions = list);
    this.getitemreport.getDetailedBytesReport($('#fromDate').val(),
     $('#toDate').val()).subscribe(list => this.bytesTransactions = list);
  }
  close() {
    $('.ui.modal').modal('hide');
  }
  fetchreport() {
    this.notificationService.loader(true);
    $('#toDate').prop('min', $('#fromDate').val());
    this.fetchCardDetails();
    if (this.reportsForm.controls['category'].value == 1) {
      this.getitemreport.getWeeklyGraph($('#fromDate').val(), $('#toDate').val()).subscribe(item => {
        this.weekwisedata = item;
        this.itemwisedata = [];
        this.drawone();
        $('#chartTwo').hide();
        this.notificationService.loader(false);
      });
    } else if (this.reportsForm.controls['category'].value == 2) {

      this.getitemreport.getItemReport($('#fromDate').val(), $('#toDate').val()).subscribe(item => {
        this.itemwisedata = item;
        this.weekwisedata = [];
        this.drawtwo();
        $('#chartOne').hide();
        this.notificationService.loader(false);
      });
    }
  }
  drawone() {
    arraytwo = [];
    if (this.weekwisedata.length > 0) {
      $('#chartOne').show();
      for (let i of this.weekwisedata) {
        arraytwo.push([this.datepipe.transform(i.orderInitiationTime,'MMM d')
          , i.totalAmount]);
        console.log(arraytwo)
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
          text: 'DayWise Graph'
        },
        plotOptions: {
          pie: {
            innerSize: 50,
            depth: 30
          }
        },
        series: [{
          name: 'Amount collected',
          data: arraytwo,
        }]
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
  orderInitiationTime: Date;
  totalAmount: number;
}
class reportlist {
  id: number;
  orderInitiationTime: Date;
  totalAmount: number;
}
class itemlist {
  name: string;
  quantity: number;
}

class Transaction {
  id: number;
  name: string;
  orderInitiationTime: Date;
  cash: number;
  bytes: number;
  borrow:number;

}