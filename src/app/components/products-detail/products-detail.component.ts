import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ProductDataService } from '../../services/product-data.service';
import { Product } from '../../model/product';

@Component({
  selector: 'app-products-detail',
  templateUrl: './products-detail.component.html',
  styleUrls: ['./products-detail.component.scss']
})

export class ProductsDetailComponent implements OnInit 
  {
  productId:string;
  product: Product;
  get title():string { return this.productId ? 'Editing product' : 'New product'; }

  constructor(public bsModalRef: BsModalRef, private dataService: ProductDataService) { }
  
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

  saveAndClose():void
    {
    if (this.productId)
      this.dataService.updateProduct(this.product);
    else
      this.dataService.addProduct(this.product);
      
    this.bsModalRef.hide();
    }
  }
