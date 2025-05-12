import { IOrderRepository } from '../../application/repositories/orders.interface';
import { OrderStatus, OrderValidationDto } from '../../domain/entities/models/orders';
import { Order as PrismaOrder } from '@prisma/client';
import { Order as DomainOrder } from '../../domain/entities/models/orders';
import { prisma } from '@/config';
import { orderValidationService } from '../services/order-validation.service';

// const prisma = new PrismaClient(); // Removed: Prisma client will be injected

export class OrderRepository implements IOrderRepository {
  /**
   * Maps a Prisma Order to a Domain Order
   */
  private mapOrderToDomain(prismaOrder: PrismaOrder): DomainOrder {
    return {
      id: prismaOrder.id,
      userId: prismaOrder.userId,
      orderNo: prismaOrder.orderNo,
      datetime: prismaOrder.datetime || undefined,
      totalAmt: Number(prismaOrder.totalAmt), // Convert Decimal to number
      cusName: prismaOrder.cusName,
      address: prismaOrder.address || undefined,
      email: prismaOrder.email || undefined,
      phone: prismaOrder.phone || undefined,
      status: OrderStatus[prismaOrder.status],
      createdAt: prismaOrder.createdAt,
      createdBy: prismaOrder.createdBy,
      updatedAt: prismaOrder.updatedAt,
      updatedBy: prismaOrder.updatedBy,
    };
  }

  /**
   * Finds an order by its order number
   */
  async findOrderByOrderNo(orderNo: string): Promise<DomainOrder | null> {
    const order = await prisma.order.findUnique({
      where: { orderNo },
    });

    // Map the Prisma order to our domain order if found
    return order ? this.mapOrderToDomain(order) : null;
  }

  /**
   * Validates an order against customer data
   */
  async validateOrder(
    orderData: DomainOrder,
    customerData: {
      customerName: string;
      email: string;
      phone?: string | null;
    },
  ): Promise<OrderValidationDto> {
    // Use validation service to check the data
    return orderValidationService.validateOrderMatch(orderData, customerData);
  }
}

export const orderRepository = new OrderRepository();
