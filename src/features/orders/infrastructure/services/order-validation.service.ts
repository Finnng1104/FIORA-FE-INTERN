import { Order, OrderStatus, OrderValidationDto } from '../../domain/entities/models/orders';

/**
 * Service responsible for validating order data against customer input
 */
export class OrderValidationService {
  /**
   * Validates customer data against order data
   * @param orderData - Order data from database
   * @param customerData - Customer data from request
   * @returns Validation result with status and message
   */
  public validateOrderMatch(
    orderData: Order,
    customerData: {
      customerName: string;
      email: string;
      phone?: string | null;
    },
  ): OrderValidationDto {
    // Only execute if order exists
    if (!orderData) {
      const result: OrderValidationDto = {
        status: 'warning',
        message:
          'Order information could not be validated. Your request will be reviewed manually.',
      };
      return result;
    }

    // Check if data matches
    const nameMatches = orderData.cusName.toLowerCase() === customerData.customerName.toLowerCase();
    const emailMatches = orderData.email?.toLowerCase() === customerData.email.toLowerCase();
    const phoneMatches = customerData.phone ? orderData.phone === customerData.phone : false;

    const dataMatches = nameMatches || emailMatches || phoneMatches;
    const isPaid = orderData.status === OrderStatus.Paid;

    // Return appropriate validation result
    if (!dataMatches || !isPaid) {
      const result: OrderValidationDto = {
        status: 'warning',
        message: 'Your invoice request will need to be manually reviewed.',
        title: !dataMatches ? 'Order Information Mismatch' : 'Order Not Paid',
      };
      return result;
    }

    const result: OrderValidationDto = {
      status: 'success',
      message: `Order ${orderData.orderNo} has been validated successfully.`,
      title: ' Request Success',
    };
    return result;
  }
}

// Singleton instance for use throughout the application
export const orderValidationService = new OrderValidationService();
