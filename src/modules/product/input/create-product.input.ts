import { Field, InputType } from '@nestjs/graphql';
import { IsInt, IsNumber, IsUrl } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  readonly name: string;

  @Field()
  @IsUrl()
  readonly imageUrl: string;

  @Field()
  readonly description: string;

  @Field()
  @IsNumber({ maxDecimalPlaces: 3 })
  readonly weight: number;

  @Field()
  @IsNumber({ maxDecimalPlaces: 2 })
  readonly price: number;

  @Field()
  @IsInt()
  readonly stock: number;
}
