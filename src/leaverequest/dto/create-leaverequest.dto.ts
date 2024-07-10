import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsString, Validate } from 'class-validator';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';



export class CreateLeaverequestDto {
  @IsDateString()
  leaveStart: Date;

  @IsDateString()
  
  leaveEnd: Date;

  @IsNotEmpty()
  @IsString()
  leaveReason: string;

  @IsNotEmpty()
  readonly leaveType: string;

  @IsNotEmpty()
  @IsNumber({},{each:true})
   userId: number;

  @IsNotEmpty()
  requestDate:Date;


}
