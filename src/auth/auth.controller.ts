// src/auth/auth.controller.ts

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { userSignInDto } from './dto/user-signin.dto';
import { Public } from 'src/utility/common/public.decorator';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { authConstants } from './auth.constant';
import { createuserdto } from 'src/plazeruser/dto/create-newuser.dto';
import { JwtService } from '@nestjs/jwt';
import { PlazeruserService } from 'src/plazeruser/plazeruser.service';
import { UpdatePlazeruserDto } from 'src/plazeruser/dto/update-plazeruser.dto';
import { Plazeruser } from 'src/plazeruser/entities/plazeruser.entity';
@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private authservice: AuthService,
    private jwtService: JwtService,
    private plazerservise: PlazeruserService,
  ) {}

  @Post('/login')
  async signIn(@Body() userSignInDto: userSignInDto): Promise<any> {
    console.log('Hit /login route with');
    return this.authservice.signIn(userSignInDto);
  }
  @Post('/register')
  async register(@Body() createnewuser: createuserdto): Promise<Plazeruser> {
    console.log('Hit /register route with', createnewuser);

    return this.authservice.register(createnewuser);
  }



  @Get('callback')
  async handleCallback(@Query('token') token: string):Promise<any> {
    console.log('token', token);
    try {
      const decoded = this.jwtService.verify(token, {
        secret: authConstants.secret, // Ensure this matches the main app's secret
      });
      console.log(decoded);
      const { sub, username, ...rest } = decoded;
      const user = {
        id: sub,
        username,
        ...rest,
      };
      // Save or update user data in mini app's database
      const newuser= await this.plazerservise.findOrCreateUser(decoded);

      return newuser.userId;
    } catch (err) {
      console.log(err);
    }
  }
}
