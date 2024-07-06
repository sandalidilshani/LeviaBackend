import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { LeavetypeService } from './leavetype.service';
import { CreateLeavetypeDto } from './dto/create-leavetype.dto';
import { UpdateLeavetypeDto } from './dto/update-leavetype.dto';
import { Leavetype } from './entities/leavetype.entity';
import { Role } from 'src/utility/guard/role.decorator';

@Controller('leavetype')
export class LeavetypeController {
  constructor(private readonly leavetypeService: LeavetypeService) {}

  @Post('/addtype')
  create(@Body() 
  createLeavetypeDto: CreateLeavetypeDto):Promise<Leavetype> {
    return this.leavetypeService.create(createLeavetypeDto);
  }

  @Get('/alltypes')
  findAll() {
    return this.leavetypeService.findAll();
  }
  @Role('HRManager')
  @Get('/count')
  async getLeaveTypeCount(): Promise<number> {
    try {
      const count = await this.leavetypeService.leavetypecount();
      console.log(`Total leave types: ${count}`);
      return count;
    } catch (error) {
      console.log('Failed to fetch leave type count', error);
      throw error;
    }
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leavetypeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeavetypeDto: UpdateLeavetypeDto) {
    return this.leavetypeService.update(+id, updateLeavetypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leavetypeService.remove(+id);
  }
  
  
}
