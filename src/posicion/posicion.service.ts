import { Injectable } from '@nestjs/common';
import { CreatePosicionDto } from './dto/create-posicion.dto';
import { UpdatePosicionDto } from './dto/update-posicion.dto';

@Injectable()
export class PosicionService {
  create(createPosicionDto: CreatePosicionDto) {
    return 'This action adds a new posicion';
  }

  findAll() {
    return `This action returns all posicion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} posicion`;
  }

  update(id: number, updatePosicionDto: UpdatePosicionDto) {
    return `This action updates a #${id} posicion`;
  }

  remove(id: number) {
    return `This action removes a #${id} posicion`;
  }
}
