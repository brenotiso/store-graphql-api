import { Field, ID, ObjectType } from '@nestjs/graphql';
import { CustomBaseEntity } from 'common/entity/custom-base-entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../order/order.entity';
import { CustomerAddress } from './address/customer-address.entity';

@ObjectType()
@Entity()
export class Customer extends CustomBaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column({ unique: true })
  cpf: string;

  @Field()
  @Column({ type: 'date' })
  birthDate: string;

  @Field(() => [CustomerAddress])
  @OneToMany(
    () => CustomerAddress,
    (customerAddress) => customerAddress.customer,
    {
      cascade: true
    }
  )
  addresses: CustomerAddress[];

  @Field(() => [Order])
  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];
}
