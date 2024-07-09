/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlazeruserDto } from './dto/create-plazeruser.dto';
import { UpdatePlazeruserDto } from './dto/update-plazeruser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Plazeruser } from './entities/plazeruser.entity';
import { Repository } from 'typeorm';
import { log } from 'console';
@Injectable()
export class PlazeruserService {
  constructor(
    @InjectRepository(Plazeruser)
    private plazeuserRepositary: Repository<Plazeruser>,
  ) { }

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

  async update(updatePlazeruserDto: UpdatePlazeruserDto, userId: number): Promise<any> {
    const user = await this.plazeuserRepositary.findOne({
      where: { userId: userId },
    });


    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    console.log(user)
    console.log(updatePlazeruserDto)
    // Merging the new data with the existing user data
    const updatedUser = this.plazeuserRepositary.merge(user, updatePlazeruserDto);

    // Saving the updated user
    await this.plazeuserRepositary.save(updatedUser);


    return updatedUser;
  }

  async findorcreateUser(userPayload:Partial<Plazeruser>):Promise<Plazeruser>{
    let user=await this.plazeuserRepositary.findOne({where:{userId:userPayload.userId}})
    console.log(user)
    if(!user){
      const createPlazeruserDto: CreatePlazeruserDto = {
        userName: userPayload.userName,
        userFName: userPayload.userFName,
        userLName: userPayload.userLName,
        AddressL1: userPayload.AddressL1,
        AddressL2: userPayload.AddressL2,
        AddressL3: userPayload.AddressL3,
        Email: userPayload.Email,
        gender: userPayload.gender,
        skills: userPayload.skills,
        DoB: new Date (userPayload.DoB),
        phone: userPayload.phone,
        role: userPayload.role,
        image: userPayload.image,
        gitlink: userPayload.gitlink,
      };    
      const user= this.plazeuserRepositary.create(createPlazeruserDto)
    }
    else{
      user.userName = userPayload.userName;
      user.userPassword = userPayload.userPassword;
      user.userFName = userPayload.userFName;
      user.userLName = userPayload.userLName;
      user.AddressL1 = userPayload.AddressL1;
      user.AddressL2 = userPayload.AddressL2;
      user.AddressL3 = userPayload.AddressL3;
      user.Email = userPayload.Email;
      user.gender = userPayload.gender;
      user.skills = userPayload.skills;
      user.DoB = userPayload.DoB;
      user.phone = userPayload.phone;
      user.role = userPayload.role;
      user.image = userPayload.image;
      user.gitlink = userPayload.gitlink;
      await this.plazeuserRepositary.update(user.userId, user);

    }
    return user;

  }

}
