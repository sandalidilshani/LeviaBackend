import { IsNotEmpty, IsString } from "class-validator";

export class userSignInDto{
    @IsString()
  @IsNotEmpty({message:'name cannot null'})
  userName: string;

  @IsString()
  userPassword: string;

}