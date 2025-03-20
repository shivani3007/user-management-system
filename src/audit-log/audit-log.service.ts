import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async createLog(logData: Partial<AuditLog>) {
    const log = this.auditLogRepository.create(logData);
    await this.auditLogRepository.save(log);
  }

  async getAuditLogs(page: number, limit: number) {
    const [logs, total] = await this.auditLogRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { timestamp: 'DESC' },
    });

    return { page, limit, total, logs };
  }
}
