import { Body, Controller, Get, HttpStatus, Param, Post, RequestMethod } from '@nestjs/common';
import {  BitshareService } from '../services/bitshare-layer-one.service';
import { CreateAccountDto } from '../dto/create-account.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { SetFeeDto } from '../dto/set-fee.dto';

@ApiTags('Bitshares')
@Controller('bitshare')
export class BitshareController {
  constructor(private bitshareService:BitshareService)
  {}

  @Get('block/info/:block')
  async getBlockInformation(@Param('block') blockNumber:number):Promise<any>
  {
    return await this.bitshareService.getBlockInformation(blockNumber)
  }

  @Post('generate/brainkey/and/create/wallet')
  async generateBrainKeyAndCreateWallet(@Body() createAccountDto:CreateAccountDto):Promise<any>
  {
    return await this.bitshareService.generateBrainKeyAndCreateWallet(createAccountDto)
  }

  @Get('wallet/balance/:wallet')
  async getAccountBalances(@Param('wallet') walletAddress:string):Promise<any>
  {
    return await this.bitshareService.getAccountBalances(walletAddress)
  }

  @Get('account/info/:wallet')
  async getAccountInfo(@Param('wallet') walletAddress:string):Promise<any>
  {
    return await this.bitshareService.getAccountInfo(walletAddress)
  }

  @Get('assets/list')
  async getAllAssets():Promise<any>
  {
    return await this.bitshareService.getAllAssets()
  }

  @Post('create/sign/transaction/:asset')
  async createAndSignTransaction(@Param('asset') asset_id:string,@Param('private') private_key:string ,@Body() createTransactionDto:CreateTransactionDto):Promise<any>
  {
    return await this.bitshareService.createAndSignTransaction(asset_id, createTransactionDto,private_key)
  }
}
