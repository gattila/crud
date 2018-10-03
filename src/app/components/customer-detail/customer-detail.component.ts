import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Customer } from '../../model/customer';
import { CustomerDataService } from '../../services/customer-data.service';


@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})

export class CustomerDetailComponent implements OnInit 
  {
  customer: Customer;

  constructor(private route: ActivatedRoute, private customerDataService: CustomerDataService, private location: Location) { }

  ngOnInit() { this.getCustomer(); }

  btCancelClick(): void { this.location.back(); }

  btOkClick(): void
    {
    if (+this.customer.id>0)
      this.customerDataService.updateCustomer(this.customer);
    else
      this.customerDataService.addCustomer(this.customer);
    this.location.back();
    }  

  getCustomer(): void 
    {
    const id = this.route.snapshot.paramMap.get('id');

    if (+id>0)
       this.customerDataService.getCustomer(id).subscribe(w => this.customer = w);
    else
       this.customer = { id:'0', name:'', address:'' };
    }

  }
