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
  styleUrls: ['./invoice.component.css']
})

export class InvoiceComponent implements OnInit 
  {
  title = "Creating invoice";

  customerId:string;
  invoice:Invoice;

  constructor(public bsModalRef: BsModalRef, private invoiceDataService: InvoiceDataService) { }

  ngOnInit() { this.invoiceDataService.createInvoice(this.customerId).subscribe(w => this.invoice=w);  }

  }
