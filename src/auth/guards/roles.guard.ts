import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request } from 'express';
import { User } from 'src/users/interfaces/user.interface';

@Injectable()
export class RolesGuard extends JwtAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context); // First, validate JWT token

    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) return true; // If no roles are required, allow access

    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as User;

    const userRole = user.role?.name || '';

    if (!user || !user.role || !requiredRoles.includes(userRole)) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
