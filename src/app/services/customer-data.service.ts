import { Injectable } from '@angular/core';
import { Customer } from '../model/customer';
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators';
import { AngularFirestore, DocumentChangeAction } from 'angularfire2/firestore';
import { MessageService } from './message.service'

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
    
    // TODO: retry mechanism  
    this.db.collection<Customer>('customers').get().
          subscribe(w => 
              { 
              let n=0;
              w.docs.forEach(x => { if (+x.id > n) n = +x.id; } );
              n=n+10;
              this.db.collection<Customer>('customers').doc(n.toString()).set(customer).then(w => this.log('Added a new document:'+n));
              })
                    
    }

  updateCustomer(customer:Customer)
    {
      var nc:Customer = { ...customer };
      delete nc.id;
      this.db.collection<Customer>('customers').doc(customer.id).update(nc).then(w => { this.log("Updated the document:"+customer.id)});
    }

  deleteCustomer(id: string)
    {    
    this.db.collection<Customer>('customers').doc(id).delete().then(w => this.log('Deleted the document:'+id));
    }

  log(msg:string)
    {
    this.messageService.add(msg);
    }

  }
