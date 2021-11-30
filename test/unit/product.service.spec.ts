import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Product } from 'modules/product/product.entity';
import { ProductRepository } from 'modules/product/product.repository';
import { ProductService } from 'modules/product/product.service';
import { getProductMock, getProductsMock } from './mocks/product.mock';

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: ProductRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            softRemove: jest.fn()
          }
        }
      ]
    }).compile();

    productService = module.get(ProductService);
    productRepository = module.get(ProductRepository);

    jest.spyOn(productRepository, 'find').mockResolvedValue(getProductsMock());
    jest
      .spyOn(productRepository, 'findOne')
      .mockResolvedValue(getProductMock());
    jest.spyOn(productRepository, 'save').mockResolvedValue(getProductMock());
    jest
      .spyOn(productRepository, 'softRemove')
      .mockResolvedValue(getProductMock());
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const result = await productService.findAll();

      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toBeInstanceOf(Product);
      expect(result[0]).toMatchObject({
        id: 1,
        name: 'teste',
        imageUrl: 'site.com/img.png',
        description: 'teste',
        weight: 5.5,
        price: 10,
        stock: 100
      });
    });

    it('should return an empty array', async () => {
      jest.spyOn(productRepository, 'find').mockResolvedValueOnce([]);

      const result = await productService.findAll();

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });
  });

  describe('findById', () => {
    it('should return a product by id', async () => {
      const result = await productService.findById(1);

      expect(result).toBeInstanceOf(Product);
      expect(result).toMatchObject({
        id: 1,
        name: 'teste',
        imageUrl: 'site.com/img.png',
        description: 'teste',
        weight: 5.5,
        price: 10,
        stock: 100
      });
    });

    it('should return undefined', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(undefined);

      const result = await productService.findById(1);

      expect(result).toBe(undefined);
    });
  });

  describe('add', () => {
    it('should create new product', async () => {
      const newProduct: Product = Object.assign(new Product(), {
        name: 'novo produto',
        imageUrl: 'site.com/img3.png',
        description: 'teste3',
        weight: 1,
        price: 5,
        stock: 50
      });

      jest.spyOn(productRepository, 'save').mockResolvedValue(newProduct);

      const result = await productService.add(newProduct);

      expect(productRepository.save).toBeCalledWith(newProduct);
      expect(result).toBeInstanceOf(Product);
      expect(result).toMatchObject(newProduct);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const productToBeUpdated = getProductMock();
      productToBeUpdated.name = 'produto atualizado';

      jest
        .spyOn(productRepository, 'save')
        .mockResolvedValue(productToBeUpdated);

      const updateProduct: Product = Object.assign(new Product(), {
        id: 1,
        name: 'produto atualizado'
      });

      const result = await productService.update(updateProduct);

      expect(productRepository.save).toBeCalledWith(
        expect.objectContaining(updateProduct)
      );
      expect(result).toBeInstanceOf(Product);
      expect(result).toMatchObject({
        id: 1,
        name: 'produto atualizado',
        imageUrl: 'site.com/img.png',
        description: 'teste',
        weight: 5.5,
        price: 10,
        stock: 100
      });
    });

    it('should return NotFoundException - product not found', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);

      const updateProduct: Product = Object.assign(new Product(), {
        id: 1,
        name: 'produto atualizado'
      });

      await expect(productService.update(updateProduct)).rejects.toThrow(
        NotFoundException
      );

      expect(productRepository.save).not.toBeCalled();
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const result = await productService.remove(1);

      expect(productRepository.softRemove).toBeCalledWith(
        expect.objectContaining({ id: 1 })
      );
      expect(result).toBeInstanceOf(Product);
      expect(result).toMatchObject({
        id: 1,
        name: 'teste',
        imageUrl: 'site.com/img.png',
        description: 'teste',
        weight: 5.5,
        price: 10,
        stock: 100
      });
    });

    it('should return NotFoundException - product not found', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);

      await expect(productService.remove(1)).rejects.toThrow(NotFoundException);

      expect(productRepository.softRemove).not.toBeCalled();
    });
  });
});
