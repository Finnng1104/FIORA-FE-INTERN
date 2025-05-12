import { BaseEntity, UUID } from '@/shared/entities/common';

export enum OrderStatus {
  Unpaid = 'Unpaid',
  Paid = 'Paid',
  Cancelled = 'Cancelled',
  Refund = 'Refund',
}

export interface Order extends BaseEntity {
  id: UUID;
  orderNo: string;
  datetime?: Date;
  totalAmt: number;
  cusName: string;
  address?: string;
  email?: string;
  phone?: string;
  status: OrderStatus;
  userId: string;
}
/**
 * Data Transfer Object for order validation results
 */
export interface OrderValidationDto {
  status: 'warning' | 'success';
  message: string;
  title?: string;
}
