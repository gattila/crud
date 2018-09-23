import { Injectable } from '@angular/core';
import { Customer } from '../model/customer';
import { CUSTOMERS } from '../model/mock-customers';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore, DocumentChangeAction } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})

export class CustomerDataService 
  {
  customerList: Observable<Customer[]>;

  constructor(private db: AngularFirestore) 
    { 
    // this.customerList = db.collection<Customer>('customers').valueChanges();

    this.customerList = db.collection<Customer>('customers').snapshotChanges().pipe(
      map((actions: DocumentChangeAction<Customer>[]) => {
        return actions.map((a: DocumentChangeAction<Customer>) => {
          const data = a.payload.doc.data() as Customer;
          const id = a.payload.doc.id;
          data.id = id;
          return data;
        }); 
      
      }));
                
    }
  
  getCustomers(): Observable<Customer[]>
    {
    return this.customerList;        
    }
    
  getCustomer(id: string): Observable<Customer>
    {
    let rt: Customer;

    this.db.collection<Customer>('customers').doc(id).ref.get().then(
        function(doc) { 
                      rt = doc.data() as Customer;
                      rt.id = id;
                      } 
        );
    
    return of(rt);
    }

  deleteCustomer(id: string): Observable<Customer>
    {
    const rt = this.getCustomer(id);
    return null;        
    }

  }
