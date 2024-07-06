import { IsEnum, IsNotEmpty } from 'class-validator';
import { leaveStatus } from 'src/utility/common/leaverequest..leavestatus.enum';

export class UpdateLeaveRequestStatusDto {
 
  @IsEnum(leaveStatus)
  @IsNotEmpty()
  newStatus: leaveStatus;
}