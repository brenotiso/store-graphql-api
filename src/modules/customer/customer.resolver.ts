import { Inject, ParseIntPipe } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { removeUndefinedFiled } from 'common/utils/object.utils';
import { CustomerAddress } from './address/customer-address.entity';
import { Customer } from './customer.entity';
import { CustomerService } from './customer.service';
import { CreateCustomerInput } from './input/create-customer.input';
import { UpdateCustomerInput } from './input/update-create-customer.input';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(
    @Inject(CustomerService)
    public readonly customerService: CustomerService
  ) {}

  @Query(() => [Customer])
  public async customers(): Promise<Customer[]> {
    return this.customerService.findAll();
  }

  @Query(() => Customer, { nullable: true })
  public async customer(
    @Args('id', { type: () => ID }, ParseIntPipe) id: number
  ): Promise<Customer> {
    return this.customerService.findById(id);
  }

  @Mutation(() => Customer)
  public async createCustomer(
    @Args('data') input: CreateCustomerInput
  ): Promise<Customer> {
    return this.customerService.add(this.inputToEntity(input));
  }

  @Mutation(() => Customer)
  public async updateCustomer(
    @Args('id', { type: () => ID }, ParseIntPipe) id: number,
    @Args('data') input: UpdateCustomerInput
  ): Promise<Customer> {
    return this.customerService.update(this.inputToEntity(input, id));
  }

  @Mutation(() => Customer)
  public async removeCustomer(
    @Args('id', { type: () => ID }, ParseIntPipe) id: number
  ): Promise<Customer> {
    return this.customerService.remove(id);
  }

  private inputToEntity(
    input: CreateCustomerInput | UpdateCustomerInput,
    id?: number
  ): Customer {
    const customer = new Customer();
    customer.id = id;
    customer.name = input.name;
    customer.email = input.email;
    customer.cpf = input.cpf;
    customer.birthDate = input.birthDate;

    if (input.address) {
      const address = new CustomerAddress();
      address.id = input.address['id'];
      address.street = input.address.street;
      address.number = input.address.number;
      address.neighborhood = input.address.neighborhood;
      address.city = input.address.city;
      address.state = input.address.state;
      address.country = input.address.country;
      address.postalCode = input.address.postalCode;

      removeUndefinedFiled(address);
      customer.addresses = [address];
    }

    removeUndefinedFiled(customer);
    return customer;
  }
}
