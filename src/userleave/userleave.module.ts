import { Module } from '@nestjs/common';
import { UserleaveService } from './userleave.service';
import { UserleaveController } from './userleave.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLeave } from './entities/userleave.entity';
import { Plazeruser } from 'src/plazeruser/entities/plazeruser.entity';
import { PlazeruserModule } from 'src/plazeruser/plazeruser.module';

@Module({
  controllers: [UserleaveController],
  providers: [UserleaveService],
  imports:[TypeOrmModule.forFeature([UserLeave]),PlazeruserModule]
})
export class UserleaveModule {}
