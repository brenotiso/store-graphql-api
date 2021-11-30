import { Field, InputType } from '@nestjs/graphql';
import { IsDateString, IsEmail, Matches } from 'class-validator';
import { CreateAddressInput } from 'modules/customer/input/create-address.input';
import { Customer } from '../customer.entity';

@InputType()
export class CreateCustomerInput {
  @Field()
  readonly name: string;

  @Field()
  @IsEmail()
  readonly email: string;

  @Field()
  readonly cpf: string;

  @Field()
  @Matches(/^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/)
  @IsDateString()
  readonly birthDate: string;

  @Field(() => CreateAddressInput)
  readonly address: CreateAddressInput;

  public static toEntity(input: CreateCustomerInput, id?: number): Customer {
    const customer = new Customer();
    customer.id = id;
    customer.name = input.name;
    customer.email = input.email;
    customer.cpf = input.cpf;
    customer.birthDate = input.birthDate;
    customer.addresses = [CreateAddressInput.toEntity(input.address)];

    return customer;
  }
}
