export interface Order {
  id: string;
  orderNo: string;
  cusName: string;
  address: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface InvoiceDetails {
  id: string;
  cusName: string;
  date: string;
  totalAmount: number;
  user: { name: string };
  creator: { name: string };
  updater: { name: string };
  orderInvoices: {
    order: Order;
  }[];
}
