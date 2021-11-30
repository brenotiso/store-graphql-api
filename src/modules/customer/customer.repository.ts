import { EntityRepository, Repository } from 'typeorm';
import { Customer } from './customer.entity';

@EntityRepository(Customer)
export class CustomerRepository extends Repository<Customer> {
  async findAllWithDeletedRelations(): Promise<Customer[]> {
    return this.createQueryBuilder('customer')
      .withDeleted()
      .innerJoinAndSelect('customer.addresses', 'address')
      .leftJoinAndSelect('customer.orders', 'order')
      .leftJoinAndSelect('order.products', 'products')
      .leftJoinAndSelect('products.product', 'product')
      .andWhere('customer.deleted_at IS NULL')
      .getMany();
  }

  async findByIdWithDeletedRelations(id: number): Promise<Customer> {
    return this.createQueryBuilder('customer')
      .withDeleted()
      .innerJoinAndSelect('customer.addresses', 'address')
      .leftJoinAndSelect('customer.orders', 'order')
      .leftJoinAndSelect('order.products', 'products')
      .leftJoinAndSelect('products.product', 'product')
      .where('customer.id = :id', { id })
      .andWhere('customer.deleted_at IS NULL')
      .getOne();
  }
}
