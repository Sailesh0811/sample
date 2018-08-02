import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { ConnectionBackend } from '@angular/http';
import { CoreModule, createHttpService } from './modules/core.module';
import { SharedModule } from './modules/shared.module';
import { HomeModule } from './modules/home.module';
import { AboutModule } from './modules/about.module';
import { LoginModule } from './modules/login.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ReactiveFormsModule } from '@angular/forms';
import { SidebarModule } from './modules/sidebar.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HttpService } from './services/http/http.service';
import { AuthenticationService } from './services/authentication/authentication.service';
import { AuthenticationGuard } from './services/authentication/authentication.guard';
import { I18nService } from './services/i18n/i18n.service';
import { HttpCacheService } from './services/http/http-cache.service';
import { RouteReuseStrategy, Routes, RouterModule } from '@angular/router';
import { RouteReusableStrategy } from './services/route/route-reusable-strategy';
import { MockAuthenticationService } from './services/authentication/authentication.service.mock';
import { Route } from './services/route/route.service';
import { HomeComponent } from './views/home/home.component';
import { ROUTES } from './app.routing';
import { AuthGuard } from './app.guard';
import { AdditemsComponent } from './views/additems/additems.component';
import { PendingOrdersComponent } from './views/pending-orders/pending-orders.component';
import { PendingOrdersModule } from './modules/pending-orders.module';
import { OrderQueueModule } from './modules/order-queue.module';
import { OrderHistoryComponent } from './views/order-history/order-history.component';
import { OrderHistoryModule } from './modules/order-history.module';
import { AdditemsService } from './services/additems.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from './app.interceptor';
import { GetitemsService } from './services/getitems.service';
import { UpdateavailabilityService } from './services/updateavailability.service';
import { GetorderService } from './services/getorder.service';
import { UpdateorderService } from './services/updateorder.service';
import { ReportsComponent } from './views/reports/reports.component';
import { GetitemreportService } from './services/getitemreport.service';
import { NotificationModule } from './modules/notification.module';
import { NotifyDirective } from './components/notify.directive';
import { NotificationComponent } from './components/notification/notification.component';
import { CategoryComponent } from './views/category/category.component';
import { NotificationService } from './services/notification.service';
import { HttpserviceService } from './services/httpservice.service';
import { GetcategoryService } from './services/getcategory.service';
import { EmployeelayoutComponent } from './components/employeelayout/employeelayout.component';
import { EmployeeGuard } from './employee.guard';
import { EmployeeOrderDetailsModule } from './modules/employee-order-details.module';
import { EmployeeOrderHistoryComponent } from './views/employee/order-history/employee-order-history.component';
import { EmployeeOrderHistoryModule } from './modules/employee-order-history.module';
import { MenuComponent } from './views/menu/menu.component';
import { SearchFilterPipe } from './searchPipe.filter';
import { AddcartserviceService } from './services/addcartservice.service';
import { CartComponent } from './views/cart/cart.component';
import { EmployeeOrderDetailsComponent } from './views/employee/order-details/employee-order-details.component';
import { GetProfileService } from './services/employee/get-profile.service';
import { FeedbackService } from './services/employee/feedback.service';
import { GetreportsService } from './services/employee/getreports.service';
import { EmployeeReportsComponent } from './views/employee/employee-reports/employee-reports.component';
import { ProfileComponent } from './views/employee/profile/profile.component';
import { VendororderComponent } from './views/vendororder/vendororder.component';
import { VendorcartComponent } from './views/vendorcart/vendorcart.component';
import {UpdateavailabilityComponent } from './views/updateavailability/updateavailability.component';
import { UpdateitemsComponent } from './views/updateitems/updateitems.component';
import { AdminReportsComponent } from './views/admin/admin-reports/admin-reports.component';
import { AddBytesService } from './services/admin/add-bytes.service';
import { GetReportDataService } from './services/admin/get-report-data.service';
import { UpdateitemsService } from './services/updateitems.service';
import { CreditBytesComponent } from './views/credit-bytes/credit-bytes.component';
import { AdminlayoutComponent } from './components/adminlayout/adminlayout.component';
import { AdminGuard } from './admin.guard';
import { UserComponent } from './views/user/user.component';
import { UserService } from './services/admin/user.service';
import { UserFilterPipe } from './userFilter.pipe';
@NgModule({
  imports: [
    RouterModule.forRoot(ROUTES, { enableTracing: false }),
    NotificationModule,
    NgxDatatableModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    TranslateModule.forRoot(),
    NgbModule.forRoot(),
    CoreModule,
    SharedModule,
    HomeModule,
    AboutModule,
    LoginModule,
    PendingOrdersModule,
    OrderQueueModule,
    OrderHistoryModule,
    SidebarModule,
    HttpClientModule,
    ReactiveFormsModule,
    EmployeeOrderDetailsModule,
    EmployeeOrderHistoryModule,
    FormsModule  ],

  declarations: [AppComponent, AdditemsComponent, UpdateavailabilityComponent,
    ReportsComponent, NotifyDirective, NotificationComponent, CategoryComponent,
    SidebarComponent, EmployeelayoutComponent, MenuComponent, SearchFilterPipe, CartComponent,
    EmployeeReportsComponent, ProfileComponent, VendororderComponent, VendorcartComponent, 
    UpdateitemsComponent, AdminReportsComponent, CreditBytesComponent, AdminlayoutComponent,
     UserComponent, UserFilterPipe],
  providers: [
    NotificationService,
    GetcategoryService,
    AuthenticationService,
    MockAuthenticationService,
    AuthGuard,
    EmployeeGuard,
    AuthenticationGuard,
    AdditemsService,
    GetitemsService,
    UpdateavailabilityService,
    HttpserviceService,
    UpdateitemsService,
    I18nService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    HttpService,
    {
      provide: ConnectionBackend,
      deps: [XHRBackend, RequestOptions, HttpCacheService],
      useFactory: createHttpService
    },
    HttpCacheService,
    {
      provide: Http,
      deps: [XHRBackend, RequestOptions, HttpCacheService],
      useFactory: createHttpService
    },
    {
      provide: RouteReuseStrategy,
      useClass: RouteReusableStrategy
    },
    HttpModule,
    GetorderService,
    UpdateorderService,
    GetitemreportService,
    SearchFilterPipe,
    AddcartserviceService,
    GetreportsService,
    GetProfileService,
    FeedbackService,
    AddBytesService,
    GetReportDataService,
    UpdateitemsService,
    AdminGuard,
    UserService,
    UserFilterPipe
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
