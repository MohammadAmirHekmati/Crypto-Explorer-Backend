import { IBitsharesResponse } from '../bitshares-response';

export class ISignTransaction implements IBitsharesResponse{

  result?: ISignTransactionResult
  id: number;
  jsonrpc: string;
  error?:any
}

export interface ISignTransactionResult {

  ref_block_num: number;
  ref_block_prefix: number;
  expiration: Date;
  operations: any[][];
  extensions: any[];
  signatures: string[];
}