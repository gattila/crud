import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { CustomersMasterComponent } from './components/customers-master/customers-master.component';
import { CustomerDetailComponent } from './components/customer-detail/customer-detail.component';
import { MessagesComponent } from './components/messages/messages.component';
import { InvoiceComponent } from './components/invoice/invoice.component';

import { AppRoutingModule } from './modules/app-routing.module';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { ModalModule, BsDatepickerModule, PaginationModule, TabsModule, TypeaheadModule } from 'ngx-bootstrap';

import { AgGridModule } from 'ag-grid-angular';
import { ProductsMasterComponent } from './components/products-master/products-master.component';
import { ProductsDetailComponent } from './components/products-detail/products-detail.component';


@NgModule({
  declarations: [
    AppComponent,
    CustomersMasterComponent,
    CustomerDetailComponent,
    MessagesComponent,
    InvoiceComponent,
    ProductsMasterComponent,
    ProductsDetailComponent
  ],
  imports: [
    BrowserModule, FormsModule, AppRoutingModule, 
    AngularFireModule.initializeApp(environment.firebase), 
    AngularFirestoreModule, AngularFireAuthModule, AngularFireDatabaseModule,
    ModalModule.forRoot(), BsDatepickerModule.forRoot(), PaginationModule.forRoot(), TabsModule.forRoot(),TypeaheadModule.forRoot(),
    AgGridModule.withComponents([]),
  ],
  entryComponents: [InvoiceComponent, ProductsDetailComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
