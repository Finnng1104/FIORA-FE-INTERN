import { DomainError } from '@/shared/entities/common';

export class OrderNotFoundError extends DomainError {
  constructor(orderNo: string) {
    super(`Order with number ${orderNo} not found.`);
  }
}
