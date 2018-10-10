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

  selectedFiles: FileList = null;
  basePath = '/productImages';

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
      }
    else              
      this.dataService.getProduct(this.productId).then(w => this.product=w);      
    }


  selectFile(event) 
    {
    const file = event.target.files.item(0);
   
    if (file.type.match('image.*')) 
      this.selectedFiles = event.target.files;
    else 
      this.messageService.add('Bad image format!');
    }
  
  saveAndClose():void
    {
    if (this.selectedFiles!=null)
      {
      const file = this.selectedFiles.item(0);
      this.imgService.storeImage(this.basePath,file).then(w =>
        {
          this.product.imageURL = w.url;
          this.product.imageName = w.name;
          if (this.productId)
            this.dataService.updateProduct(this.product);
          else
            this.dataService.addProduct(this.product);
          
          this.bsModalRef.hide(); 
        });
      }

    }
  }
