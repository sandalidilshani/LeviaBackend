import { LeaveRequest } from 'src/leaverequest/entities/leaverequest.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Leavetype {
  @PrimaryGeneratedColumn()
  leaveTypeid: number;

  @Column()
  type: string;

  @Column()
  description: string;

  @OneToMany(() => LeaveRequest, (LeaveRequest) => LeaveRequest.leaveTypeid)
  leaverequests: LeaveRequest[];
}
