import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Routes, RouterModule } from '@angular/router';
import { Route } from '../services/route/route.service';
import { extract } from '../services/i18n/i18n.service';
import { CoreModule } from './core.module';
import { SharedModule } from './shared.module';
import { HomeComponent } from '../views/home/home.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { OrderHistoryComponent } from '../views/order-history/order-history.component';
@NgModule({
  imports: [
    NgxDatatableModule,
    FormsModule,
    ModalModule.forRoot(),
    CommonModule,
    TranslateModule,
    CoreModule,
    SharedModule,
    RouterModule
  ],
  declarations: [
    OrderHistoryComponent
  ]
})
export class OrderHistoryModule {}
