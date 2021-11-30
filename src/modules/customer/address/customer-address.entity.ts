import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { CustomBaseEntity } from 'common/entity/custom-base-entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Customer } from '../customer.entity';

@ObjectType()
@Entity()
export class CustomerAddress extends CustomBaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column({ name: 'customer_id' })
  customerId: number;

  @Field()
  @Column()
  street: string;

  @Field(() => Int)
  @Column()
  number: number;

  @Field()
  @Column()
  neighborhood: string;

  @Field()
  @Column()
  city: string;

  @Field()
  @Column()
  state: string;

  @Field()
  @Column()
  country: string;

  @Field()
  @Column({ name: 'postal_code' })
  postalCode: string;

  @OneToOne(() => Customer, (customer) => customer.addresses)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;
}
