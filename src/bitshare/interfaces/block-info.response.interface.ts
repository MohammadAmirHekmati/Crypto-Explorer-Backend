import { IBitsharesResponse } from './bitshares-response';

export class GetBlockInfo implements IBitsharesResponse{
  id:number
  jsonrpc: string;
  error?:Object
  result?:IBlockInformation
}

export interface IBlockInformation {
  previous: string;
  timestamp: Date;
  witness: string;
  transaction_merkle_root: string;
  extensions: any[];
  witness_signature: string;
  transactions: any[];
  block_id: string;
  signing_key: string;
  transaction_ids: any[];
}