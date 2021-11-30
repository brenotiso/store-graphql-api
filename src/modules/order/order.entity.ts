import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { CustomBaseEntity } from 'common/entity/custom-base-entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Customer } from '../customer/customer.entity';
import { OrderProduct } from './product/order-product.entity';

@ObjectType()
@Entity()
export class Order extends CustomBaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  status: string;

  @Field(() => Int)
  @Column()
  parcels: number;

  @Column({ name: 'customer_id' })
  customerId: number;

  @Field(() => Customer)
  @ManyToOne(() => Customer, (customer) => customer.orders)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Field(() => [OrderProduct])
  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order, {
    cascade: true
  })
  products: OrderProduct[];
}
