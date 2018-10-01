import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Customer } from '../../model/customer';
import { CustomerDataService } from '../../services/customer-data.service'
import { InvoiceDataService } from '../../services/invoice-data.service';
import { InvoiceComponent } from '../invoice/invoice.component'
import { InvoiceHeader } from '../../model/invoiceheader';
import { InvoiceDetail } from '../../model/invoicedetail';
import {GridOptions} from "ag-grid-community";

@Component({
  selector: 'app-customers-master',
  templateUrl: './customers-master.component.html',
  styleUrls: ['./customers-master.component.css']
})

export class CustomersMasterComponent implements OnInit 
  {
  selectedCustomer: Customer;
  selectedInvoiceHeader: InvoiceHeader;

  customers: Customer[];
  invoiceHeaders: InvoiceHeader[];
  invoiceDetails: InvoiceDetail[];

  bsModalRef: BsModalRef;

  
  headerColumnDefs = 
    [
    {headerName: 'Inv. No.', field: 'invoiceNo' },
    {headerName: 'Date', field: 'invoiceDate', cellRenderer: (data) => { return data.value.toDate().toLocaleDateString('hu'); }},
    {headerName: 'Due', field: 'due', cellRenderer: (data) => { return data.value.toDate().toLocaleDateString('hu'); }},
    {headerName: 'Fulfilment', field: 'fulfilment', cellRenderer: (data) => { return data.value.toDate().toLocaleDateString('hu'); }},
    {headerName: 'Payment', field: 'paymentMethod'},
    {headerName: 'Net', field: 'totalNet'},
    {headerName: 'Gross', valueGetter: 'data.totalNet+data.totalVat'}
    ];

  detailColumnDefs = 
    [
    {headerName: 'Pr. Code', field: 'productCode' },
    {headerName: 'Pr.Name', field: 'productName' },
    {headerName: 'Price', field: 'productPrice' },
    {headerName: 'Qty', field: 'qty' },
    {headerName: 'Unit', field: 'unit' },
    {headerName: 'Gross', valueGetter: 'data.qty+data.productPrice' }
    ]
  
  invoiceDetailGridOptions: GridOptions = 
    {
    columnDefs: this.detailColumnDefs,
    rowSelection: 'single',
    enableSorting: true,
    enableFilter: true,
    enableColResize: true,
    onGridReady: () => { this.invoiceDetailGridOptions.api.setRowData([]); }
    }

  invoiceHeaderGridOptions: GridOptions = 
    {
    columnDefs: this.headerColumnDefs,
    rowSelection: 'single',
    enableSorting: true,
    enableFilter: true,
    enableColResize: true,
    onGridReady: () => { this.invoiceHeaderGridOptions.api.setRowData([]); },
    onSelectionChanged: () =>
      {        
      var sr = this.invoiceHeaderGridOptions.api.getSelectedRows();
      if (sr.length==1)
         {
         console.log(sr[0]);
         this.selectedInvoiceHeader=sr[0];
         this.invoiceDataService.getInvoiceDetails(this.selectedInvoiceHeader.id).subscribe(w => 
             {
             this.invoiceDetails = w;
             this.invoiceDetailGridOptions.api.setRowData(this.invoiceDetails);
             this.invoiceDetailGridOptions.api.sizeColumnsToFit();
             } );
         }
      }
    };


 
  constructor(private customerDataService: CustomerDataService, 
              private invoiceDataService: InvoiceDataService, 
              private modalService: BsModalService) { }
  
  ngOnInit() { this.getCustomers();  }

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

  onSelectInvoice(invoiceHeader: InvoiceHeader)
    {
    this.selectedInvoiceHeader=invoiceHeader;
    this.invoiceDataService.getInvoiceDetails(invoiceHeader.id).subscribe(w => this.invoiceDetails = w);
    }

  private getCustomers()
    {
    this.customerDataService.getCustomers().subscribe(w => { this.customers = w; });           
    }
  
  private getInvoiceHeaders(customerId:string)
    {
    this.invoiceDataService.getInvoiceListOfCustomer(customerId).
       subscribe(w => 
          {
          this.invoiceHeaders = w
          this.invoiceHeaderGridOptions.api.setRowData(this.invoiceHeaders);
          this.invoiceHeaderGridOptions.api.sizeColumnsToFit();          
          } );
    }

  }
