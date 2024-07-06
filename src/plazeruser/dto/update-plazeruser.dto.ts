import { PartialType } from '@nestjs/mapped-types';
import { CreatePlazeruserDto } from './create-plazeruser.dto';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdatePlazeruserDto extends PartialType(CreatePlazeruserDto) {

  @IsOptional()
    @IsInt()
    totalLeaves: number;

  @IsOptional()
    @IsInt()
    availableLeaves: number;
}




