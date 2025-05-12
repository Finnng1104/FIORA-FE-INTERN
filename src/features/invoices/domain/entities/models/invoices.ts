import { OrderStatus } from '@prisma/client';

/**
 * Represents the possible statuses for an invoice request/document
 */
export enum InvoiceStatus {
  Requested = 'Requested',
  Accepted = 'Accepted',
  Issuing = 'Issuing',
  Issued = 'Issued',
  Replaced = 'Replaced',
  Cancelled = 'Cancelled',
}

/**
 * UUID type alias for better type specificity
 */
export type UUID = string;

/**
 * Base entity interface with common audit fields
 */
interface BaseEntity {
  id: UUID;
  createdAt: Date;
  createdBy: UUID | null;
  updatedAt: Date;
  updatedBy: UUID | null;
}

/**
 * Represents the core Invoice entity in the domain
 */
export interface Invoice extends BaseEntity {
  userId: UUID;
  reqNo: string;
  reqDatetime: Date;
  cusName: string;
  taxNo: string | null;
  taxAddress: string | null;
  email: string | null;
  phone: string | null;
  status: InvoiceStatus;
  invNo: string | null;
  invDate: Date | null;
  repNo: string | null;

  // Relationships
  orderInvoices?: OrderInvoice[];
}

/**
 * Represents the link between an Order and an Invoice
 */
export interface OrderInvoice extends BaseEntity {
  userId: UUID | null;
  orderId: UUID;
  invoiceId: UUID;

  // Optional relationships for eager loading
  order?: Partial<Order>;
  invoice?: Partial<Invoice>;
}

/**
 * Order entity required for invoice processing
 */
export interface Order extends BaseEntity {
  userId: UUID;
  orderNo: string;
  datetime?: Date;
  totalAmt: number;
  cusName: string;
  address?: string;
  email?: string;
  phone?: string;
  status: OrderStatus;
}

/**
 * Input data structure for creating an invoice request
 */
export interface RequestInvoiceInput {
  orderNo: string;
  customerName: string;
  email: string;
  providerId: string;
  taxNo: string;
  taxAddress: string;
  phone: string;
}

/**
 * Output data structure after successfully requesting an invoice
 */
export interface RequestInvoiceOutput {
  invoiceId: string;
  reqNo: string;
  orderId: string;
  validationStatus: 'warning' | 'success';
  validationMessage: string;
  validationTitle?: string;
}

/**
 * Utility type to create a read-only version of any type
 */
export type ReadOnly<T> = {
  readonly [P in keyof T]: T[P];
};

/**
 * Read-only version of the Invoice type for immutable operations
 */
export type ReadOnlyInvoice = ReadOnly<Invoice>;
