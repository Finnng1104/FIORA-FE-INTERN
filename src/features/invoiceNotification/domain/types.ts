export interface Order {
  id: string;
  orderNo: string;
  cusName: string;
  email: string;
  totalAmt: number;
  address?: string;
  phone?: string;
  status: string;
  datetime?: string;
}
