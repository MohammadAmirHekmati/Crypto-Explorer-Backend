import { IBitsharesResponse } from './bitshares-response';

export class IAccountBalanceResponse implements IBitsharesResponse{

  id: number;
  jsonrpc: string;
  result?: IAssetBalances[];
  error?:any
}

export interface IAssetBalances {
  amount: string;
  asset_id: string;
}