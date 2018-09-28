import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Customer } from '../../model/customer';
import { CustomerDataService } from '../../services/customer-data.service'
import { InvoiceDataService } from '../../services/invoice-data.service';
import { InvoiceComponent } from '../invoice/invoice.component'
import { InvoiceHeader } from '../../model/invoiceheader';

@Component({
  selector: 'app-customers-master',
  templateUrl: './customers-master.component.html',
  styleUrls: ['./customers-master.component.css']
})

export class CustomersMasterComponent implements OnInit 
  {
  selectedCustomer: Customer;
  customers: Customer[];
  invoiceHeaders: InvoiceHeader[];

  bsModalRef: BsModalRef;

  constructor(private customerDataService: CustomerDataService, 
              private invoiceDataService: InvoiceDataService, 
              private modalService: BsModalService) { }
  
  ngOnInit() { this.getCustomers(); }

  deleteCustomer(id: string)
    {
    this.customerDataService.deleteCustomer(id);    
    }

  createInvoice(id: string)
    {            
      this.bsModalRef = this.modalService.show(InvoiceComponent, 
               {
                 initialState: {customerId: id}, 
                 class:'invoice-dialog'                
               });      
    }

  onSelect(customer:Customer)
    {
    this.selectedCustomer = customer;
    this.getInvoiceHeaders(customer.id);
    }

  private getCustomers()
    {
    this.customerDataService.getCustomers().subscribe(w => this.customers = w);           
    }
  
  private getInvoiceHeaders(customerId:string)
    {
    this.invoiceDataService.getInvoiceListOfCustomer(customerId).
       subscribe(w => 
          {
          this.invoiceHeaders = w
          } );
    }

  }
