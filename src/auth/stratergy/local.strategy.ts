// src/auth/strategy/local.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'userpassword',
    });
  }

  async validate(username: string, password: string): Promise<any> {
    console.log('LocalStrategy validate method called with', { username, password });
    const user = await this.authService.validateUser(username, password);
    console.log('User after validation in LocalStrategy', user);

    if (!user) {
      console.log('User not found or invalid credentials');
      throw new UnauthorizedException();
    }
    return user;
  }
}
