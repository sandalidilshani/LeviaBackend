import { PartialType } from '@nestjs/mapped-types';
import { CreateLeavetypeDto } from './create-leavetype.dto';

export class UpdateLeavetypeDto extends PartialType(CreateLeavetypeDto) {}
