import { IsEmail, IsString, IsNotEmpty, IsDateString, IsOptional, IsEnum } from "class-validator";

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

export class UpdatePlazeruserDto {
  
  



  @IsOptional()
  @IsString()
  userFName?: string;

  @IsOptional()
  @IsString()
  userLName?: string;

  @IsOptional()
  @IsString()
  AddressL1?: string;

  @IsOptional()
  @IsString()
  AddressL2?: string;

  @IsOptional()
  @IsString()
  AddressL3?: string;

  @IsOptional()
  @IsEmail()
  Email?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: string;

  @IsOptional()
  @IsString()
  skills?: string;

  @IsOptional()
  @IsDateString()
  DoB?: Date;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  gitlink?: string;
}
