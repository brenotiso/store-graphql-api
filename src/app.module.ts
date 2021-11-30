import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from 'modules/order/order.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      playground: true // se for utilizar o apollo será necessário setar o playground como false
      //plugins: [ApolloServerPluginLandingPageLocalDefault()]
    }),
    OrderModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
