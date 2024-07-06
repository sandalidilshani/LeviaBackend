import { PartialType } from '@nestjs/mapped-types';
import { CreateUserleaveDto } from './create-userleave.dto';

export class UpdateUserleaveDto extends PartialType(CreateUserleaveDto) {}
