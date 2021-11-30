import { EntityRepository, Repository } from 'typeorm';
import { Order } from './order.entity';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
  async findAllWithDeletedRelations(): Promise<Order[]> {
    return this.createQueryBuilder('order')
      .withDeleted()
      .innerJoinAndSelect('order.customer', 'customer')
      .innerJoinAndSelect('order.products', 'products')
      .innerJoinAndSelect('products.product', 'product')
      .andWhere('order.deleted_at IS NULL')
      .getMany();
  }

  async findByIdWithDeletedRelations(id: number): Promise<Order> {
    return this.createQueryBuilder('order')
      .withDeleted()
      .innerJoinAndSelect('order.customer', 'customer')
      .innerJoinAndSelect('order.products', 'products')
      .innerJoinAndSelect('products.product', 'product')
      .where('order.id = :id', { id })
      .andWhere('order.deleted_at IS NULL')
      .getOne();
  }
}
