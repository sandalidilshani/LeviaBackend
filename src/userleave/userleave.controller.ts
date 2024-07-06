import { Controller, Get, Post, Body,Put, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UserleaveService } from './userleave.service';
import { CreateUserleaveDto } from './dto/create-userleave.dto';
import { UpdateUserleaveDto } from './dto/update-userleave.dto';

@Controller('userleave')
export class UserleaveController {
  constructor(private readonly userleaveService: UserleaveService) {}

  @Post('/adduserLeaves/:userId')
  async adduserLeaves(@Param('userId') userId: number, @Body() CreateUserleaveDto: CreateUserleaveDto) {
    return await this.userleaveService.adduserLeaves( userId, CreateUserleaveDto);
  }

  @Put('/updateuserLeaves/:userId')
  async updateuserLeaves(@Param('userId') userId: number, @Body() UpdateUserleaveDto: UpdateUserleaveDto) {
    return await this.userleaveService.updateuserLeaves(userId, UpdateUserleaveDto);
  }
  
  @Get('/userleavecount/:userId')
  async getUserLeavesCount(@Param('userId') userId: number) {
    return await this.userleaveService.getUserLeavesCount(userId);
  }

  @Get()
  findAll() {
    return this.userleaveService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userleaveService.findOne(id);
  }

  
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserleaveDto: UpdateUserleaveDto) {
    return this.userleaveService.update(id, updateUserleaveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userleaveService.remove(id);
  }
  
}
