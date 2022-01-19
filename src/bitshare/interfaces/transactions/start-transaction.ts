import { IBitsharesRequest } from './request/sign-transaction-request.body';
import { IBitsharesResponse } from '../bitshares-response';

export class IStartTransaction implements IBitsharesResponse{

  error?:any
  result?:number
  id: number;
  jsonrpc: string;
}
