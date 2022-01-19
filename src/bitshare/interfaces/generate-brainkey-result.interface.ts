import { IBitsharesResponse } from './bitshares-response';

export class IGenerateBrainKeyResult implements IBitsharesResponse{
  
  id: number;
  jsonrpc: string;
  result?: IResult;
  error?:any
}

export interface IResult {
  brain_priv_key: string;
  wif_priv_key: string;
  pub_key: string;
}