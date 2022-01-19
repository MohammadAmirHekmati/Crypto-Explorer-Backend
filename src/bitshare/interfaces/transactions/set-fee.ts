import { IBitsharesResponse } from '../bitshares-response';

export class ISetFee implements IBitsharesResponse{

  error?:any
  result?:IFeeResult
  id: number;
  jsonrpc: string;
}

export interface IFeeResult {
  amount:number

  asset_id:string
}