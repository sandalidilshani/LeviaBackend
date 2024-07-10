import { IsString } from 'class-validator';

export class CreateLeavetypeDto {
  @IsString()
  type: string;

  @IsString()
  description: string;
}
