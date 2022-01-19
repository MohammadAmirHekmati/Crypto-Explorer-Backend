import { ApiProperty } from '@nestjs/swagger';

export class SetFeeDto {

  @ApiProperty()
  asset_id:string
}