import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerRepository } from 'modules/customer/customer.repository';
import { NotificationService } from 'modules/notification/notification.service';
import { ProductRepository } from 'modules/product/product.repository';
import { In } from 'typeorm';
import { Order } from './order.entity';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderRepository)
    public readonly orderRepository: OrderRepository,
    @InjectRepository(ProductRepository)
    public readonly productRepository: ProductRepository,
    @InjectRepository(CustomerRepository)
    public readonly customerRepository: CustomerRepository,
    @Inject(NotificationService)
    public readonly notificationService: NotificationService
  ) {}

  private readonly logger = new Logger(OrderService.name);

  public async findAll(): Promise<Order[]> {
    return this.orderRepository.findAllWithDeletedRelations();
  }

  public async findById(id: number): Promise<Order> {
    return this.orderRepository.findByIdWithDeletedRelations(id);
  }

  public async update(order: Order): Promise<Order> {
    const orderToUpdate = await this.getOrderById(order.id);
    Object.assign(orderToUpdate, order);

    return this.orderRepository.save(orderToUpdate);
  }

  public async remove(id: number): Promise<Order> {
    const order = await this.getOrderById(id);

    return await this.orderRepository.softRemove(order);
  }

  public async add(order: Order): Promise<Order> {
    const customer = await this.customerRepository.findOne(order.customerId);
    if (!customer) throw new NotFoundException(`Cliente não encontrado.`);

    const products = await this.productRepository.find({
      where: {
        id: In(order.products.map((p) => p.productId))
      }
    });

    order.products.forEach((op) => {
      const product = products.find((p) => p.id === op.productId);
      if (!product)
        throw new NotFoundException(`Produto ${op.productId} não encontrado.`);

      if (product.stock < op.quantity)
        throw new BadRequestException(
          `Quantidade solicitada para o produto ${op.productId} superior ao disponível (${product.stock}).`
        );

      product.stock -= op.quantity;
    });

    products.forEach((p) => {
      this.productRepository.save(p);
    });

    await this.orderRepository.save(order);

    this.notificationService
      .sendEmail({
        to: [customer.email],
        subject: `Pedido #${order.id}`,
        html: `Seu pedido foi cadastrado com sucesso.`
      })
      .catch((error) =>
        this.logger.error('Não foi possível enviar o email.', error)
      );

    return order;
  }

  private async getOrderById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne(id);

    if (!(await this.orderRepository.findOne(id)))
      throw new NotFoundException(`Pedido não encontrado.`);

    return order;
  }
}
