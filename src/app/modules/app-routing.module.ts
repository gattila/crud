import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersMasterComponent } from '../components/customers-master/customers-master.component';
import { CustomerDetailComponent } from '../components/customer-detail/customer-detail.component';
import { ProductsMasterComponent } from '../components/products-master/products-master.component'

const routes: Routes = 
  [
  { path: 'customers', component: CustomersMasterComponent },
  { path: 'products', component: ProductsMasterComponent },
  { path: 'detail/:id', component: CustomerDetailComponent },
  { path: '', redirectTo: '/customers', pathMatch: 'full' }
  ];

@NgModule({ imports: [ RouterModule.forRoot(routes)], exports: [ RouterModule ] })

export class AppRoutingModule { }
