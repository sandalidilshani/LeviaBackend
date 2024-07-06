import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Leavetype } from 'src/leavetype/entities/leavetype.entity';
import { Plazeruser } from 'src/plazeruser/entities/plazeruser.entity';
import { leaveStatus } from 'src/utility/common/leaverequest..leavestatus.enum';
@Entity()
export class LeaveRequest {
  @PrimaryGeneratedColumn()
  leaveId: number;

  @Column('date')
  leaveStart: Date;

  @Column('date')
  leaveEnd: Date;

  @Column()
  leaveReason: string;

  @Column({
    type: 'enum',
    enum: leaveStatus,
    default: leaveStatus.PENDING,
  })
  leavestatus: leaveStatus;

  @Column('date')
  requestDate: Date;

  @Column('date', { nullable: true })
  approveDate: Date;

  @Column({ nullable: true })
  other: string;

  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => Plazeruser, (userId) => userId.leaverequests)
  userId: Plazeruser;

  @JoinColumn({ name: 'leaveTypeid' })
  @ManyToOne(() => Leavetype, (leaveTypeid) => leaveTypeid.leaverequests)
  leaveTypeid: Leavetype;
}
