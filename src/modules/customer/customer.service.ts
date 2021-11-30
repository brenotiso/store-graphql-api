import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { CustomerRepository } from './customer.repository';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerRepository)
    public readonly repository: CustomerRepository
  ) {}

  public async findAll(): Promise<Customer[]> {
    return this.repository.findAllWithDeletedRelations();
  }

  public async findById(id: number): Promise<Customer> {
    return this.repository.findByIdWithDeletedRelations(id);
  }

  public async add(customer: Customer): Promise<Customer> {
    await this.validateUniqueAtributes(customer);

    return this.repository.save(customer);
  }

  public async update(customer: Customer): Promise<Customer> {
    const custommerToUpdate = await this.getCustomerById(customer.id);
    await this.validateUniqueAtributes(customer, customer.id);
    Object.assign(custommerToUpdate, customer);

    return this.repository.save(custommerToUpdate);
  }

  public async remove(id: number): Promise<Customer> {
    const customer = await this.getCustomerById(id);

    return this.repository.softRemove(customer);
  }

  private async getCustomerById(id: number) {
    const customer = await this.repository.findOne(id);

    if (!customer) throw new NotFoundException(`Cliente não encontrado.`);

    return customer;
  }

  private async validateUniqueAtributes(customer: Customer, exceptId?: number) {
    const existingCustomer = await this.repository.findOne({
      where: [{ email: customer.email }, { cpf: customer.cpf }]
    });

    if (!existingCustomer) return;

    if (
      existingCustomer.email === customer.email &&
      existingCustomer.id !== exceptId
    )
      throw new ConflictException(
        'Um usuário já se cadastrou utilizando esse email.'
      );

    if (
      existingCustomer.cpf === customer.cpf &&
      existingCustomer.id !== exceptId
    )
      throw new ConflictException(
        'Um usuário já se cadastrou utilizando esse CPF.'
      );
  }
}
