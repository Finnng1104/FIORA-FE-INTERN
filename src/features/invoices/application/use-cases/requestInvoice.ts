import type { IInvoiceRepository } from '@/features/invoices/application/repositories/invoices.interface';
import { InvoiceCreationError } from '@/features/invoices/domain/entities/errors/invoiceErrors';
import { IOrderRepository } from '@/features/orders/application/repositories/orders.interface';
import { OrderNotFoundError } from '@/features/orders/domain/entities/errors/orderErrors';
import { RequestInvoiceInput } from '../../domain/entities/models/invoices';

/**
 * Use Case for handling the request for a new invoice.
 */
export class RequestInvoiceUseCase {
  constructor(
    private invoiceRepository: IInvoiceRepository,
    private orderRepository: IOrderRepository,
  ) {}

  /**
   * Processes an invoice request
   * @param input - Data required to request an invoice
   * @param requestingUserId - User ID making the request (null if guest)
   * @returns Result of the invoice request with validation status
   * @throws OrderNotFoundError if the order doesn't exist
   * @throws InvoiceCreationError if invoice creation fails
   */
  async execute(input: RequestInvoiceInput, requestingUserId: string | null) {
    // 1. Find the order first to ensure it exists
    const order = await this.orderRepository.findOrderByOrderNo(input.orderNo);
    if (!order) {
      throw new OrderNotFoundError(input.orderNo);
    }

    try {
      // 2  Validate order match
      const validationResult = await this.orderRepository.validateOrder(order, {
        customerName: input.customerName,
        email: input.email,
        phone: input.phone,
      });

      // 3. Create the invoice request and get validation results
      const result = await this.invoiceRepository.createInvoiceRequest(input, requestingUserId);

      return {
        ...result,
        validationStatus: validationResult.status,
        validationMessage: validationResult.message,
        validationTitle: validationResult.title,
      };
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error during invoice request creation:', error.stack);
      }
      throw new InvoiceCreationError('Failed to create invoice request.');
    }
  }
}
