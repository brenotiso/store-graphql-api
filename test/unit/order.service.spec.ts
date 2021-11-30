import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CustomerRepository } from 'modules/customer/customer.repository';
import { NotificationService } from 'modules/notification/notification.service';
import { Order } from 'modules/order/order.entity';
import { OrderRepository } from 'modules/order/order.repository';
import { OrderService } from 'modules/order/order.service';
import { Product } from 'modules/product/product.entity';
import { ProductRepository } from 'modules/product/product.repository';
import { getCustomerMock } from './mocks/customer.mock';
import { getCustomerOneOrderMock, getOrderMock } from './mocks/order.mock';
import { getProductMock } from './mocks/product.mock';

describe('OrderService', () => {
  let orderService: OrderService;
  let orderRepository: OrderRepository;
  let productRepository: ProductRepository;
  let customerRepository: CustomerRepository;
  let notificationService: NotificationService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: OrderRepository,
          useValue: {
            findAllWithDeletedRelations: jest.fn(),
            findByIdWithDeletedRelations: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            softRemove: jest.fn()
          }
        },
        {
          provide: ProductRepository,
          useValue: {
            find: jest.fn(),
            save: jest.fn()
          }
        },
        {
          provide: CustomerRepository,
          useValue: {
            findOne: jest.fn()
          }
        },
        {
          provide: NotificationService,
          useValue: {
            sendEmail: jest.fn()
          }
        }
      ]
    }).compile();

    orderService = module.get(OrderService);
    orderRepository = module.get(OrderRepository);
    productRepository = module.get(ProductRepository);
    customerRepository = module.get(CustomerRepository);
    notificationService = module.get(NotificationService);

    jest
      .spyOn(orderRepository, 'findAllWithDeletedRelations')
      .mockResolvedValue([getCustomerOneOrderMock()]);
    jest
      .spyOn(orderRepository, 'findByIdWithDeletedRelations')
      .mockResolvedValue(getCustomerOneOrderMock());
    jest.spyOn(orderRepository, 'findOne').mockResolvedValue(getOrderMock());
    jest.spyOn(orderRepository, 'save').mockResolvedValue(getOrderMock());
    jest.spyOn(orderRepository, 'softRemove').mockResolvedValue(getOrderMock());

    jest.spyOn(productRepository, 'find').mockResolvedValue([getProductMock()]);

    jest
      .spyOn(customerRepository, 'findOne')
      .mockResolvedValue(getCustomerMock());

    jest.spyOn(notificationService, 'sendEmail').mockResolvedValue(null);
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      const result = await orderService.findAll();

      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toBeInstanceOf(Order);
      expect(result[0]).toMatchObject({
        id: 1,
        status: 'New',
        parcels: 2,
        customerId: 1
      });
    });

    it('should return an empty array', async () => {
      jest
        .spyOn(orderRepository, 'findAllWithDeletedRelations')
        .mockResolvedValueOnce([]);

      const result = await orderService.findAll();

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });
  });

  describe('findById', () => {
    it('should return a product by id', async () => {
      const result = await orderService.findById(1);

      expect(result).toBeInstanceOf(Order);
      expect(result).toMatchObject({
        id: 1,
        status: 'New',
        parcels: 2,
        customerId: 1
      });
    });

    it('should return undefined', async () => {
      jest
        .spyOn(orderRepository, 'findByIdWithDeletedRelations')
        .mockResolvedValueOnce(undefined);

      const result = await orderService.findById(1);

      expect(result).toBe(undefined);
    });
  });

  describe('add', () => {
    let newOrder: Order;
    let updatedProduct: Product;
    beforeEach(() => {
      newOrder = Object.assign(new Order(), {
        id: 1,
        status: 'New',
        parcels: 2,
        customerId: 1,
        products: [
          {
            productId: 1,
            quantity: 2,
            observation: 'bem embalado'
          }
        ]
      });

      updatedProduct = Object.assign(new Product(), {
        id: 1,
        stock: getProductMock().stock - 2
      });
    });

    it('should create a new order', async () => {
      jest.spyOn(orderRepository, 'save').mockResolvedValue(newOrder);

      const result = await orderService.add(newOrder);

      expect(orderRepository.save).toBeCalledWith(newOrder);
      expect(productRepository.save).toBeCalledWith(
        expect.objectContaining(updatedProduct)
      );
      expect(notificationService.sendEmail).toBeCalled();
      expect(result).toBeInstanceOf(Order);
      expect(result).toMatchObject(newOrder);
    });

    it('should create a new order and return the new order, even if email send fails', async () => {
      jest.spyOn(orderRepository, 'save').mockResolvedValue(newOrder);

      jest
        .spyOn(notificationService, 'sendEmail')
        .mockRejectedValueOnce(new Error());

      const result = await orderService.add(newOrder);

      expect(orderRepository.save).toBeCalledWith(newOrder);
      expect(productRepository.save).toBeCalledWith(
        expect.objectContaining(updatedProduct)
      );
      expect(notificationService.sendEmail).toBeCalled();
      expect(result).toBeInstanceOf(Order);
      expect(result).toMatchObject(newOrder);
    });

    it('should return NotFoundException - customer not found', async () => {
      jest
        .spyOn(customerRepository, 'findOne')
        .mockResolvedValueOnce(undefined);

      await expect(orderService.add(newOrder)).rejects.toThrow(
        NotFoundException
      );

      expect(orderRepository.save).not.toBeCalled();
      expect(productRepository.save).not.toBeCalled();
      expect(notificationService.sendEmail).not.toBeCalled();
    });

    it('should return NotFoundException - product not found', async () => {
      jest.spyOn(productRepository, 'find').mockResolvedValueOnce([]);

      await expect(orderService.add(newOrder)).rejects.toThrow(
        NotFoundException
      );

      expect(orderRepository.save).not.toBeCalled();
      expect(productRepository.save).not.toBeCalled();
      expect(notificationService.sendEmail).not.toBeCalled();
    });

    it('should return BadRequestException - quantity ordered in over of product stock', async () => {
      const product = getProductMock();
      product.stock = 0;

      jest.spyOn(productRepository, 'find').mockResolvedValueOnce([product]);

      await expect(orderService.add(newOrder)).rejects.toThrow(
        BadRequestException
      );

      expect(orderRepository.save).not.toBeCalled();
      expect(productRepository.save).not.toBeCalled();
      expect(notificationService.sendEmail).not.toBeCalled();
    });
  });

  describe('update', () => {
    it('should update an order', async () => {
      const orderToBeUpdated = getOrderMock();
      orderToBeUpdated.status = 'Delivering';

      jest.spyOn(orderRepository, 'save').mockResolvedValue(orderToBeUpdated);

      const updateOrder: Order = Object.assign(new Order(), {
        id: 1,
        status: 'Delivering'
      });

      const result = await orderService.update(updateOrder);

      expect(orderRepository.save).toBeCalledWith(
        expect.objectContaining(orderToBeUpdated)
      );
      expect(result).toBeInstanceOf(Order);
      expect(result).toMatchObject({
        id: 1,
        status: 'Delivering',
        parcels: 2,
        customerId: 1
      });
    });

    it('should return NotFoundException - order not found', async () => {
      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(undefined);

      const updateOrder: Order = Object.assign(new Order(), {
        id: 1,
        status: 'Delivering'
      });

      await expect(orderService.update(updateOrder)).rejects.toThrow(
        NotFoundException
      );

      expect(orderRepository.save).not.toBeCalled();
    });
  });

  describe('remove', () => {
    it('should remove an order', async () => {
      const result = await orderService.remove(1);

      expect(orderRepository.softRemove).toBeCalledWith(
        expect.objectContaining({ id: 1 })
      );
      expect(result).toBeInstanceOf(Order);
      expect(result).toMatchObject({
        id: 1,
        status: 'New',
        parcels: 2,
        customerId: 1
      });
    });

    it('should return NotFoundException - order not found', async () => {
      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(undefined);

      await expect(orderService.remove(1)).rejects.toThrow(NotFoundException);

      expect(orderRepository.softRemove).not.toBeCalled();
    });
  });
});
