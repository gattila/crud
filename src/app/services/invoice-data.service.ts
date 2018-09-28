import { Injectable } from '@angular/core';
import { Observable, of, ObjectUnsubscribedError } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore, DocumentChangeAction } from 'angularfire2/firestore';
import { MessageService } from './message.service';
import { CustomerDataService } from '../services/customer-data.service';

import { InvoiceHeader } from '../model/invoiceheader';
import { InvoiceDetail } from '../model/invoicedetail';
import {Customer} from '../model/customer';
import { Invoice } from '../viewmodel/invoice';

@Injectable({ providedIn: 'root' })

export class InvoiceDataService 
  {
  constructor(private customerDataService: CustomerDataService,
              private messageService: MessageService,  
              private db: AngularFirestore) { }

  createInvoice(customerId: string): Observable<Invoice>
    {
    return new Observable<Invoice>(o => 
      {      
      this.customerDataService.getCustomer(customerId).
        subscribe(w => 
          {
          const currentDate = new Date();
          const hdr: InvoiceHeader = {id:'',
                                      customerId: customerId, 
                                      invoiceDate: currentDate, 
                                      due: currentDate, 
                                      fulfilment: currentDate, 
                                      paymentMethod: 'Cash',
                                      totalNet: 0,
                                      totalVat: 0 };

          const rt = new Invoice();
          
          rt.customer = w;
          rt.header = hdr;
          rt.details = [];
                    
          o.next(rt);
          });
      });

    }  
  
  writeInvoice(inv: Invoice): void
    {
    delete inv.header.id;

    this.db.collection<InvoiceHeader>('invoice').add(inv.header)
        .then(w =>
          {                      
          inv.details.forEach(d => 
                {
                const data = JSON.parse(JSON.stringify(d));
                w.collection('details').add(data);
                });
            
          });                                                             
    }

  getInvoiceListOfCustomer(customerId: string): Observable<InvoiceHeader[]>
    {
      return this.db.collection<InvoiceHeader>('invoice', w => w.where('customerId','==',customerId) ).snapshotChanges().pipe
        (
        map(actions => 
          {
          return actions.map(a => 
             {
             const data = a.payload.doc.data() as InvoiceHeader;
             const id = a.payload.doc.id;
             const h: InvoiceHeader = { id, ...data };
             return h;
             } ); 
          }
        ));                
    }

  }
