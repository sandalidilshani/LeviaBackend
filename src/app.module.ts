/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { PlazeruserModule } from './plazeruser/plazeruser.module';
import { LeaverequestModule } from './leaverequest/leaverequest.module';
import { LeavetypeModule } from './leavetype/leavetype.module';
import { UserleaveModule } from './userleave/userleave.module';
import { AuthModule } from './auth/auth.module';
 import { APP_GUARD } from '@nestjs/core';
 import { RoleGuard } from './utility/guard/role.guard';
 import { JwtStrategy } from './auth/stratergy/jwt.strategy';
import { JwtGuard } from './auth/guard/jwt.guard';
@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    PlazeruserModule,
    LeaverequestModule,
    LeavetypeModule,
    UserleaveModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService,{
    provide: APP_GUARD,
    useClass: JwtGuard,
  },{provide: APP_GUARD,
    useClass:RoleGuard
  },
  JwtStrategy],
  
})
export class AppModule {}
