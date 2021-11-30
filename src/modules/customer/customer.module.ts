import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerRepository } from './customer.repository';
import { CustomerResolver } from './customer.resolver';
import { CustomerService } from './customer.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerRepository])],
  controllers: [],
  providers: [CustomerService, CustomerResolver],
  exports: [CustomerResolver, TypeOrmModule.forFeature([CustomerRepository])]
})
export class CustomerModule {}
