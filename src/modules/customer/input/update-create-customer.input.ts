import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateCustomerInput } from './create-customer.input';
import { UpdateAddressInput } from './update-create-address.input';

@InputType()
export class UpdateCustomerInput extends PartialType(
  OmitType(CreateCustomerInput, ['address'] as const)
) {
  @Field(() => UpdateAddressInput, { nullable: true })
  readonly address: UpdateAddressInput;
}
