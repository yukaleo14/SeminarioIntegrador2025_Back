import { Injectable } from '@nestjs/common';
import { CreateUbicacionDto } from './dto/create-ubicacion.dto';
import { UpdateUbicacionDto } from './dto/update-ubicacion.dto';

@Injectable()
export class UbicacionService {
  create(createUbicacionDto: CreateUbicacionDto) {
    return 'This action adds a new ubicacion';
  }

  findAll() {
    return `This action returns all ubicacion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ubicacion`;
  }

  update(id: number, updateUbicacionDto: UpdateUbicacionDto) {
    return `This action updates a #${id} ubicacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} ubicacion`;
  }
}
