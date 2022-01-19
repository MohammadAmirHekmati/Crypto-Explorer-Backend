import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionAmountDto {

  @ApiProperty()
  amount:number

  @ApiProperty()
  asset_id:string
}