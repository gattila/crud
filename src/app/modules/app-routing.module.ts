import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersMasterComponent } from '../components/customers-master/customers-master.component';
import { CustomerDetailComponent } from '../components/customer-detail/customer-detail.component';

const routes: Routes = 
  [
  { path: 'customers', component: CustomersMasterComponent },
  { path: 'detail/:id', component: CustomerDetailComponent },
  { path: '', redirectTo: '/customers', pathMatch: 'full' }
  ];

@NgModule({ imports: [ RouterModule.forRoot(routes)], exports: [ RouterModule ] })

export class AppRoutingModule { }
