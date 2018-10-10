import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase';

import { ProductDataService } from '../../services/product-data.service';
import { Product } from '../../model/product';
import { MessageService } from '../../services/message.service';

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

  constructor(public bsModalRef: BsModalRef, private dataService: ProductDataService, private messageService: MessageService) { }
  
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

      const fileName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

      const storageRef = firebase.storage().ref(`${this.basePath}/${fileName}`);
      storageRef.put(file).then(w =>
          {        
          storageRef.getDownloadURL().then(c=>
             {
             this.product.imageURL = c;
             this.product.imageName = fileName;
             if (this.productId)
               this.dataService.updateProduct(this.product);
             else
               this.dataService.addProduct(this.product);
             
             this.bsModalRef.hide();                       
             });
          });     
      }

    }
  }
