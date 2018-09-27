import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { Customer } from '../../model/customer';
import { InvoiceHeader } from '../../model/invoiceheader';
import { InvoiceDetail } from '../../model/invoicedetail';
import { Invoice } from '../../viewmodel/invoice';

import { InvoiceDataService } from '../../services/invoice-data.service'

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
    
  constructor(public bsModalRef: BsModalRef, private invoiceDataService: InvoiceDataService) 
    { 
    this.resetToAddMode();
    }

  ngOnInit() 
    { 
    this.invoiceDataService.createInvoice(this.customerId).subscribe(w => this.invoice = w);    
    }
  
  addToInvoice(): void
    {
    this.invoice.details.push(this.line);
    this.recalcHeader();
    this.resetToAddMode();
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

  }
