/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlazeruserDto } from './dto/create-plazeruser.dto';
import { createuserdto } from './dto/create-newuser.dto';
import { UpdatePlazeruserDto } from './dto/update-plazeruser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Plazeruser } from './entities/plazeruser.entity';
import { Repository } from 'typeorm';
import { log } from 'console';
import { UserLeave } from 'src/userleave/entities/userleave.entity';
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
  async createnewuser(createuserdto: createuserdto): Promise<Plazeruser> {
    const user = new Plazeruser();
    user.userName = createuserdto.userName;
    user.userPassword = createuserdto.userPassword;
    user.userFName = createuserdto.userFName;
    user.userLName = createuserdto.userLName;
    user.AddressL1 = createuserdto.AddressL1;
    user.AddressL2 = createuserdto.AddressL2;
    user.AddressL3 = createuserdto.AddressL3;
    user.Email = createuserdto.Email;
    user.gender = createuserdto.gender;
    user.skills = createuserdto.skills;
    user.DoB = new Date(createuserdto.DoB);
    user.phone = createuserdto.phone;
    user.role = createuserdto.role;
    user.image = createuserdto.image;
    user.gitlink = createuserdto.gitlink;
    user.active = true;
    return await this.plazeuserRepositary.save(user);
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

  async update(userId: number,updatePlazeruserDto: UpdatePlazeruserDto, ): Promise<any> {
    console.log('this is update func')
    const user = await this.plazeuserRepositary.findOne({
      where: { userId: userId },
    });

console.log('update',user)
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    console.log(user)
    console.log(updatePlazeruserDto)
    // Merging the new data with the existing user data
    const updatedUser = this.plazeuserRepositary.update(user.userId, updatePlazeruserDto);

    // Saving the updated user


    return updatedUser;
  }

  async findOrCreateUser(userPayload: any): Promise<Plazeruser> {
    console.log(userPayload.username);
    //plazeuserRepositary.findOne({ where: { userId } })
    const existingUser = await this.plazeuserRepositary.findOne({ where: { userName: userPayload.username } });
    console.log('userfound', existingUser);

    if (!existingUser) {
      console.log('time to add new user')
        const CreateplazeruserDto: CreatePlazeruserDto = {
            userName: userPayload.username,
            userFName: userPayload.fristname,
            userLName: userPayload.lastname,
            AddressL1: userPayload.addressL1,
            AddressL2: userPayload.addressL2,
            AddressL3: userPayload.addressL3,
            Email: userPayload.email,
            gender: userPayload.gender,
            skills: userPayload.skills,
            DoB: new Date(userPayload.DoB),
            phone: userPayload.phone,
            role: userPayload.roles[0],
            image: userPayload.image,
            gitlink: userPayload.gitlink,
        };

        const newUser = this.plazeuserRepositary.create(CreateplazeruserDto);
        await this.plazeuserRepositary.save(newUser);
        return newUser;
    } else {
        console.log('updateneed');

        existingUser.userFName = userPayload.fristname;
        existingUser.userLName = userPayload.lastname;
        existingUser.AddressL1 = userPayload.addressL1;
        existingUser.AddressL2 = userPayload.addressL2;
        existingUser.AddressL3 = userPayload.addressL3;
        existingUser.Email = userPayload.email;
        existingUser.gender = userPayload.gender;
        existingUser.skills = userPayload.skills;
        existingUser.DoB = new Date(userPayload.DoB);
        existingUser.phone = userPayload.phone;
        existingUser.role = userPayload.roles[0];
        existingUser.image = userPayload.image;
        existingUser.gitlink = userPayload.gitlink;

        await this.plazeuserRepositary.save(existingUser);
        return existingUser;
    }
}
 async findPlazerusersWithoutUserLeave():Promise<Plazeruser[]>{
  return await this.plazeuserRepositary
      .createQueryBuilder('plazeruser')
      .leftJoin(UserLeave, 'userLeave', 'userLeave.plazeruser = plazeruser.userId')
      .where('userLeave.userLeaveId IS NULL')
      .getMany();
 }
}


