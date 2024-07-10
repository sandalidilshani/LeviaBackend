import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PlazeruserService } from 'src/plazeruser/plazeruser.service';
import { Role } from './role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private plazeruserService: PlazeruserService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const userRole = await this.getUserRole(user.username);
  
    // Allow access if the user role is HRManager or if it matches any of the required roles
    if (requiredRoles.some(role => role.toLowerCase() === userRole.toLowerCase())) {
      console.log('true')
      return true;
    }
console.log('false')
    return false;
  }

  async getUserRole(username: string): Promise<string> {
    const user = await this.plazeruserService.findUserByUserName(username);
    if (!user) {
      throw new Error(`User '${username}' not found.`);
    }

    // Map roles as needed; assume roles are directly accessible from user object
    if (user.role === 'HRManager') {
      return 'HRManager';
    } else {
      return 'User'; // Default role for other users
    }
  }
}
