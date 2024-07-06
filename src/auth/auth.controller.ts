// src/auth/auth.controller.ts

import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { userSignInDto } from './dto/user-signin.dto';
import { Public } from 'src/utility/common/public.decorator';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { CreatePlazeruserDto } from 'src/plazeruser/dto/create-plazeruser.dto';
@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private authservice: AuthService,
  ) {}

  @Post('/login')
  async signIn(@Body() userSignInDto: userSignInDto): Promise<any> {
    console.log('Hit /login route with');
    return this.authservice.signIn(userSignInDto);
  }
  @Post('/register')
  async register(@Body() createPlazeruserDto: CreatePlazeruserDto): Promise<any> {
    console.log('Hit /register route with', createPlazeruserDto);

    return this.authservice.register(createPlazeruserDto);
  }
}
