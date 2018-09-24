import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CustomersMasterComponent } from './customers-master/customers-master.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { MessagesComponent } from './messages/messages.component';

@NgModule({
  declarations: [
    AppComponent,
    CustomersMasterComponent,
    CustomerDetailComponent,
    MessagesComponent
  ],
  imports: [
    BrowserModule, FormsModule, AppRoutingModule, 
    AngularFireModule.initializeApp(environment.firebase), AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
