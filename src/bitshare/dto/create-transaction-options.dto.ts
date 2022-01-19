import { CreateTransactionAmountDto } from './create-transaction-amount.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionOptionsDto {
  @ApiProperty()
  from:string

  @ApiProperty()
  to:string

  @ApiProperty()
  amount:CreateTransactionAmountDto
}