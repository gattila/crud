import { Injectable } from '@angular/core';
import { Observable, of, ObjectUnsubscribedError } from 'rxjs'
import { map } from 'rxjs/operators';
import { AngularFirestore, DocumentChangeAction } from 'angularfire2/firestore';
import { MessageService } from './message.service'
import { CustomerDataService } from '../services/customer-data.service'

import {InvoiceHeader} from '../model/invoiceheader';
import {InvoiceDetail} from '../model/invoicedetail';
import {Customer} from '../model/customer';
import {Invoice} from '../viewmodel/invoice';

@Injectable({ providedIn: 'root' })

export class InvoiceDataService 
  {
  constructor(private customerDataService:CustomerDataService) { }

  createInvoice(customerId:string): Observable<Invoice>
    {
    return new Observable<Invoice>(o => 
      {      
      this.customerDataService.getCustomer(customerId).
        subscribe(w => 
          {
          const currentDate = new Date();
          const hdr:InvoiceHeader = {id:'', 
                                     customerId:customerId, 
                                     invoiceDate:currentDate, 
                                     due:currentDate, 
                                     fulfilment:currentDate, 
                                     paymentMethod:'Cash',
                                     totalNet:0,
                                     totalVat:0 };

          const rt:Invoice = { customer:w, header: hdr, details:[] }
          o.next(rt);
          });
      });

    }  
  

  }
