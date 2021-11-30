import { Field, InputType, Int } from '@nestjs/graphql';
import { CreateOrderProductInput } from './create-order-product.input';

@InputType()
export class CreateOrderInput {
  @Field()
  readonly status: string;

  @Field(() => Int)
  readonly parcels: number;

  @Field()
  readonly customerId: number;

  @Field(() => [CreateOrderProductInput])
  readonly products: CreateOrderProductInput[];
}
