import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { CustomersMasterComponent } from './components/customers-master/customers-master.component';
import { CustomerDetailComponent } from './components/customer-detail/customer-detail.component';
import { MessagesComponent } from './components/messages/messages.component';

import { AppRoutingModule } from './modules/app-routing.module';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';


@NgModule({
  declarations: [
    AppComponent,
    CustomersMasterComponent,
    CustomerDetailComponent,
    MessagesComponent
  ],
  imports: [
    BrowserModule, FormsModule, AppRoutingModule, 
    AngularFireModule.initializeApp(environment.firebase), 
    AngularFirestoreModule,AngularFireAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
