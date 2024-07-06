import { Module } from '@nestjs/common';
import { LeavetypeService } from './leavetype.service';
import { LeavetypeController } from './leavetype.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leavetype } from './entities/leavetype.entity';

@Module({
  controllers: [LeavetypeController],
  providers: [LeavetypeService],
  imports:[TypeOrmModule.forFeature([Leavetype])]

})
export class LeavetypeModule {}
