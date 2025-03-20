import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { Role } from '../common/enums';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard) // Protect with JWT & Role Guards
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @Roles(Role.ADMIN) // Only admins can access this endpoint
  getLogs(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.auditLogService.getAuditLogs(Number(page), Number(limit));
  }
}
