import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { ProductModule } from 'modules/product/product.module';
import { CustomerModule } from 'modules/customer/customer.module';
import { NotificationModule } from 'modules/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderRepository]),
    CustomerModule,
    ProductModule,
    NotificationModule
  ],
  controllers: [],
  providers: [OrderService, OrderResolver],
  exports: [OrderResolver, TypeOrmModule.forFeature([OrderRepository])]
})
export class OrderModule {}
