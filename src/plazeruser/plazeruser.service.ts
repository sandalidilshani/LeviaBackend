/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { CreatePlazeruserDto } from './dto/create-plazeruser.dto';
import {} from './dto/update-plazeruser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Plazeruser } from './entities/plazeruser.entity';
import { Repository } from 'typeorm';
@Injectable()
export class PlazeruserService {
  constructor(
    @InjectRepository(Plazeruser)
    private plazeuserRepositary: Repository<Plazeruser>,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(PlazeruserDto: CreatePlazeruserDto): Promise<Plazeruser> {
    const plazeuser = new Plazeruser();
    return await this.plazeuserRepositary.save(plazeuser);
  }

  //get all users
  findAll(): Promise<Plazeruser[]> {
    return this.plazeuserRepositary.find();
  }
  //get user count
  async usercount() {
    const count = await this.plazeuserRepositary
      .createQueryBuilder('plazeruser')
      .getCount();

    return count;
  }

  //find user by userId
  async findOneByUserId(userId: number): Promise<Plazeruser | null> {
    const user = await this.plazeuserRepositary.findOne({ where: { userId } });
    
    return user;
  }
  

  remove(id: number) {
    // return await this.plazeuserRepositary.;
  }

  async findUserByUserName(userName: string) {
    return await this.plazeuserRepositary.findOneBy({ userName });
  }

  async getuserroleById(userId: number) {
    const user = await this.plazeuserRepositary
      .createQueryBuilder('plazeruser')
      .select('plazeruser.role')
      .where('plazeruser.userId = :userId', { userId: userId })
      .getOne();
  }

  //get relevant user leaves by userid.
  async getUserLeaveRequest(userId: number) {
    const plazeruser = await this.plazeuserRepositary.findOne({
      where: { userId },
      relations: ['leaverequests'],
    });
  }

  //get relevent user pending leaves by userid with user details .
  async getPendingRequestsbyHR(userId: number) {
    try {
      const user = await this.plazeuserRepositary
        .createQueryBuilder('plazeruser')
        .select(['plazeruser', 'leaverequest'])
        .leftJoin(
          'plazeruser.leaverequests',
          'leaverequest',
          'leaverequest.leavestatus=:leavestatus',
          {
            leavestatus: '{pending}',
          },
        )

        .where('plazeruser.userId = :userId', { userId: userId })
        .getOne();

      return user;
    } catch (error) {
      console.error('Error in getPendingRequests:', error);
      return null;
    }
  }
  //get userdetails by leaveid
  async getUserDetailsByLeaveId(leaveId: number) {
    try {
      const user = await this.plazeuserRepositary
        .createQueryBuilder('plazeruser')
        .select(['plazeruser'])
        .leftJoin('plazeruser.leaverequests', 'leaverequest')

        .where('leaverequest.leaveId = :leaveId', { leaveId: leaveId })
        .getOne();

      return user;
    } catch (error) {
      console.error('Error in getPendingRequests:', error);
      return null;
    }
  }

  
}
