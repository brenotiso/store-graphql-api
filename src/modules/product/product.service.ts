import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    public readonly repository: ProductRepository
  ) {}

  public async findAll(): Promise<Product[]> {
    return this.repository.find();
  }

  public async findById(id: number): Promise<Product> {
    return this.repository.findOne(id);
  }

  public async add(product: Product): Promise<Product> {
    return this.repository.save(product);
  }

  public async update(product: Product): Promise<Product> {
    const productToUpdate = await this.getProductById(product.id);
    Object.assign(productToUpdate, product);

    return this.repository.save(productToUpdate);
  }

  public async remove(id: number): Promise<Product> {
    const product = await this.getProductById(id);

    return this.repository.softRemove(product);
  }

  private async getProductById(id: number) {
    const product = await this.repository.findOne(id);

    if (!product) throw new NotFoundException(`Produto não encontrado.`);

    return product;
  }
}
