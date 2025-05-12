import { Order, OrderValidationDto } from '../../domain/entities/models/orders';

export interface IOrderRepository {
  /**
   * Finds an order by its order number
   */
  findOrderByOrderNo(orderNo: string): Promise<Order | null>;

  /**
   * Validates an order against customer data
   */
  validateOrder(
    orderData: Order,
    customerData: {
      customerName: string;
      email: string;
      phone: string;
    },
  ): Promise<OrderValidationDto>;
}
