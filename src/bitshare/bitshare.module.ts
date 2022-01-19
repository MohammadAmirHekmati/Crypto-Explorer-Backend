import { Module } from '@nestjs/common';
import { BitshareController } from './controllers/bitshare.controller';
import {  BitshareService } from './services/bitshare-layer-one.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BitshareWalletRepository } from './repositories/bitshare-wallet.repository';

@Module({
  imports:[TypeOrmModule.forFeature([BitshareWalletRepository])],
  controllers:[BitshareController],
  providers:[BitshareService]
})
export class BitshareModule {}
