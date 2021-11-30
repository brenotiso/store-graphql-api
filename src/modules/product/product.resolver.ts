import { Inject, ParseIntPipe } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { CreateProductInput } from './input/create-product.input';
import { UpdateProductInput } from './input/update-product.input';
import { removeUndefinedFiled } from 'common/utils/object.utils';

@Resolver(() => Product)
export class ProductResolver {
  constructor(
    @Inject(ProductService)
    public readonly productService: ProductService
  ) {}

  @Query(() => [Product])
  public async products(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Query(() => Product, { nullable: true })
  public async product(
    @Args('id', { type: () => ID }, ParseIntPipe) id: number
  ): Promise<Product> {
    return this.productService.findById(id);
  }

  @Mutation(() => Product)
  public async createProduct(
    @Args('data') input: CreateProductInput
  ): Promise<Product> {
    return this.productService.add(this.inputToEntity(input));
  }

  @Mutation(() => Product)
  public async updateProduct(
    @Args('id', { type: () => ID }, ParseIntPipe) id: number,
    @Args('data') input: UpdateProductInput
  ): Promise<Product> {
    return this.productService.update(this.inputToEntity(input, id));
  }

  @Mutation(() => Product)
  public async removeProduct(
    @Args('id', { type: () => ID }, ParseIntPipe) id: number
  ): Promise<Product> {
    return this.productService.remove(id);
  }

  private inputToEntity(
    input: CreateProductInput | UpdateProductInput,
    id?: number
  ): Product {
    const product = new Product();
    product.id = id;
    product.name = input.name;
    product.imageUrl = input.imageUrl;
    product.description = input.description;
    product.weight = input.weight;
    product.price = input.price;
    product.stock = input.stock;

    removeUndefinedFiled(product);
    return product;
  }
}
