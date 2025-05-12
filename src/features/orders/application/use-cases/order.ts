import { OrderNotFoundError } from '../../domain/entities/errors/orderErrors';
import { IOrderRepository } from '../repositories/orders.interface';

export class OrderUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(orderNo: string) {
    const order = await this.orderRepository.findOrderByOrderNo(orderNo);
    if (!order) {
      throw new OrderNotFoundError(orderNo);
    }
    return order;
  }
}
