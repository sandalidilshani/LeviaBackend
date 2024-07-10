/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLeaverequestDto } from './dto/create-leaverequest.dto';
import { UpdateLeaverequestDto } from './dto/update-leaverequest.dto';
import { LeaveRequest } from './entities/leaverequest.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, In, Like, Repository, UpdateResult } from 'typeorm';
import { Leavetype } from 'src/leavetype/entities/leavetype.entity';
import { Plazeruser } from 'src/plazeruser/entities/plazeruser.entity';
import { leaveStatus } from 'src/utility/common/leaverequest..leavestatus.enum';
import { error } from 'console';
import { UpdateLeaveRequestStatusDto } from './dto/update-leaveStatus.dto';
import { UserLeave } from 'src/userleave/entities/userleave.entity';
@Injectable()
export class LeaverequestService {
  constructor(
    @InjectRepository(LeaveRequest)
    private leaverequestRepository: Repository<LeaveRequest>,

    @InjectRepository(Leavetype)
    private leavetypeRepo: Repository<Leavetype>,

    @InjectRepository(Plazeruser)
    private plazeruserRepo: Repository<Plazeruser>,

    @InjectRepository(UserLeave)
    private userleaveRepo: Repository<UserLeave>
  ) { }




  //get all user's pending leaves with user details
  async getPendingRequests() {
    const pendingRequests = await this.leaverequestRepository
      .createQueryBuilder('leaverequest')
      .innerJoinAndSelect('leaverequest.userId', 'plazeruser')
      .where('leaverequest.leavestatus = :status', { status: 'pending' })
      .select([
        'plazeruser',
        'plazeruser.userFName',
        'plazeruser.userLName',
        'leaverequest.leaveId',
        'leaverequest.leaveStart',
        'leaverequest.leaveEnd',
        'leaverequest.leaveReason',
        'leaverequest.requestDate',
      ])
      .getMany();

    if (pendingRequests.length === 0) {
      return 'No pending requests';
    }

    return pendingRequests;
  }

  //get all Pending Leaves Count for HR
  async pendingLeavesCount() {
    const count = await this.leaverequestRepository
      .createQueryBuilder('leaverequest')
      .where('leaverequest.leavestatus = :status', { status: 'pending' })
      .getCount();

    return count;
  }

  async findAll(): Promise<LeaveRequest[]> {
    return this.leaverequestRepository.find();
  }

  //get all users reject and accept leaves for HR
  async getRequestsHistory() {
    const acceptedAndRejectedRequests = await this.leaverequestRepository
      .createQueryBuilder('leaverequest')
      .innerJoinAndSelect('leaverequest.userId', 'plazeruser')
      .where('leaverequest.leavestatus IN (:...statuses)', { statuses: [leaveStatus.APPROVE, leaveStatus.REJECT] })
      .select([
        'plazeruser.userId',
        'plazeruser.userFName',
        'plazeruser.userLName',
        'leaverequest.leaveId',
        'leaverequest.leaveStart',
        'leaverequest.leaveEnd',
        'leaverequest.leaveReason',
        'leaverequest.leavestatus',
        'leaverequest.requestDate',
        'leaverequest.approveDate'
      ])
      .getMany();

    if (acceptedAndRejectedRequests.length === 0) {
      return 'No accepted or rejected requests';
    }

    return acceptedAndRejectedRequests;
  }



  //get request details by Leaveid
  async getLeaveDetailsById(leaveId: number) {
    return await this.leaverequestRepository.findOne({
      where: { leaveId },
      relations: ['leaveTypeid', 'userId']
    });
  }


  //get user details  by LeaveId
  async getUserDetailsByLeaveId(leaveId) {
    const userDetails = await this.leaverequestRepository
      .createQueryBuilder('leaverequest')
      .leftJoinAndSelect('leaverequest.plazeruserid', 'plazeruser')
      .where('leaverequest.leaveId = :leaveId', { leaveId })
      .select([
        'plazeruser.username',
        'plazeruser.ufname',
        'plazeruser.ulname',
        'plazeruser.addressl1',
        'plazeruser.addressl2',
        'plazeruser.addressl3',
        'plazeruser.role',
      ])
      .getRawOne();

    return userDetails;
  }

  //Get Relevent User Pending Leave Counts
  async userpendingLeavesCount(userId: number) {
    const count = await this.leaverequestRepository
      .createQueryBuilder('leaverequest')
      .where('leaverequest.userId = :userId', { userId })
      .andWhere('leaverequest.leavestatus=:status', { status: 'pending' })
      .getCount();

    return count;
  }
  async userapproveLeavesCount(userId: number) {
    const count = await this.leaverequestRepository
      .createQueryBuilder('leaverequest')
      .where('leaverequest.userId = :userId', { userId })
      .andWhere('leaverequest.leavestatus=:status', { status: 'approve' })
      .getCount();

    return count;
  }
  async userrejectLeavesCount(userId: number) {
    const count = await this.leaverequestRepository
      .createQueryBuilder('leaverequest')
      .where('leaverequest.userId = :userId', { userId })
      .andWhere('leaverequest.leavestatus=:status', { status: 'reject' })
      .getCount();

    return count;
  }

  //request Leave by User  
  async create(
    createLeaverequestDto: CreateLeaverequestDto,
  ): Promise<LeaveRequest> {
    const leaverequest = new LeaveRequest();
    leaverequest.leaveStart = new Date(createLeaverequestDto.leaveStart);
    leaverequest.leaveEnd = new Date(createLeaverequestDto.leaveEnd);
    //check available leaves
    const leaveDays = this.calculateLeaveDays(leaverequest.leaveStart, leaverequest.leaveEnd);

    const userLeave = await this.userleaveRepo.findOne({
      where: { plazeruser: { userId: createLeaverequestDto.userId } },
    });
    if (!userLeave) {
      throw new Error('User leave record not found');
    }

    if (userLeave.availableLeaves < leaveDays) {
      throw new Error('Not enough available leaves');
    }
    if (userLeave.leavesValidUntil > leaverequest.leaveStart && userLeave.leavesValidUntil > leaverequest.leaveEnd) {
      throw new Error('your request period is Not Valid')
    }

    leaverequest.leaveReason = createLeaverequestDto.leaveReason;
    leaverequest.requestDate = createLeaverequestDto.requestDate;
    const leavetype = await this.leavetypeRepo.findOneById(
      +createLeaverequestDto.leaveType,
    );
    leaverequest.leaveTypeid = leavetype;

    const plazeruser = await this.plazeruserRepo.findOneById(
      createLeaverequestDto.userId,
    );
    leaverequest.userId = plazeruser;

    try {
      return await this.leaverequestRepository.save(leaverequest);
    } catch (err) {
      console.log(error);
    }
    async function calculateLeaveDays(startDate: Date, endDate: Date): Promise<number> {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return daysDiff;
    }
  }

  //get user pending leaves by user id
  async getPendingRequestsbyUser(userId: number) {
    try {
      const pendingRequests = await this.leaverequestRepository
        .createQueryBuilder('leaverequest')
        .innerJoinAndSelect('leaverequest.leaveTypeid', 'Leavetype')
        .where('leaverequest.userId = :userId', { userId })
        .andWhere('leaverequest.leavestatus = :status', { status: 'pending' })
        .select([
          'leaverequest.leaveId',
          'leaverequest.leaveStart',
          'leaverequest.leaveEnd',
          'leaverequest.leaveReason',
          'leaverequest.requestDate',
          'Leavetype'
        ])
        .getMany();

      if (pendingRequests.length === 0) {
        return 'No Pending request';
      }
      return pendingRequests;
    } catch (error) {
      console.error('Error in getPendingRequests:', error);
      return null;
    }
  }

  //get user approve leaves by user id
  async getApproveRequestsbyUser(userId: number) {
    try {
      const pendingRequests = await this.leaverequestRepository
        .createQueryBuilder('leaverequest')
        .innerJoinAndSelect('leaverequest.leaveTypeid', 'Leavetype')
        .where('leaverequest.userId = :userId', { userId })
        .andWhere('leaverequest.leavestatus = :status', { status: 'approve' })
        .select([
          'leaverequest.leaveId',
          'leaverequest.leaveStart',
          'leaverequest.leaveEnd',
          'leaverequest.leaveReason',
          'leaverequest.requestDate',
          'Leavetype'
        ])
        .getMany();

      if (pendingRequests.length === 0) {
        return 'No Pending request';
      }
      return pendingRequests;
    } catch (error) {
      console.error('Error in getPendingRequests:', error);
      return null;
    }
  }

  //get user reject leaves by user id
  async getRejectRequestsbyUser(userId: number) {
    try {
      const pendingRequests = await this.leaverequestRepository
        .createQueryBuilder('leaverequest')
        .innerJoinAndSelect('leaverequest.leaveTypeid', 'Leavetype')
        .where('leaverequest.userId = :userId', { userId })
        .andWhere('leaverequest.leavestatus = :status', { status: 'reject' })
        .select([
          'leaverequest.leaveId',
          'leaverequest.leaveStart',
          'leaverequest.leaveEnd',
          'leaverequest.leaveReason',
          'leaverequest.requestDate',
          'Leavetype'
        ])
        .getMany();

      if (pendingRequests.length === 0) {
        return 'No Pending request';
      }
      return pendingRequests;
    } catch (error) {
      console.error('Error in getPendingRequests:', error);
      return null;
    }
  }

  //update Leave request status by HR
  async updateleaveStatus(
    leaveId: number,
    updateleaverequeststatus: UpdateLeaveRequestStatusDto,
  ): Promise<UpdateResult> {
    try {
      const leaveRequest = await this.leaverequestRepository.findOne({
        where: { leaveId },
        relations: ['userId'],
      });

      if (!leaveRequest) {
        throw new HttpException('Leave request not found', HttpStatus.NOT_FOUND);
      }

      const updateData: Partial<LeaveRequest> = {
        leavestatus: updateleaverequeststatus.newStatus,
      };

      // If the new status is APPROVED, update approveDate and user's leave count
      if (updateleaverequeststatus.newStatus === leaveStatus.APPROVE) {
        updateData.approveDate = new Date();

        // Calculate leave days
        const leaveDays = this.calculateLeaveDays(leaveRequest.leaveStart, leaveRequest.leaveEnd);

        // Fetch and update user's leave record
        const userLeave = await this.userleaveRepo.findOne({
          where: { plazeruser: { userId: leaveRequest.userId.userId } },
        });

        if (!userLeave) {
          throw new HttpException('User leave record not found', HttpStatus.NOT_FOUND);
        }

        if (userLeave.availableLeaves < leaveDays) {
          throw new HttpException('Not enough available leaves', HttpStatus.BAD_REQUEST);
        }

        userLeave.availableLeaves -= leaveDays;
        await this.userleaveRepo.save(userLeave);
      }

      // Update the leave request
      const result = await this.leaverequestRepository.update(leaveId, updateData);

      if (result.affected === 0) {
        throw new HttpException('Update failed: leave ID not found', HttpStatus.NOT_FOUND);
      }

      return result;
    } catch (error) {
      console.error('Error in updateleaveStatus:', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private calculateLeaveDays(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((end.getTime() - start.getTime()) / oneDay));
    return diffDays;
  }
  //get leave requests by leave type
  async getLeaveDetailsByleaveTypeid(
    leaveType: number,
  ): Promise<LeaveRequest[]> {
    return await this.leaverequestRepository.find({
      where: {
        leaveTypeid: {
          leaveTypeid: leaveType,
        },
      },
      relations: ['leaveType'],
    });
  }

  // request leaves by leave status
  async getLeaveDetailsByleavestatus(
    leavestatus: leaveStatus,
  ): Promise<LeaveRequest[]> {
    return await this.leaverequestRepository.find({
      where: { leavestatus: In[leavestatus] },
    });
  }

  //remove leave request
  async removeleaverequest(leaveId: number): Promise<void> {
    await this.leaverequestRepository.delete(leaveId);
  }






  //update pending Request
  async update(
    leaveId: number,
    updateleaverequestdto: UpdateLeaverequestDto,
  ): Promise<UpdateResult> {
    try {
      const updateData: Partial<LeaveRequest> = {
        leaveStart: new Date(updateleaverequestdto.leaveStart),
        leaveEnd: new Date(updateleaverequestdto.leaveEnd),
        leaveReason: updateleaverequestdto.leaveReason,
        requestDate: new Date(updateleaverequestdto.requestDate),
      };
      return this.leaverequestRepository.update(leaveId, updateData);
    } catch (error) {
      console.error('Error in getPendingRequests:', error);
      return null;
    }
  }



  //GET RELEVENT USER PENDING lEAVES.
  async getUserPendingLeaves() {
    const pendingRequests = await this.leaverequestRepository
      .createQueryBuilder('leaverequest')
      .innerJoinAndSelect('leaverequest.userId', 'plazeruser')
      .where('leaverequest.leavestatus = :status', { status: 'pending' })
      .select([
        'plazeruser',
        'plazeruser.userFName',
        'plazeruser.userLName',
        'leaverequest.leaveId',
        'leaverequest.leaveStart',
        'leaverequest.leaveEnd',
        'leaverequest.leaveReason',
        'leaverequest.requestDate',
      ])
      .getMany();

    if (pendingRequests.length === 0) {
      return 'No pending requests';
    }

    return pendingRequests;
  }

}

