import { EntityRepository, Repository } from 'typeorm';
import { BitshareWalletEntity } from '../entities/bitshare-wallet.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
@EntityRepository(BitshareWalletEntity)
export class BitshareWalletRepository extends Repository<BitshareWalletEntity>{


}