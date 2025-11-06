import { Injectable } from '@nestjs/common';
import { CreateCompradorDto } from './dto/create-comprador.dto';
import { UpdateCompradorDto } from './dto/update-comprador.dto';

@Injectable()
export class CompradorService {
  create(createCompradorDto: CreateCompradorDto) {
    return 'This action adds a new comprador';
  }

  findAll() {
    return `This action returns all comprador`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comprador`;
  }

  update(id: number, updateCompradorDto: UpdateCompradorDto) {
    return `This action updates a #${id} comprador`;
  }

  remove(id: number) {
    return `This action removes a #${id} comprador`;
  }
}
