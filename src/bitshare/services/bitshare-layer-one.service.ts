import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { IGenerateBrainKeyResult } from '../interfaces/generate-brainkey-result.interface';
import { CreateAccountDto } from '../dto/create-account.dto';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BitshareWalletRepository } from '../repositories/bitshare-wallet.repository';
import { BitshareWalletEntity } from '../entities/bitshare-wallet.entity';
import { IAccountBalanceResponse } from '../interfaces/account-balance.response';
import { GetBlockInfo } from '../interfaces/block-info.response.interface';
import { IGetAccount } from '../interfaces/get-account.interface';
import { IAsset, IListAssets } from '../interfaces/list-assets.response';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { IBitsharesRequest } from '../interfaces/transactions/request/sign-transaction-request.body';
import { GetAccountResponse} from '../interfaces/get-account.rresponse';
import { sha512 } from 'js-sha512';
import { baseUrl } from '../public/base.url';
import { IStartTransaction } from '../interfaces/transactions/start-transaction';
import { ICreateTransaction } from '../interfaces/transactions/create-transaction';
import { IFeeResult, ISetFee } from '../interfaces/transactions/set-fee';
import { ISignTransaction, ISignTransactionResult } from '../interfaces/transactions/sign-transaction';

@Injectable()
export class BitshareService {
  constructor(@InjectRepository(BitshareWalletRepository) private readonly bitshareWalletRepository: BitshareWalletRepository) {}

  async getBlockInformation(blockNumber: number): Promise<any>
  {
    const getBlockInfoBody:IBitsharesRequest=
      {
        id: 2,
        jsonrpc: "2.0",
        method: "get_block",
        params: [blockNumber]
      }
    const sendRequest = await axios({method:'GET',url:baseUrl,data:getBlockInfoBody})
    const sendRequestData: GetBlockInfo = sendRequest.data
    if (sendRequestData.error)
      throw new BadRequestException()
    const blockInformation = sendRequestData.result
    return blockInformation
  }

  async generateBrainKeyAndCreateWallet(createAccountDto: CreateAccountDto): Promise<string>
  {
    const generateBrainKeyAndCreateWallet = await this.generateBrainKey(createAccountDto)
    return generateBrainKeyAndCreateWallet
  }

  async getAccountIdByAccountName(account_name:string):Promise<string>
  {
    const getAccountInfoBody:IBitsharesRequest=
      {
        id:2,
        jsonrpc:'2.0',
        method:'get_account',
        params:[account_name]
      }
    const sendRequestToGetAccount=await axios({method:'GET',url:baseUrl,data:getAccountInfoBody})
    const getAccountRequestData:GetAccountResponse=sendRequestToGetAccount.data
    if (getAccountRequestData.error)
      throw new BadRequestException(`Http Reqest failed at getAccountByWalletAddress `)
    const account_id:string=getAccountRequestData.result.id
    return account_id
  }

  async generateBrainKey(createAccountDto: CreateAccountDto): Promise<any>
  {
      const generateBrainKeyBody:IBitsharesRequest=
        {
          id: 2,
          jsonrpc: "2.0",
          method: "suggest_brain_key",
          params: []
        }
    const sendRequest = await axios({url:baseUrl,method:'GET',data:generateBrainKeyBody})

    const generateBrainKeyResult: IGenerateBrainKeyResult = sendRequest.data
    if (generateBrainKeyResult.error)
      throw new BadRequestException(`Http Reqquest failed at generateBrainKey`)
    const brainKey = generateBrainKeyResult.result.brain_priv_key
    const publicKey = generateBrainKeyResult.result.pub_key
    const prvKey = sha512(generateBrainKeyResult.result.wif_priv_key+generateBrainKeyResult.result.wif_priv_key+publicKey)
    const createWalletDto: CreateWalletDto =
      {
        accountName: createAccountDto.accountName,
        brainKey: brainKey
      }

    const createWallet = await this.createWallet(createWalletDto)

      const getAccountId=await this.getAccountIdByAccountName(createAccountDto.accountName)
        const accountId=getAccountId

    const bitshareWallet = new BitshareWalletEntity()
    bitshareWallet.accountname = createAccountDto.accountName
    bitshareWallet.private_key = prvKey
    bitshareWallet.public_key = publicKey
    bitshareWallet.account_id=accountId
    const saved = await this.bitshareWalletRepository.save(bitshareWallet)

    return prvKey
  }

  async createWallet(createWalletDto: CreateWalletDto): Promise<any>
  {
    const createWalletBody:IBitsharesRequest=
      {
        id: 2,
        jsonrpc: "2.0",
        method: "create_account_with_brain_key",
        params: [createWalletDto.brainKey, createWalletDto.accountName, "nathan", "nathan", true]
      }
    const sendRequest = await axios({url:baseUrl,method:'GET',data:createWalletBody})


  }

  async getAccountBalances(walletAddress: string): Promise<any>
  {
    const userAccount = await this.bitshareWalletRepository.findOne({
      where: {
        public_key: walletAddress,
        deleted: false
      }
    })
    if (!userAccount)
      throw new NotFoundException(`There is no wallet for address: ${walletAddress}`)

    const accountName = userAccount.accountname

    const getAccountBalanceBody:IBitsharesRequest=
      {
        id: 2,
        jsonrpc: "2.0",
        method: "list_account_balances",
        params: [accountName]
      }
    const sendRequest = await axios({url:baseUrl,method:'GET',data:getAccountBalanceBody})

    const sendRequestData: IAccountBalanceResponse = sendRequest.data
    if (sendRequestData.error)
      throw new BadRequestException(`Http Request failed at accountBalances`)
    return sendRequestData.result
  }

  async getAccountInfo(walletAddress: string): Promise<any>
  {
    const account = await this.bitshareWalletRepository.findOne({
      where: {
        walletaddress: walletAddress,
        deleted: false
      }})
    if (!account)
      throw new NotFoundException()

    const accountName = account.accountname
    const getAccountInfoBody:IBitsharesRequest=
      {
        id: 2,
        jsonrpc: "2.0",
        method: "get_account",
        params: [accountName]
      }
    const sendRequest = await axios({method:'GET',url:baseUrl,data:getAccountInfoBody})

    const sendRequestData: IGetAccount = sendRequest.data
    if (sendRequestData.error)
      throw new BadRequestException(`Http request failed at getAccountInfo`)
    const accountInfo = sendRequestData.result
    return accountInfo
  }

  async findAccountIdWithWallet(walletAddress:string):Promise<string>
  {
    const account=await this.bitshareWalletRepository.findOne({where:{walletaddress:walletAddress,deleted:false}})
    if (!account)
      throw new NotFoundException('Account not found')

    return account.account_id
  }

  async getAllAssets():Promise<any>
  {
    const getAllAssetsBody:IBitsharesRequest=
      {
        id:2,
        jsonrpc:'2.0',
        method:"list_assets",
        params:["",100]
      }
    const sendRequest=await axios({url:baseUrl,method:'GET',data:getAllAssetsBody})
      const sendRequestData:IListAssets=sendRequest.data
    if (sendRequestData.error)
      throw new BadRequestException(`Http Request failed at getAllAssets`)
        const assets:IAsset[]=sendRequestData.result
        return assets
  }

  async createAndSignTransaction(asset_id:string,createTransactionDto:CreateTransactionDto,private_key:string):Promise<string>
  {
    const beginTransactionBuilder=await this.beginTransactionBuilder()
    const fromAccountName=await this.findAccountIdWithWallet(createTransactionDto.options.from)
    const toAccountName=await this.findAccountIdWithWallet(createTransactionDto.options.to)
      const createTransactionDtoPipe:CreateTransactionDto=
        {
         options:{
           from:fromAccountName,
           to:toAccountName,
           amount:createTransactionDto.options.amount
         }
        }

    const createTransaction=await this.createTransaction(createTransactionDtoPipe,beginTransactionBuilder,private_key)
      if (createTransaction!==null)
        throw new BadRequestException('Transaction failed at create...!')

    const transactionSetFee=await this.setFeeForTransaction(asset_id,beginTransactionBuilder)
      const signTransaction=await this.signTransaction(beginTransactionBuilder)
    if (!signTransaction)
      throw new BadRequestException('Transaction failed at signed...!')

    return `Transaction create and sign successfully  ${signTransaction.signatures}`
  }

  async userAthenticateForCreateTransaction(private_key:string):Promise<any>
  {
    const account=await this.bitshareWalletRepository.findOne({where:{private_key:private_key,deleted:false}})
    if (account)
      throw new NotFoundException()

    const publicKey=account.public_key
  }

  async beginTransactionBuilder():Promise<number>
  {
    const beginTransactionBuilderBody:IBitsharesRequest=
      {
        id:2,
        jsonrpc:"2.0",
        method:'begin_builder_transaction',
        params:[]
      }
    const startTransactionRequest=await axios({method:'GET',data:beginTransactionBuilderBody,url:baseUrl})
    if (startTransactionRequest.status!==200)
      throw new BadRequestException('Requqest failed at begin_builder_transaction')
    const startTransactionData:IStartTransaction=startTransactionRequest.data
    if (startTransactionData.error)
      throw new BadRequestException(`Http Reqest failed at beginTransactionBuilder`)
    const startTransactionNumber:number=startTransactionData.result
    return startTransactionNumber
  }

  async createTransaction(createTransactionDtoPipe:CreateTransactionDto,beginTransactionBuilder:number,private_key:string):Promise<any>
  {
    const createTransactionBody:IBitsharesRequest=
      {
        id:2,
        jsonrpc:"2.0",
        method:"add_operation_to_builder_transaction",
        params: [beginTransactionBuilder,[0,{
          from: createTransactionDtoPipe.options.from,
          to:createTransactionDtoPipe.options.to,
          amount: {
            amount: createTransactionDtoPipe.options.amount.amount,
            asset_id: createTransactionDtoPipe.options.amount.asset_id
          }
        }]]
      }
    const accountPubliceKey=await this.userAthenticateForCreateTransaction(private_key)
    if (accountPubliceKey!==createTransactionDtoPipe.options.from)
      throw new BadRequestException('This is not your wallet to do transaction')

    const createTransactionRequest=await axios({method:'GET',url:baseUrl,data:createTransactionBody})
    if (createTransactionRequest.status!==200)
      throw new BadRequestException('Request failed at create Transaction')

    const createTransactionRequestData:ICreateTransaction=createTransactionRequest.data
    if (createTransactionRequestData.error)
      throw new BadRequestException(`Http Request Failed at Create Transaction`)

    return createTransactionRequestData.result
  }

  async setFeeForTransaction(asset_id:string,beginTransactionBuilder:number):Promise<IFeeResult>
  {
    const setFeeForTransactionBody:IBitsharesRequest=
      {
        id:2,
        jsonrpc:"2.0",
        method:"set_fees_on_builder_transaction",
        params:[beginTransactionBuilder,asset_id]
      }
    const setFeeRequest=await axios({method:'GET',data:setFeeForTransactionBody,url:baseUrl})
    const setFeeRequestData:ISetFee=setFeeRequest.data
    if (setFeeRequestData.error)
      throw new BadRequestException(`Http request failed at setFeeForTransaction`)
    return setFeeRequestData.result
  }

  async signTransaction(beginTransactionBuilder:number):Promise<ISignTransactionResult>
  {
    const signTransactionBody:IBitsharesRequest=
      {
        id:2,
        jsonrpc:'2.0',
        method:"sign_builder_transaction",
        params:[beginTransactionBuilder,true]
      }

    const signTransactionRequest=await axios({method:'GET',data:signTransactionBody,url:baseUrl})

    if (signTransactionRequest.status!==200)
      throw new BadRequestException('Request failed at sign transaction')

    const signTransactionRequestData:ISignTransaction=signTransactionRequest.data
    if (signTransactionRequestData.error)
      throw new BadRequestException(`Http Equest Failed at signTransaction`)
    return signTransactionRequestData.result
  }

}