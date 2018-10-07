import { Component, OnInit } from '@angular/core';
import { GridOptions} from 'ag-grid-community';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ProductDataService } from '../../services/product-data.service';
import { Product } from '../../model/product';
import { ProductsDetailComponent } from '../products-detail/products-detail.component';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-products-master',
  templateUrl: './products-master.component.html',
  styleUrls: ['./products-master.component.scss']
})

export class ProductsMasterComponent implements OnInit 
  {
  bsModalRef: BsModalRef;
  
  public products: Product[];
  public selectedProduct: Product;

  productColumnDefs = 
    [
    {headerName: 'Code', field: 'code' },
    {headerName: 'Name', field: 'name' },
    {headerName: 'Price', field: 'price', type: 'numericColumn' },
    {headerName: 'Unit', field: 'unit' },
    ];

  productGridOptions: GridOptions = 
    {
    columnDefs: this.productColumnDefs,
    rowSelection: 'single',
    enableSorting: true,
    enableFilter: true,
    enableColResize: true,
    onGridReady: () => { this.productGridOptions.api.setRowData([]); },
    onSelectionChanged: () =>
      {        
      const sr = this.productGridOptions.api.getSelectedRows();
      if (sr.length===1)
        this.selectedProduct =  sr[0];
      else
        this.selectedProduct = null;
      }
    };

  constructor(private dataService: ProductDataService, private modalService: BsModalService, private msg:MessageService) { }

  ngOnInit() { this.getProducts(); }

  getProducts():void
    {
    this.dataService.getProductList().subscribe(w => 
      { 
      this.products = w.sort((a,b) => a.code.localeCompare(b.code)); 
      this.productGridOptions.api.setRowData(this.products);
      this.productGridOptions.api.sizeColumnsToFit();
      if (!this.selectedProduct)
        {
        let first=true;
        this.productGridOptions.api.forEachNode(z => { z.setSelected(first); first=false; } );
        }
      });
    }

  createProduct():void
    {
    this.bsModalRef = this.modalService.show(ProductsDetailComponent, 
        {
          initialState: {productId: null}, 
          class:'product-dialog'                
        }); 
    }

  
  editProduct(productId:string):void
    {
    this.bsModalRef = this.modalService.show(ProductsDetailComponent, 
        {
          initialState: {productId: productId}, 
          class:'product-dialog'                
        }); 
    }

  deleteProduct(productId:string):void
    {
    this.dataService.deleteProduct(productId);
    }  
    
  }
