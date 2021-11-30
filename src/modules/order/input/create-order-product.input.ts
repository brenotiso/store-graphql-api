import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateOrderProductInput {
  @Field()
  readonly productId: number;

  @Field()
  readonly quantity: number;

  @Field()
  readonly observation: string;
}
