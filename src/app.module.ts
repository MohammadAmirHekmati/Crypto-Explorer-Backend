import { Module } from '@nestjs/common';
import { BitshareModule } from './bitshare/bitshare.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [BitshareModule, DatabaseModule],

})
export class AppModule {}
