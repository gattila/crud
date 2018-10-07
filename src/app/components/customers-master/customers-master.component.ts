import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Customer } from '../../model/customer';
import { CustomerDataService } from '../../services/customer-data.service';
import { InvoiceDataService } from '../../services/invoice-data.service';
import { InvoiceComponent } from '../invoice/invoice.component';
import { InvoiceHeader } from '../../model/invoiceheader';
import { InvoiceDetail } from '../../model/invoicedetail';
import { GridOptions} from 'ag-grid-community';
import { Router } from '@angular/router';

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
    {headerName: 'Date', field: 'invoiceDate', cellRenderer: (data) => data.value.toDate().toLocaleDateString('hu')},
    {headerName: 'Due', field: 'due', cellRenderer: (data) => data.value.toDate().toLocaleDateString('hu')},
    {headerName: 'Fulfilment', field: 'fulfilment', cellRenderer: (data) => data.value.toDate().toLocaleDateString('hu')},
    {headerName: 'Payment', field: 'paymentMethod'},
    {headerName: 'Net', field: 'totalNet', type: 'numericColumn'},
    {headerName: 'Gross', valueGetter: 'data.totalNet+data.totalVat', type: 'numericColumn'}
    ];

  detailColumnDefs = 
    [
    {headerName: 'Pr. Code', field: 'productCode' },
    {headerName: 'Pr.Name', field: 'productName' },
    {headerName: 'Price', field: 'productPrice', type: 'numericColumn' },
    {headerName: 'Qty', field: 'qty', type: 'numericColumn' },
    {headerName: 'Unit', field: 'unit' },
    {headerName: 'Gross', valueGetter: 'data.qty*data.productPrice', type: 'numericColumn' }
    ];
  
    customerColumnDefs = 
    [
    {headerName: 'Id', field: 'id', width:50 },
    {headerName: 'Name', field: 'name', width: 150 },
    {headerName: 'Address', field: 'address', width:320 },
    ];
  
  invoiceDetailGridOptions: GridOptions = 
    {
    columnDefs: this.detailColumnDefs,
    rowSelection: 'single',
    enableSorting: true,
    enableFilter: true,
    enableColResize: true,
    onGridReady: () => { this.invoiceDetailGridOptions.api.setRowData([]); }
    } ;

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
      const sr = this.invoiceHeaderGridOptions.api.getSelectedRows();
      if (sr.length===1)         
         this.selectInvoiceHeader(sr[0]);
      else
         this.selectInvoiceHeader(null);         
      }
    };


  customerGridOptions: GridOptions = 
    {
    columnDefs: this.customerColumnDefs,
    rowSelection: 'single',
    enableSorting: true,
    enableFilter: true,
    enableColResize: true,
    onGridReady: () => { this.customerGridOptions.api.setRowData([]); },
    onSelectionChanged: () =>
      {        
      const sr = this.customerGridOptions.api.getSelectedRows();
      if (sr.length===1)
        this.selectCustomer(sr[0]);
      else
        this.selectCustomer(null);
      }
    };
 
  constructor(private customerDataService: CustomerDataService, 
              private invoiceDataService: InvoiceDataService, 
              private modalService: BsModalService,
              private router: Router) { }
  
  ngOnInit() { this.getCustomers();  }

  deleteCustomer(id: string)
    {
    this.customerDataService.deleteCustomer(id);    
    }

  createCustomer()
    {
    this.router.navigate(['/detail/0']);
    }

  editCustomer(id: string)
    {
    this.router.navigate(['/detail/'+id]);
    }

  createInvoice(id: string)
    {            
    this.bsModalRef = this.modalService.show(InvoiceComponent, 
               {
                 initialState: {customerId: id}, 
                 class:'invoice-dialog'                
               });      
    }

  private getCustomers()
    {
    this.customerDataService.getCustomers().subscribe(w => 
        { 
        this.customers = w;
        this.customerGridOptions.api.setRowData(this.customers);
     
        if (!this.selectedCustomer)
          {
          let first=true;
          this.customerGridOptions.api.forEachNode(z => { z.setSelected(first); first=false; } );  
          }

        });           
    }
  
  private selectCustomer(customer:Customer)
    {
    this.selectedCustomer = customer;
    if (customer != null)
      {
      this.invoiceDataService.getInvoiceListOfCustomer(customer.id).
        subscribe(w => 
           {
           this.invoiceHeaders = w;
           this.invoiceHeaderGridOptions.api.setRowData(this.invoiceHeaders);
           this.invoiceHeaderGridOptions.api.sizeColumnsToFit();
           if (w.length<1)
             {
             this.invoiceDetails = [];
             this.invoiceDetailGridOptions.api.setRowData(this.invoiceDetails);          
             }
           else
             {
             let first=true;
             this.invoiceHeaderGridOptions.api.forEachNode(z => { z.setSelected(first); first=false; } );
             }           
           } );
      }
    else
      {
      this.invoiceHeaders = [];
      this.invoiceHeaderGridOptions.api.setRowData(this.invoiceHeaders);
      this.invoiceDetails = [];
      this.invoiceDetailGridOptions.api.setRowData(this.invoiceDetails);
      }
    }
  
  private selectInvoiceHeader(hdr:InvoiceHeader)
    {
    if (hdr!=null)
      {
      this.selectedInvoiceHeader=hdr;
      this.invoiceDataService.getInvoiceDetails(this.selectedInvoiceHeader.id).subscribe(w => 
        {
        this.invoiceDetails = w;
        this.invoiceDetailGridOptions.api.setRowData(this.invoiceDetails);
        this.invoiceDetailGridOptions.api.sizeColumnsToFit();
        } );
      }
    else
      {
      this.invoiceDetails = [];
      this.invoiceDetailGridOptions.api.setRowData(this.invoiceDetails); 
      }
    }
 
  }
