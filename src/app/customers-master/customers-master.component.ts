import { Component, OnInit } from '@angular/core';
import { Customer } from '../../model/customer';
import { CustomerDataService } from '../customer-data.service';

@Component({
  selector: 'app-customers-master',
  templateUrl: './customers-master.component.html',
  styleUrls: ['./customers-master.component.css']
})

export class CustomersMasterComponent implements OnInit 
  {
  customers: Customer[];
  
  constructor(private customerDataService: CustomerDataService) { }
  
  ngOnInit() { this.getCustomers(); }

  deleteCustomer(id: string)
    {
    this.customerDataService.deleteCustomer(id);    
    }

  private getCustomers()
    {
    this.customerDataService.getCustomers().subscribe(w => this.customers = w);           
    }
  
  }
