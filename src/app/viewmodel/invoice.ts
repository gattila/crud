import {InvoiceHeader} from '../model/invoiceheader';
import {InvoiceDetail} from '../model/invoicedetail';
import {Customer} from '../model/customer';

export class Invoice
  {
  customer: Customer;
  header: InvoiceHeader;
  details: InvoiceDetail[];  
  }
