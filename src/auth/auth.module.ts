import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { PlazeruserModule } from 'src/plazeruser/plazeruser.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { authConstants } from './auth.constant';
import {JwtStrategy} from './stratergy/jwt.strategy'
import { LocalStrategy } from './stratergy/local.strategy';
@Module({
  imports: [
    PlazeruserModule,
    JwtModule.register({
      secret: authConstants.secret,
      signOptions: {
        expiresIn: '1d',
      },
    }),
    PassportModule,
  ],
  controllers: [AuthController,],
  providers: [AuthService,JwtStrategy,LocalStrategy],
  exports: [AuthService,PassportModule,JwtModule,],
})
export class AuthModule {}