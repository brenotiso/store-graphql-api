import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Customer } from 'modules/customer/customer.entity';
import { CustomerRepository } from 'modules/customer/customer.repository';
import { CustomerService } from 'modules/customer/customer.service';
import {
  getCustomerWithRelationsMock,
  getCustomerOneAddressesMock,
  getCustomerOneOrdersMock,
  getCustomersMock
} from './mocks/customer.mock';

describe('CustomerService', () => {
  let customerService: CustomerService;
  let customerRepository: CustomerRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: CustomerRepository,
          useValue: {
            findAllWithDeletedRelations: jest.fn(),
            findByIdWithDeletedRelations: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            softRemove: jest.fn()
          }
        }
      ]
    }).compile();

    customerService = module.get(CustomerService);
    customerRepository = module.get(CustomerRepository);

    jest
      .spyOn(customerRepository, 'findOne')
      .mockResolvedValue(getCustomerWithRelationsMock());
    jest
      .spyOn(customerRepository, 'findAllWithDeletedRelations')
      .mockResolvedValue(getCustomersMock());
    jest
      .spyOn(customerRepository, 'findByIdWithDeletedRelations')
      .mockResolvedValue(getCustomerWithRelationsMock());
    jest
      .spyOn(customerRepository, 'save')
      .mockResolvedValue(getCustomerWithRelationsMock());
    jest
      .spyOn(customerRepository, 'softRemove')
      .mockResolvedValue(getCustomerWithRelationsMock());
  });

  describe('findAll', () => {
    it('should return all customers', async () => {
      const result = await customerService.findAll();

      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toBeInstanceOf(Customer);
      expect(result[0]).toMatchObject({
        id: 1,
        name: 'teste',
        email: 'teste',
        cpf: '12345678912',
        birthDate: '2021-11-28',
        addresses: getCustomerOneAddressesMock(),
        orders: getCustomerOneOrdersMock()
      });
    });

    it('should return an empty array', async () => {
      jest
        .spyOn(customerRepository, 'findAllWithDeletedRelations')
        .mockResolvedValueOnce([]);

      const result = await customerService.findAll();

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });
  });

  describe('findById', () => {
    it('should return a product by id', async () => {
      const result = await customerService.findById(1);

      expect(result).toBeInstanceOf(Customer);
      expect(result).toMatchObject({
        id: 1,
        name: 'teste',
        email: 'teste',
        cpf: '12345678912',
        birthDate: '2021-11-28',
        addresses: getCustomerOneAddressesMock(),
        orders: getCustomerOneOrdersMock()
      });
    });

    it('should return undefined', async () => {
      jest
        .spyOn(customerRepository, 'findByIdWithDeletedRelations')
        .mockResolvedValueOnce(undefined);

      const result = await customerService.findById(1);

      expect(result).toBe(undefined);
    });
  });

  describe('add', () => {
    let newCustomer: Customer;
    beforeEach(() => {
      newCustomer = Object.assign(new Customer(), {
        name: 'teste',
        email: 'teste',
        cpf: '12345678912',
        birthDate: '2021-11-28',
        addresses: {
          street: 'street 2',
          number: 321,
          neighborhood: 'neighborhood 2',
          city: 'city 2',
          country: 'country 2',
          postalCode: '12345679'
        }
      });
    });

    it('should create new customer', async () => {
      jest.spyOn(customerRepository, 'findOne').mockResolvedValue(undefined);

      jest.spyOn(customerRepository, 'save').mockResolvedValue(newCustomer);

      const result = await customerService.add(newCustomer);

      expect(customerRepository.save).toBeCalledWith(newCustomer);
      expect(result).toBeInstanceOf(Customer);
      expect(result).toMatchObject(newCustomer);
    });

    it('should return ConflictException - email already in use', async () => {
      const existingCustomer = getCustomerWithRelationsMock();
      existingCustomer.id = 22;

      jest
        .spyOn(customerRepository, 'findOne')
        .mockResolvedValue(existingCustomer);

      await expect(customerService.add(newCustomer)).rejects.toThrow(
        ConflictException
      );

      expect(customerRepository.save).not.toBeCalled();
    });

    it('should return ConflictException - CPF already in use', async () => {
      const existingCustomer = getCustomerWithRelationsMock();
      existingCustomer.id = 22;
      existingCustomer.email = 'diferent@email.com';

      jest
        .spyOn(customerRepository, 'findOne')
        .mockResolvedValue(existingCustomer);

      await expect(customerService.add(newCustomer)).rejects.toThrow(
        ConflictException
      );

      expect(customerRepository.save).not.toBeCalled();
    });
  });

  describe('update', () => {
    const updateCustomer: Customer = Object.assign(new Customer(), {
      id: 1,
      name: 'customer atualizado'
    });

    it('should update a customer', async () => {
      const customerToBeUpdated = getCustomerWithRelationsMock();
      customerToBeUpdated.name = 'customer atualizado';

      jest
        .spyOn(customerRepository, 'save')
        .mockResolvedValue(customerToBeUpdated);

      const result = await customerService.update(updateCustomer);

      expect(customerRepository.save).toBeCalledWith(
        expect.objectContaining(updateCustomer)
      );
      expect(result).toBeInstanceOf(Customer);
      expect(result).toMatchObject({
        id: 1,
        name: 'customer atualizado',
        email: 'teste',
        cpf: '12345678912',
        birthDate: '2021-11-28',
        addresses: getCustomerOneAddressesMock(),
        orders: getCustomerOneOrdersMock()
      });
    });

    it('should return NotFoundException - customer not found', async () => {
      jest.spyOn(customerRepository, 'findOne').mockResolvedValue(undefined);

      await expect(customerService.update(updateCustomer)).rejects.toThrow(
        NotFoundException
      );

      expect(customerRepository.save).not.toBeCalled();
    });

    it('should return ConflictException - email already in use', async () => {
      const existingCustomer = getCustomerWithRelationsMock();
      existingCustomer.id = 22;
      existingCustomer.email = 'new@email.com';

      updateCustomer.email = 'new@email.com';

      jest
        .spyOn(customerRepository, 'findOne')
        .mockResolvedValue(existingCustomer);

      await expect(customerService.update(updateCustomer)).rejects.toThrow(
        ConflictException
      );

      expect(customerRepository.save).not.toBeCalled();
    });

    it('should return ConflictException - CPF already in use', async () => {
      const existingCustomer = getCustomerWithRelationsMock();
      existingCustomer.id = 22;
      existingCustomer.email = 'diferent@email.com';
      existingCustomer.cpf = '11122233344';

      updateCustomer.cpf = '11122233344';

      jest
        .spyOn(customerRepository, 'findOne')
        .mockResolvedValue(existingCustomer);

      await expect(customerService.update(updateCustomer)).rejects.toThrow(
        ConflictException
      );

      expect(customerRepository.save).not.toBeCalled();
    });
  });

  describe('remove', () => {
    it('should remove a customer', async () => {
      const result = await customerService.remove(1);

      expect(customerRepository.softRemove).toBeCalledWith(
        expect.objectContaining({ id: 1 })
      );
      expect(result).toBeInstanceOf(Customer);
      expect(result).toMatchObject({
        id: 1,
        name: 'teste',
        email: 'teste',
        cpf: '12345678912',
        birthDate: '2021-11-28',
        addresses: getCustomerOneAddressesMock(),
        orders: getCustomerOneOrdersMock()
      });
    });

    it('should return NotFoundException - customer not found', async () => {
      jest.spyOn(customerRepository, 'findOne').mockResolvedValue(undefined);

      await expect(customerService.remove(1)).rejects.toThrow(
        NotFoundException
      );

      expect(customerRepository.softRemove).not.toBeCalled();
    });
  });
});
