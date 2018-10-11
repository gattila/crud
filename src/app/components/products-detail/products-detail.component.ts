import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import * as firebase from 'firebase';

import { ProductDataService } from '../../services/product-data.service';
import { Product } from '../../model/product';
import { MessageService } from '../../services/message.service';
import { ImageStoreService } from '../../services/image-store.service';

@Component({
  selector: 'app-products-detail',
  templateUrl: './products-detail.component.html',
  styleUrls: ['./products-detail.component.scss']
})

export class ProductsDetailComponent implements OnInit 
  {
  productId:string;
  product: Product;  
  progress_value = -1;
  
  get title():string { return this.productId ? 'Editing product' : 'New product'; }

  constructor(public bsModalRef: BsModalRef, 
              private dataService: ProductDataService, 
              private messageService: MessageService,
              private imgService: ImageStoreService) { }
  
  ngOnInit() 
    { 
    if (this.productId==null)
      {
      this.product = new Product();
      this.product.vatPercent=27;
      this.product.unit = 'Piece';
      this.product.imageURL = null;
      this.product.imageName = null;
      }
    else              
      this.dataService.getProduct(this.productId).then(w => this.product=w);      
    }


  selectFile(event) 
    {
    const file = event.target.files.item(0) as File;
    const name = this.imgService.GenerateImageName();
   
    if (file.type.match('image.*')) 
      {
      this.imgService.StoreImage(name, file, 
          pr =>{ this.progress_value=pr; }, 
          er => { this.messageService.add(er.message);  }, 
          url => { this.progress_value=-1; 
                   this.product.imageURL=url; 
                   this.product.imageName=name; });
      }
    else 
      this.messageService.add('Bad image format!');
    }
  
  saveAndClose():void
    {
    if (this.productId)
      this.dataService.updateProduct(this.product);
    else
      this.dataService.addProduct(this.product);
    
    this.bsModalRef.hide(); 
    }
  }
