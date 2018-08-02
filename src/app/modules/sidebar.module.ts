import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Routes, RouterModule } from '@angular/router';
import { extract } from '../services/i18n/i18n.service';
import { LoginComponent } from '../views/login/login.component';
import { SharedModule } from './shared.module';
import { SidebarComponent} from '../components/sidebar/sidebar.component' ;
import { HomeComponent } from '../views/home/home.component' ;
import { AboutComponent } from '../views/about/about.component';
import { AdditemsComponent } from '../views/additems/additems.component';
import { PendingOrdersComponent } from '../views/pending-orders/pending-orders.component';
import { OrderQueueComponent } from '../views/order-queue/order-queue.component';
import { OrderHistoryComponent } from '../views/order-history/order-history.component';
import { AuthGuard } from '../app.guard';
import { HOMEROUTES } from '../home.route';
import { NotificationModule } from './notification.module';


@NgModule({
  imports: [
    CommonModule,
    NotificationModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbModule,
    SharedModule
  ],
  declarations: [
 
  ],
  exports: [
    
  ]
})
export class SidebarModule { }
