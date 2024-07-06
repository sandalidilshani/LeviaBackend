import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { localDataSource, neonDataSource } from 'db/data-source';
import { PlazeruserModule } from './plazeruser/plazeruser.module';
import { LeaverequestModule } from './leaverequest/leaverequest.module';
import { LeavetypeModule } from './leavetype/leavetype.module';
import { UserleaveModule } from './userleave/userleave.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from './utility/guard/role.guard';
import { JwtStrategy } from './auth/stratergy/jwt.strategy';
import { JwtGuard } from './auth/guard/jwt.guard';
import { Plazeruser } from './plazeruser/entities/plazeruser.entity';
import { LeaveRequest } from './leaverequest/entities/leaverequest.entity';
import { Leavetype } from './leavetype/entities/leavetype.entity';
import { UserLeave } from './userleave/entities/userleave.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
    host: 'ep-silent-mode-a1stsb69.ap-southeast-1.aws.neon.tech',
    port: 5432,
    username: 'neondb_owner',
    password: 'SM5YoOPCkUT3',
    database: 'neondb',
    synchronize: true,
    logging: true,
    ssl:true,
    entities: [Plazeruser, LeaveRequest, Leavetype, UserLeave],
    subscribers: [],
    migrations: [],

  }),
  
    PlazeruserModule,
    LeaverequestModule,
    LeavetypeModule,
    UserleaveModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    JwtStrategy
  ],
})
export class AppModule {}
