import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('email_black_list')
export class EmailBlackList {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 128, nullable: false })
  email: string;

  @Column({ type: 'tinyint', width: 1, default: 1, nullable: false })
  banned: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt: Date;
}
