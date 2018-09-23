import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Customer } from '../../model/customer';
import { CustomerDataService } from '../customer-data.service';


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

  goBack(): void { this.location.back(); }

  getCustomer(): void 
    {
    const id = this.route.snapshot.paramMap.get('id');
    this.customerDataService.getCustomer(id).subscribe(w => this.customer = w);
    }

  }
