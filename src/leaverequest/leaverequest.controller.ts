/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseEnumPipe,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { LeaverequestService } from './leaverequest.service';
import { CreateLeaverequestDto } from './dto/create-leaverequest.dto';
import { UpdateLeaverequestDto } from './dto/update-leaverequest.dto';
import { LeaveRequest } from './entities/leaverequest.entity';
import { leaveStatus } from 'src/utility/common/leaverequest..leavestatus.enum';
import { UpdateLeaveRequestStatusDto } from './dto/update-leaveStatus.dto';
import { Role} from 'src/utility/guard/role.decorator';
@Controller('leaverequest')
export class LeaverequestController {
  constructor(private readonly leaverequestService: LeaverequestService) { }

  //get all user's pending leaves with user details
  @Role('HRManager')
  @Get('/allpendingleaves')
  async getPendingRequest() {
    return this.leaverequestService.getPendingRequests();
  }
//get all Pending Leaves Count for HR
@Role('HRManager')
  @Get('/pendingleavescount')
  async pendingLeavesCount(): Promise<any> {
    return this.leaverequestService.pendingLeavesCount();
  }
  //get all users reject and accept leaves for HR
  @Role('HRManager')
  @Get('/approveandrejectleaves')
  async getRequestsHistory() {
    return this.leaverequestService.getRequestsHistory();
  }

  //get user details by LeaveId
  @Get('usersleavedetails/:leaveId')
  async getUserDetailsByLeaveId(@Param('leaveId') leaveId: number) {
    return this.leaverequestService.getUserDetailsByLeaveId(leaveId);
  }

  //Get Relevent User's  Leave Counts
  @Role('HRManager','User')
@Get('/userpendingleaves/:userId')
async userpendingLeavesCount(@Param('userId', ParseIntPipe) userId: number,
): Promise<number> {
  return this.leaverequestService.userpendingLeavesCount(userId)
}
@Role('HRManager','User')
@Get('/userapprovectleaves/:userId')
async useracceptLeavesCount(@Param('userId', ParseIntPipe) userId: number,
): Promise<number> {
  return this.leaverequestService.userapproveLeavesCount(userId)
}
@Role('HRManager','User')
@Get('/userrejectleaves/:userId')
async userrejectLeavesCount(@Param('userId', ParseIntPipe) userId: number,
): Promise<number> {
  return this.leaverequestService.userrejectLeavesCount(userId)
}

//request Leave by User
@Role('User')  
  @Post('/addleave/:userId')
  async create(@Body() leaverequestDto: CreateLeaverequestDto): Promise<any> {
    try {
      const leaverequest =
        await this.leaverequestService.create(leaverequestDto);
      return { success: true, data: leaverequest };
    } catch (error) {
      return { success: false, message: error.message }; // Return error message to the client
    }
  }

  //get user pending leaves by user id
  @Get('/pendingleaves/:userid')
  async getPendingRequestsbyUser(
    @Param('userid', ParseIntPipe) userid: number,
  ) {
    return this.leaverequestService.getPendingRequestsbyUser(userid);
  }

  //get user approve leaves by user id
  @Get('/approveleaves/:userid')
  async getApproveRequestsbyUser(
    @Param('userid', ParseIntPipe) userid: number,
  ) {
    return this.leaverequestService.getApproveRequestsbyUser(userid);
  }

  //get user reject leaves by user id
  @Get('/rejectleaves/:userid')
  async getRejectRequestsbyUser(
    @Param('userid', ParseIntPipe) userid: number,
  ) {
    return this.leaverequestService.getRejectRequestsbyUser(userid);
  }

  //update Leave request status by HR
  @Put('updateleavestatus/:leaveId')
  async updateleaveStatus(
    @Param('leaveId', ParseIntPipe) leveId: number,
    @Body() updateleavestatusdto: UpdateLeaveRequestStatusDto,
  ) {
    return this.leaverequestService.updateleaveStatus(
      leveId,
      updateleavestatusdto,
    );
  }


  
  
@Role('HRManager')
  @Get(':leaveId')
  async getLeaveDetailsById(
    @Param('leaveId') leaveId: number,
  ): Promise<LeaveRequest> {
    return this.leaverequestService.getLeaveDetailsById(leaveId);
  }

  

  //get pending leave requests
  @Get('status/:leavestatus')
  async getLeaveDetailsByleavestatus(
    @Param('leavestatus', new ParseEnumPipe(leaveStatus))
    leavestatus: leaveStatus,
  ): Promise<LeaveRequest[]> {
    return this.leaverequestService.getLeaveDetailsByleavestatus(leavestatus);
  }

  @Delete(':leaveId')
  async removeleaverequest(@Param('leaveId') leaveId: number): Promise<void> {
    return this.leaverequestService.removeleaverequest(leaveId);
  }

  @Get('pendingleavecount/:userid')
  async getPendingRequestCountbyUser(
    @Param('userid', ParseIntPipe) userid: number,
  ) {
    return this.leaverequestService.getPendingRequestsbyUser(userid);
  }

 
  @Put('leave/:leaveId')
  async update(
    @Param('leaveId', ParseIntPipe) leveId: number,
    @Body() updateleaverequest: UpdateLeaverequestDto,
  ) {
    return this.leaverequestService.update(leveId, updateleaverequest);
  }

  
}
