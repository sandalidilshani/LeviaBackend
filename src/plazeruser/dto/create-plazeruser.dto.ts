import { IsEmail, IsString, IsNotEmpty, IsDateString, IsOptional, IsEnum } from "class-validator";

// Define inline enums
enum Gender {
  Male = 'male',
  Female = 'female',
  Unspecified = 'unspecified',
}

enum Role {
  Member = 'Member',
  OrganizationAdmin = 'Organization Admin',
  HRManager = 'HRManager',
}

export class CreatePlazeruserDto {
  @IsString()
  @IsNotEmpty({ message: 'Username cannot be empty' })
  userName: string;

  @IsString()
  userPassword: string;

  @IsString()
  userFName: string;

  @IsString()
  userLName: string;

  @IsString()
  AddressL1: string;

  @IsString()
  AddressL2: string;

  @IsOptional()
  @IsString()
  AddressL3: string;

  @IsEmail()
  Email: string;

  @IsEnum(Gender)
  gender: string;

  @IsOptional()
  @IsString()
  skills: string;

  @IsDateString()
  DoB: string;

  @IsString()
  phone: string;

  @IsEnum(Role)
  role: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsString()
  gitlink: string;
}
