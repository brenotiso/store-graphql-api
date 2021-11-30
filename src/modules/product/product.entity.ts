import { Field, ID, ObjectType } from '@nestjs/graphql';
import { CustomBaseEntity } from 'common/entity/custom-base-entity';
import { OrderProduct } from 'modules/order/product/order-product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Product extends CustomBaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ name: 'image_url' })
  imageUrl: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column({ type: 'decimal' })
  weight: number;

  @Field()
  @Column({
    type: 'decimal',
    precision: 13,
    scale: 2
  })
  price: number;

  @Field()
  @Column({ type: 'decimal' })
  stock: number;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product)
  orders: OrderProduct[];
}
