import { Test, TestingModule } from '@nestjs/testing';
import { AuditLogService } from './audit-log.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';

describe('AuditLogService', () => {
  let service: AuditLogService;
  // let repository: Repository<AuditLog>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLogService,
        {
          provide: getRepositoryToken(AuditLog),
          useClass: Repository, // Mock TypeORM repository
        },
      ],
    }).compile();

    service = module.get<AuditLogService>(AuditLogService);
    let repository = module.get<Repository<AuditLog>>(
      getRepositoryToken(AuditLog),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
