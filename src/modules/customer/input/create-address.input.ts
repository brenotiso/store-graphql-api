import { Field, InputType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CustomerAddress } from '../address/customer-address.entity';

@InputType()
export class CreateAddressInput {
  @Field()
  readonly street: string;

  @Field()
  @IsInt()
  readonly number: number;

  @Field()
  readonly neighborhood: string;

  @Field()
  readonly city: string;

  @Field()
  readonly state: string;

  @Field()
  readonly country: string;

  @Field()
  readonly postalCode: string;

  public static toEntity(input: CreateAddressInput): CustomerAddress {
    const address = new CustomerAddress();
    address.street = input.street;
    address.number = input.number;
    address.neighborhood = input.neighborhood;
    address.city = input.city;
    address.state = input.state;
    address.country = input.country;
    address.postalCode = input.postalCode;

    return address;
  }
}
