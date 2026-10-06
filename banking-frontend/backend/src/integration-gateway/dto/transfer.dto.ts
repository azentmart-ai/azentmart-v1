import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class TransferDto {
  @IsString()
  @IsNotEmpty()
  transferId: string;

  @IsString()
  @IsNotEmpty()
  fromCustomerId: string;

  @IsString()
  @IsNotEmpty()
  toCustomerId: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  idempotencyKey: string;
}