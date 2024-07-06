import { Module } from '@nestjs/common';
import { PlazeruserService } from './plazeruser.service';
import { PlazeruserController } from './plazeruser.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plazeruser } from './entities/plazeruser.entity';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports:[TypeOrmModule.forFeature([Plazeruser]),],
  controllers: [PlazeruserController],
  providers: [PlazeruserService,],
  
  exports:[PlazeruserService]
})
export class PlazeruserModule {}
