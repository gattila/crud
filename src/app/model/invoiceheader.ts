export class InvoiceHeader
  { 
  id: string;      
  invoiceDate: Date;
  due: Date;
  fulfilment: Date;
  customerId: string;
  paymentMethod: string;
  totalNet: number;
  totalVat: number;
  }
