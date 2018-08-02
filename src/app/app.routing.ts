import { Routes, CanActivate } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { AuthenticationGuard } from './services/authentication/authentication.guard';
import { LoginComponent } from './views/login/login.component';
import { AuthGuard } from './app.guard';
import { OrderHistoryComponent } from './views/order-history/order-history.component';
import { OrderQueueComponent } from './views/order-queue/order-queue.component';
import { PendingOrdersComponent } from './views/pending-orders/pending-orders.component';
import { AboutComponent } from './views/about/about.component';
import { CategoryComponent } from './views/category/category.component';
import { EmployeeReportsComponent } from './views/employee/employee-reports/employee-reports.component';
import { AdditemsComponent } from './views/additems/additems.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { EmployeelayoutComponent } from './components/employeelayout/employeelayout.component';
import { EmployeeGuard } from './employee.guard';
import { MenuComponent } from './views/menu/menu.component';
import { CartComponent } from './views/cart/cart.component';
import { EmployeeOrderDetailsComponent } from './views/employee/order-details/employee-order-details.component';
import { EmployeeOrderHistoryComponent } from './views/employee/order-history/employee-order-history.component';
import { ReportsComponent } from '../app/views/reports/reports.component';
import { ProfileComponent } from '../app/views/employee/profile/profile.component';
import { VendororderComponent } from './views/vendororder/vendororder.component';
import { VendorcartComponent } from './views/vendorcart/vendorcart.component';
import { AdminReportsComponent } from './views/admin/admin-reports/admin-reports.component';
import { UpdateavailabilityComponent } from './views/updateavailability/updateavailability.component';
import { AdminGuard } from './admin.guard';
import { UserComponent } from './views/user/user.component';
export const ROUTES: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home', component: SidebarComponent, canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'pendingOrders'
      },
      {
        path: 'additems',
        component: AdditemsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'pendingOrders',
        component: PendingOrdersComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'orderQueue',
        component: OrderQueueComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'orderHistory',
        component: OrderHistoryComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'updateAvailablity',
        component: UpdateavailabilityComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'category',
        component: CategoryComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'newOrder',
        component: VendororderComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'vendorCart',
        component: VendorcartComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'employee', component: EmployeelayoutComponent, canActivate: [EmployeeGuard],
    children: [
      {
        path: '',
        redirectTo: 'menu',
        pathMatch: 'full'
      },
      {
        path: 'menu',
        component: MenuComponent,
        canActivate: [EmployeeGuard]
      },
      {
        path: 'cart',
        component: CartComponent,
        canActivate: [EmployeeGuard]
      },
      {
        path: 'orderDetails',
        component: EmployeeOrderDetailsComponent,
        canActivate: [EmployeeGuard]
      },

      {
        path: 'orderHistory',
        component: EmployeeOrderHistoryComponent,
        canActivate: [EmployeeGuard]
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [EmployeeGuard]
      },
      {
        path: 'viewReport',
        component: EmployeeReportsComponent,
        canActivate: [EmployeeGuard]
      },
      {
        path: 'report',
        component: AdminReportsComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'users',
        component: UserComponent,
        canActivate: [AdminGuard]
      }

    ]
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
