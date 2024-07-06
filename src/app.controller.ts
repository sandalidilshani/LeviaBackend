import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { GetCurrentUserByUsername } from './utility/middleware';
import { Role } from './utility/guard/role.decorator';
import { RoleGuard } from './utility/guard/role.guard';
@Controller()
export class AppController {
  constructor(
    private appservice:AppService
  ){

  }


@Get()
getHello(@GetCurrentUserByUsername() username:string):string{
  console.log(username)
  return this.appservice.getHello()
}


}
