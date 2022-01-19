import { CreateTransactionOptionsDto } from './create-transaction-options.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {

  @ApiProperty()
  options:CreateTransactionOptionsDto
}

