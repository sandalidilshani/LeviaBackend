import { PartialType } from '@nestjs/mapped-types';
import { CreateLeaverequestDto } from './create-leaverequest.dto';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateLeaverequestDto extends PartialType(CreateLeaverequestDto) {

    leaveId: number;

    @IsDateString()
    @IsOptional()
    readonly leaveStart;
  
    @IsDateString()
    @IsOptional()
    readonly leaveEnd; 
  
    
    @IsString()
    @IsOptional()
    readonly leaveReason;
  
    @IsOptional()
    @IsDateString()
    readonly requestDate;

 
}
