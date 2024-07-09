/* eslint-disable prettier/prettier */

import { LeaveRequest } from 'src/leaverequest/entities/leaverequest.entity';
import { UserLeave } from 'src/userleave/entities/userleave.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'plazer-user' })
export class Plazeruser {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ unique: true, nullable: false })
  userName: string;

  @Column({ nullable: true, select: true  })
  userPassword: string;

  @Column({ nullable: false, name: 'FirstName' })
  userFName: string;

  @Column({ nullable: false, name: 'LastName' })
  userLName: string;

  @Column({ nullable: false })
  AddressL1: string;

  @Column({ nullable: false })
  AddressL2: string;

  @Column({ nullable: true })
  AddressL3: string;

  @Column({ nullable: false, unique: true })
  Email: string;

  @Column({
    type: 'enum',
    enum: ['male', 'female', 'unspecified'],
    nullable: false,
  })
  gender: string;

  @Column({ nullable: true })
  skills: string;

  @Column({ nullable: true })
  DoB: Date;

  @Column({ nullable: false })
  phone: string;

  @Column({
    type: 'enum',
    enum: ['Member', 'Organization Admin', 'HRManager'],
    nullable: false,
  })
  role: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  gitlink: string;

  @Column({ nullable: true })
  active: boolean;

  @OneToMany(() => LeaveRequest, (leaverequest) => leaverequest.userId)
  leaverequests: LeaveRequest[];

}
