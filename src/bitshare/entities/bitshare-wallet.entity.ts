import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BitshareWalletEntity {
  @PrimaryGeneratedColumn('uuid')
  id:string

  @Column({default:''})
  account_id:string

  @Column({default:''})
  accountname:string

  @Column({default:''})
  public_key:string

  @Column({default:''})
  private_key:string

  @Column({default:''})
  ip:string

  @Column({default:false})
  deleted:boolean
}