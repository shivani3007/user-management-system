import { Injectable } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
  HealthCheckResult,
} from '@nestjs/terminus';

@Injectable()
export class HealthService {
  constructor(
    private healthCheckService: HealthCheckService,
    private httpIndicator: HttpHealthIndicator,
    private dbIndicator: TypeOrmHealthIndicator,
  ) {}

  async checkHealth(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      async () =>
        this.httpIndicator.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
      async () => this.dbIndicator.pingCheck('database'),
      () => ({
        uptime: { status: 'up', uptime: process.uptime() },
      }),
    ]);
  }
}
