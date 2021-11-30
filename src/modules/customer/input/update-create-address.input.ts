import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateAddressInput } from './create-address.input';

@InputType()
export class UpdateAddressInput extends PartialType(CreateAddressInput) {
  @Field(() => ID)
  readonly id: number;
}
