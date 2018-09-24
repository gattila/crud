import { Injectable } from '@angular/core';
import { Customer } from '../model/customer';
import { CUSTOMERS } from '../model/mock-customers';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore, DocumentChangeAction } from 'angularfire2/firestore';
import { MessageService } from './message.service'
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})

export class CustomerDataService 
  {  
  customerList: Observable<Customer[]>;

  constructor(private messageService:MessageService,  private db: AngularFirestore) 
    {                     
    }
  
  getCustomers(): Observable<Customer[]>
    {
    return this.db.collection<Customer>('customers').snapshotChanges().pipe(
        map((actions: DocumentChangeAction<Customer>[]) => {
          return actions.map((a: DocumentChangeAction<Customer>) => {
            const data = a.payload.doc.data() as Customer;
            const id = a.payload.doc.id;
            data.id = id;
            return data;
          });       
        }));    
    }
    

  getCustomer(id: string): Observable<Customer>
    {
    let rt = new Observable<Customer>(w =>
      {
      this.db.collection<Customer>('customers').doc(id).ref.get().then(x => 
          { 
          const d = x.data() as Customer; d.id=id; w.next(d); 
          } );
      });
   
    return rt;
    }


  addCustomer(customer:Customer)
    {
      delete customer.id;
      
      this.db.collection<Customer>('customers').snapshotChanges()
        .forEach(w => w.forEach(q => {
          console.log('Latest customer id:'+q.payload.doc.id);
        }));
      
    }

  updateCustomer(customer:Customer)
    {
      var nc:Customer = { ...customer };
      delete nc.id;
      this.db.collection<Customer>('customers').doc(customer.id).update(nc).then(w => { this.log("Document updated")});
    }

  deleteCustomer(id: string): Observable<Customer>
    {
    const rt = this.getCustomer(id);
    return null;        
    }

  log(msg:string)
    {
    this.messageService.add(msg);
    }

  }
