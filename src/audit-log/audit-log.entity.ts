import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: number;

  @Column()
  endpoint: string;

  @Column({ type: 'jsonb', nullable: true })
  requestBody: any;

  @Column()
  responseStatus: number;

  @CreateDateColumn()
  timestamp: Date;
}
