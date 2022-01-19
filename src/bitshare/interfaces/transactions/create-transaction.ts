import { IBitsharesResponse } from '../bitshares-response';

export class ICreateTransaction implements IBitsharesResponse{

  id: number;
  jsonrpc: string;
  result?:any
  error?:any
}