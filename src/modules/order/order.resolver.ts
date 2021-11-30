import { Inject, ParseIntPipe } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { CreateOrderInput } from './input/create-order.input';
import { removeUndefinedFiled } from 'common/utils/object.utils';
import { OrderProduct } from './product/order-product.entity';
import { UpdateOrderInput } from './input/update-order.input';

@Resolver(() => Order)
export class OrderResolver {
  constructor(
    @Inject(OrderService)
    public readonly orderService: OrderService
  ) {}

  @Query(() => [Order])
  public async orders(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Query(() => Order, { nullable: true })
  public async order(
    @Args('id', { type: () => ID }, ParseIntPipe) id: number
  ): Promise<Order> {
    return this.orderService.findById(id);
  }

  @Mutation(() => Order)
  public async createOrder(
    @Args('data') input: CreateOrderInput
  ): Promise<Order> {
    return this.orderService.add(this.inputToEntity(input));
  }

  @Mutation(() => Order)
  public async updateOrder(
    @Args('id', { type: () => ID }, ParseIntPipe) id: number,
    @Args('data') input: UpdateOrderInput
  ): Promise<Order> {
    return this.orderService.update(this.inputToEntity(input, id));
  }

  @Mutation(() => Order)
  public async removeOrder(
    @Args('id', { type: () => ID }, ParseIntPipe) id: number
  ): Promise<Order> {
    return this.orderService.remove(id);
  }

  private inputToEntity(
    input: CreateOrderInput | UpdateOrderInput,
    id?: number
  ): Order {
    const order = new Order();
    order.id = id;
    order.status = input.status;
    order.parcels = input.parcels;
    order.customerId = input.customerId;
    order.products = input.products?.map((p) => {
      const orderProduct = new OrderProduct();
      orderProduct.orderId = id;
      orderProduct.quantity = p.quantity;
      orderProduct.productId = p.productId;
      orderProduct.observation = p.observation;

      removeUndefinedFiled(order);
      return orderProduct;
    });

    removeUndefinedFiled(order);
    return order;
  }
}
