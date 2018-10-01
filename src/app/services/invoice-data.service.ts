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
import { InvokeFunctionExpr } from '@angular/compiler';

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
                                      invoiceNo: 0,
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
    this.db.collection<InvoiceHeader>('invoice', w=>w.orderBy('invoiceNo','desc').limit(1)).get()
      .subscribe(w =>
        {
        this.messageService.add('Calculating new invocie No' );
        let n = 0;
        w.docs.forEach(q => { 
                            let h = q.data() as InvoiceHeader;
                            if (h.invoiceNo > n) n=h.invoiceNo;   
                            });                  
        n = n + 1;
        this.writeInvoiceBase(inv,n);        
        })            
    }

  writeInvoiceBase(inv: Invoice, invNo: number): void
    {
    this.messageService.add('Created invoice:' + invNo );

    delete inv.header.id;
    inv.header.invoiceNo = invNo;

    this.db.collection<InvoiceHeader>('invoice', w => w.orderBy('invoiceNo')).add(inv.header)
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
      return this.db.collection<InvoiceHeader>('invoice', w => w.where('customerId','==',customerId)).snapshotChanges().pipe
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
        
  getInvoiceDetails(invoiceHeaderId:string): Observable<InvoiceDetail[]> 
    {
    return this.db.collection<InvoiceHeader>('invoice').doc(invoiceHeaderId).collection<InvoiceDetail>('details').valueChanges();
    }


  }
