import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuditLogService } from 'src/audit-log/audit-log.service';
import { User } from 'src/users/interfaces/user.interface';

interface CustomRequest extends Request {
  user?: User;
}

@Injectable()
export class AuditLoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly jwtService: JwtService,
  ) {}

  use(req: CustomRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1];
      try {
        const decodedUser: User = this.jwtService.verify(token);

        req.user = decodedUser;
      } catch (error) {
        console.warn('⚠️ Invalid Token:', error);
      }
    }

    res.on('finish', () => {
      const userId = req.user?.id || null;
      this.auditLogService
        .createLog({
          userId,
          endpoint: `${req.method} ${req.originalUrl}`,
          requestBody: JSON.stringify(req.body),
          responseStatus: res.statusCode,
        })
        .catch((error) => console.error('Audit log error:', error));
    });

    next();
  }
}
