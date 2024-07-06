import { IsEmail, IsString, MinLength, IsNotEmpty, IsDate, IsOptional, IsInt, IsDateString } from "class-validator";

export class CreatePlazeruserDto {
  @IsString()
  @IsNotEmpty({message:'name cannot null'})
  username: string;

  @IsString()
  upassword: string;

  @IsString()
  ufname: string;

  @IsString()
  ulname: string;

  @IsString()
  addressl1: string;

  @IsString()
  addressl2: string;

  @IsString()
  addressl3: string;

  @IsEmail()
  email: string;

  @IsString()
  skills: string;

  @IsDateString()
  dob: string;

  @IsString()
  gitrepo: string;

  @IsString()
  role: string;

  @IsOptional()
  @IsInt()
  totalLeaves: number;

  @IsOptional()
  @IsInt()
  availableLeaves: number;
}

