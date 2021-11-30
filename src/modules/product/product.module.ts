import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRepository } from './product.repository';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductRepository])],
  controllers: [],
  providers: [ProductService, ProductResolver],
  exports: [ProductResolver, TypeOrmModule.forFeature([ProductRepository])]
})
export class ProductModule {}
