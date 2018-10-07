import { Injectable } from '@angular/core';
import { Observable, of} from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore} from 'angularfire2/firestore';
import { MessageService } from './message.service';
import { Product } from '../model/product';

@Injectable({ providedIn: 'root' })

export class ProductDataService 
  {
  constructor(private messageService: MessageService,  
              private db: AngularFirestore) { }

  
  getProductList(): Observable<Product[]>
    {
      return this.db.collection<Product>('products').snapshotChanges().pipe
        (
        map(actions => 
          {
          return actions.map(a => 
             {
             const data = a.payload.doc.data() as Product;
             const id = a.payload.doc.id;
             const p: Product = { id, ...data };
             return p;
             } ); 
          }
        ));   
    }

  getProduct(id: string): Promise<Product>
    {
    const rt = new Promise<Product>(resolve =>
      {
      this.db.collection<Product>('products').doc(id).ref.get().then(x => 
          { 
          const d = x.data() as Product; d.id = id; resolve(d);
          } );
      });
   
    return rt;
    }

  addProduct(product:Product)
    {
    delete product.id;

    const data = JSON.parse(JSON.stringify(product));

    this.db.collection<Product>('products').add(data).then(() => { this.log('Added Product:' + product.code); });
    }

  updateProduct(product: Product)
    {
      const np: Product = { ...product };
      delete np.id;
      this.db.collection<Product>('products').doc(product.id).update(np).then(w => { this.log('Updated product:' + product.code); });
    }

  deleteProduct(id: string)
    {    
    this.db.collection<Product>('products').doc(id).delete().then(w => this.log('Deleted product'));
    }
  
  log(msg: string)
    {
    this.messageService.add(msg);
    }

  }
