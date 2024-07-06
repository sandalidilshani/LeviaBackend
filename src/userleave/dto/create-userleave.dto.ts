import { IsDateString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateUserleaveDto {
  
  @IsNotEmpty()
  @IsNumber()
  totalLeaves: number;

  @IsDateString()
  leavesValidUntil: Date;
}