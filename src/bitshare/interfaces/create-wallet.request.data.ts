import { IBitsharesResponse } from './bitshares-response';

export class ICreateWalletRequestData implements IBitsharesResponse{
  id: number;
  jsonrpc: string;
  result: ICreateWalletResult;
}

export interface ICreateWalletResult {
  ref_block_num: number;
  ref_block_prefix: number;
  expiration: Date;
  operations: any[][];
  extensions: any[];
  signatures: string[];
}