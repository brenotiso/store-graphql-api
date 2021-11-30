import { Field, ObjectType } from '@nestjs/graphql';
import { CustomBaseEntity } from 'common/entity/custom-base-entity';
import { Product } from 'modules/product/product.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Order } from '../order.entity';

@ObjectType()
@Entity()
export class OrderProduct extends CustomBaseEntity {
  @Column({ name: 'order_id', primary: true })
  orderId: number;

  @Column({ name: 'product_id', primary: true })
  productId: number;

  @Field()
  @Column({ type: 'decimal' })
  quantity: number;

  @Field()
  @Column()
  observation: string;

  @Field(() => Order)
  @ManyToOne(() => Order, (order) => order.products)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.orders)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
