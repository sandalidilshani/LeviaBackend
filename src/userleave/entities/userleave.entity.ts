import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

import { Plazeruser } from 'src/plazeruser/entities/plazeruser.entity';
@Entity()
export class UserLeave {
  @PrimaryGeneratedColumn()
  userLeaveId: number;

  @Column({ nullable: false })
  totalLeaves: number;

  @Column({ default: 0, nullable: false }) // Or nullable: false if you handle it in the service
  availableLeaves: number;

  @Column({ type: 'date', nullable: true }) // Adding validity period end date
  leavesValidUntil: Date;

  @OneToOne(() => Plazeruser, (plazeruser) => plazeruser.userId,{ nullable: true})
  @JoinColumn({ name: 'plazeruser' })
  plazeruser: Plazeruser;



}
