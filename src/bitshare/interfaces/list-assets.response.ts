import { IBitsharesResponse } from './bitshares-response';

export class IListAssets implements IBitsharesResponse{

  id: number;
  jsonrpc: string;
  result?: IAsset[];
  error?:any
}

export interface IAsset {
  id: string;
  symbol: string;
  precision: number;
  issuer: string;
  options: IOptions;
  dynamic_asset_data_id: string;
  total_in_collateral: number;
}

export interface IOptions {

  max_supply: any;
  market_fee_percent: number;
  max_market_fee: any;
  issuer_permissions: number;
  flags: number;
  core_exchange_rate: ICoreExchangeRate;
  whitelist_authorities: any[];
  blacklist_authorities: any[];
  whitelist_markets: any[];
  blacklist_markets: any[];
  description: string;
  extensions: IExtensions;
}

export interface IExtensions {
}

export interface ICoreExchangeRate {
  base: IBase;
  quote: IQuote;
}

export interface IBase {
  amount: number;
  asset_id: string;
}

export interface IQuote {
  amount: number;
  asset_id: string;
}