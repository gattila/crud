export class InvoiceDetail
  {     
  productCode: string;
  productName: string;
  productPrice: number;
  qty: number;
  unit: string;
  vatPercent: number; 
  
  copyTo(dst: InvoiceDetail): void
    {
    dst.productCode = this.productCode;
    dst.productName = this.productName;
    dst.productPrice = this.productPrice;
    dst.qty = this.qty;
    dst.unit = this.unit;
    dst.vatPercent = this.vatPercent;
    }
  }

