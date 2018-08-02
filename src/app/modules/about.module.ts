import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Routes, RouterModule } from '@angular/router';

import { Route } from '../services/route/route.service';
import { extract } from '../services/i18n/i18n.service';
import { AboutComponent } from '../views/about/about.component';
import { SharedModule } from './shared.module';



@NgModule({
  imports: [
   
    CommonModule,
    TranslateModule,
    SharedModule
  ],
  declarations: [
    AboutComponent
  ]
})
export class AboutModule { }
