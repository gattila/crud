import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Customer } from '../../model/customer';
import { CustomerDataService } from '../../services/customer-data.service'
import { InvoiceComponent } from '../invoice/invoice.component'

@Component({
  selector: 'app-customers-master',
  templateUrl: './customers-master.component.html',
  styleUrls: ['./customers-master.component.css']
})

export class CustomersMasterComponent implements OnInit 
  {
  customers: Customer[];
  bsModalRef: BsModalRef;

  constructor(private customerDataService: CustomerDataService, private modalService: BsModalService) { }
  
  ngOnInit() { this.getCustomers(); }

  deleteCustomer(id: string)
    {
    this.customerDataService.deleteCustomer(id);    
    }

  createInvoice(id: string)
    {            
      this.bsModalRef = this.modalService.show(InvoiceComponent, {initialState: {customerId: id}});      
    }

  private getCustomers()
    {
    this.customerDataService.getCustomers().subscribe(w => this.customers = w);           
    }
  
  }
