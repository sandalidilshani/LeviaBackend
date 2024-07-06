import { Injectable } from '@nestjs/common';
import { CreateUserleaveDto } from  './dto/create-userleave.dto';
import { UpdateUserleaveDto } from './dto/update-userleave.dto';
import { UserLeave } from './entities/userleave.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlazeruserService } from 'src/plazeruser/plazeruser.service';
import { Plazeruser } from 'src/plazeruser/entities/plazeruser.entity';

@Injectable()
export class UserleaveService {
  constructor(
    @InjectRepository(UserLeave)
    private userLeaverepo: Repository<UserLeave>,
    private plazeruserservice: PlazeruserService,
  ) {}

  async adduserLeaves(userId: number, createUserleaveDto: CreateUserleaveDto): Promise<UserLeave> {
    try {
      // Check if a UserLeave entry already exists for the given user
      const existingUserLeave = await this.userLeaverepo.findOne({
        where: { plazeruser: { userId: userId } },
      });

      if (existingUserLeave) {
        this.updateuserLeaves(userId, createUserleaveDto);
        return existingUserLeave;
      }

      const userLeave = new UserLeave();
      userLeave.plazeruser=await this.plazeruserservice.findOneByUserId(userId);
      userLeave.totalLeaves = createUserleaveDto.totalLeaves;
      userLeave.availableLeaves = createUserleaveDto.totalLeaves;
      userLeave.leavesValidUntil = createUserleaveDto.leavesValidUntil;

      const user = await this.plazeruserservice.findOneByUserId(userId);

      if (!user) {
        throw new Error(`Plazeruser with ID ${userId} not found.`);
      }

      userLeave.plazeruser = user;

      return await this.userLeaverepo.save(userLeave);
    } catch (error) {
      console.error('Error adding user leaves:', error);
      throw error;
    }
  }


  async updateuserLeaves(userId: number, updateUserleaveDto: UpdateUserleaveDto): Promise<UserLeave> {
    try {
      const userLeave = await this.userLeaverepo.findOne({
        where: { plazeruser: { userId: userId } },
      });

      if (!userLeave) {
        throw new Error(`UserLeave not found for Plazeruser with ID ${userId}`);
      }

      userLeave.totalLeaves = updateUserleaveDto.totalLeaves;
      userLeave.availableLeaves = updateUserleaveDto.totalLeaves;
      userLeave.leavesValidUntil = updateUserleaveDto.leavesValidUntil;

      const user = await this.plazeruserservice.findOneByUserId(userId);

      if (!user) {
        throw new Error(`Plazeruser with ID ${userId} not found.`);
      }

      userLeave.plazeruser = user;

      return await this.userLeaverepo.save(userLeave);
    } catch (error) {
      console.error('Error updating user leaves:', error);
      throw error;
    }
  }


  async getUserLeavesCount(userId: number): Promise<any> {
    try {
      const userLeaves = await this.userLeaverepo.findOne({
        where: { plazeruser: { userId: userId } },
        relations: ['plazeruser'],
      });

      if (userLeaves) {
        return userLeaves;
      } else {
        return { totalLeaves: 0, availableLeaves: 0, leavesValidUntil: 'still not added' };
      }
    } catch (error) {
      console.error('Error fetching user leave count:', error);
      throw new Error('Could not fetch user leave count');
    }
  }

  
  findAll() {
    return `This action returns all userleave`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userleave`;
  }

  update(id: number, updateUserleaveDto: UpdateUserleaveDto) {
    return `This action updates a #${id} userleave`;
  }

  remove(id: number) {
    return `This action removes a #${id} userleave`;
  }
}