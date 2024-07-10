/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  
  Req,
  
} from '@nestjs/common';
import { PlazeruserService } from './plazeruser.service';
import { CreatePlazeruserDto } from './dto/create-plazeruser.dto';
import { Role } from 'src/utility/guard/role.decorator';
@Controller('plazeruser')
export class PlazeruserController {
  constructor(private readonly plazeruserService: PlazeruserService) {}

  @Post()
  create(@Body() createPlazeruserDto: CreatePlazeruserDto) {
    return this.plazeruserService.create(createPlazeruserDto);
  }


  


  @Role('HRManager')
  @Get()
  findAll() {
    return this.plazeruserService.findAll();
  }
  
  @Get('/roles/:userId')
  async getuserroles(@Param('userId') userId: number) {
    console.log(userId);
    return this.plazeruserService.getuserroleById(userId);
  }




  @Get('/userdetails/:username')
  findOne(@Param('username') username: string) {
    return this.plazeruserService.findUserByUserName(username);
  }

  @Delete(':id')
  remove() {
    //return this.plazeruserService.remove();
  }

  @Get('/leaves/:userid')
  async getUserLeaveRequest(@Param('userid', ParseIntPipe) userid: number) {
    return this.plazeruserService.getUserLeaveRequest(userid);
  }

  @Get('/pendingleaves/:userid')
  async getPendingRequests(@Param('userid', ParseIntPipe) userid: number) {
    return this.plazeruserService.getPendingRequestsbyHR(userid);
  }


@Role('HRManager','User')
  @Get('/userdetailsbyuserid/:userId')
 async findUserOne(@Param('userId') userId: number) {
   console.log(userId)
    return this.plazeruserService.findOneByUserId(userId);
  }
  //get users count
  @Role('HRManager')
  @Get('/usercount')
  usercount(){
    return this.plazeruserService.usercount()
  }

  //get user details and leave details by leave id 
  @Get('/getleavedetails/:leaveId')
  async getUserDetailsByLeaveId(@Param('leaveId',ParseIntPipe)leaveId:number){
    console.log(leaveId)
    return this.plazeruserService.getUserDetailsByLeaveId(leaveId)

  }

  

  
  
}
