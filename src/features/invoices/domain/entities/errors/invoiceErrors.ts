import { DomainError } from '@/shared/entities/common';

// Error for authorization issues (e.g., user trying to access an order they don't own)
export class AuthorizationError extends DomainError {
  constructor(message: string = 'User is not authorized to perform this action.') {
    super(message);
  }
}

// Generic error for invoice creation failures
export class InvoiceCreationError extends DomainError {
  constructor(message: string = 'Failed to create invoice request.') {
    super(message);
  }
}
