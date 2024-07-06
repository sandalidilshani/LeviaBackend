import { Injectable } from '@nestjs/common';
import { CreateLeavetypeDto } from './dto/create-leavetype.dto';
import { UpdateLeavetypeDto } from './dto/update-leavetype.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Leavetype } from './entities/leavetype.entity';
import { Repository } from 'typeorm';

@Injectable()

export class LeavetypeService {

  constructor(
    @InjectRepository(Leavetype)
    private leavetypeRepository:Repository<Leavetype>
  ){}


  async create(createLeavetypeDto: CreateLeavetypeDto): Promise<Leavetype> {
    const { type } = createLeavetypeDto;

    // Check if a record with the same 'type' already exists
    const existingRecord = await this.leavetypeRepository.findOne({ where: { type } });

    if (existingRecord) {
      // Handle the case where the record already exists
      console.log(`Record with type "${type}" already exists!`);
      return existingRecord;
    }

    const newLeavetype = new Leavetype();
    newLeavetype.type = type;
    return await this.leavetypeRepository.save(newLeavetype);
  }

  async findAll():Promise<Leavetype[]> {
    return this.leavetypeRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} leavetype`;
  }

  update(id: number, updateLeavetypeDto: UpdateLeavetypeDto) {
    return `This action updates a #${id} leavetype`;
  }

  remove(id: number) {
    return `This action removes a #${id} leavetype`;
  }

  async leavetypecount() {
    try {
      const count = await this.leavetypeRepository
        .createQueryBuilder('Leavetype')
        .getCount();
      
      return count;
    } catch (error) {
      // Handle any errors (e.g., log them, throw custom errors, etc.)
      console.error('Error fetching leave type count:', error);
      throw error; // Rethrow or handle as appropriate for your application
    }
  }
  
}
