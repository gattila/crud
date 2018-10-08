import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';
import { InvoiceDetail } from '../../model/invoicedetail';
import { Invoice } from '../../viewmodel/invoice';
import { InvoiceDataService } from '../../services/invoice-data.service';
import { Product } from '../../model/product';
import { ProductDataService } from '../../services/product-data.service';


@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],  
})


export class InvoiceComponent implements OnInit 
  {
  title = 'Creating invoice';
  
  customerId: string;
  invoice: Invoice;  
  line: InvoiceDetail;
  currentRow: InvoiceDetail = null;

  itemsPerPage = 5;
  currentPage = 1;
  detailsPage: InvoiceDetail[];

  products: Product[];  

  get IsInEditMode(): boolean { return this.currentRow!=null; }
    
  constructor(public bsModalRef: BsModalRef, 
              private invoiceDataService: InvoiceDataService, 
              private productDataService: ProductDataService) 
    { 
    this.resetToAddMode();
    }

  ngOnInit() 
    { 
    this.invoiceDataService.createInvoice(this.customerId).subscribe(w => 
         {            
         this.invoice = w; 
         this.generateDetails();
         }); 
         
    this.productDataService.getProductList().subscribe(w=>this.products=w.sort((a,b) => a.code.localeCompare(b.code)));
    }
  
  saveAndClose(): void
    {
    this.invoiceDataService.writeInvoice(this.invoice);    
    this.bsModalRef.hide();
    }

  addToInvoice(): void
    {
    this.invoice.details.push(this.line);
    this.recalcHeader();
    this.resetToAddMode();
    this.generateDetails();
    }
  

  editRow(row: InvoiceDetail): void 
    {
    this.currentRow = row;
    row.copyTo(this.line);    
    }

  updateRow(): void
    {
    this.line.copyTo(this.currentRow);
    this.currentRow = null;
    this.recalcHeader();
    this.resetToAddMode();
    this.generateDetails();
    }

  cancelUpdate():void
    {
    this.currentRow = null;
    this.resetToAddMode();
    }

  deleteRow(row: InvoiceDetail): void 
    {
    for (let i = 0; i < this.invoice.details.length;  i++) 
      {
      if (this.invoice.details[i] === row) 
        {
        this.invoice.details.splice(i, 1);
        this.recalcHeader();        
        this.generateDetails();    
        break;
        }
      }
    }

  resetToAddMode(): void
    {
    this.line = new InvoiceDetail();
    this.line.productPrice = 0;
    this.line.qty = 1;
    this.line.unit = 'Piece';
    this.line.vatPercent = 27;
    } 

  recalcHeader(): void
    {
    this.invoice.header.totalNet = 0;
    this.invoice.header.totalVat = 0;
    
    this.invoice.details.forEach(w => { const g = w.productPrice * w.qty;
                                        const n = g / ((100 + w.vatPercent) / 100); 
                                        const v = g - n;  
                                        this.invoice.header.totalNet += n;
                                        this.invoice.header.totalVat += v; });    
    }


    generateDetails(): void
      {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;

      this.detailsPage = this.invoice.details.slice(start, end);
      }

    pageChanged(event: PageChangedEvent): void 
      {
      const startItem = (event.page - 1) * event.itemsPerPage;
      const endItem = event.page * event.itemsPerPage;
      this.detailsPage = this.invoice.details.slice(startItem, endItem);
      }

    productTypeaheadChanged(event: TypeaheadMatch):void
      {
      const p = event.item as Product;
      this.line.productCode=p.code;
      this.line.productName=p.name;
      this.line.productPrice=p.price;
      this.line.unit=p.unit;
      this.line.vatPercent=p.vatPercent;
      }
    

  }
