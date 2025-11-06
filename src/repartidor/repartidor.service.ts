import { Injectable } from '@nestjs/common';
import { CreateRepartidorDto } from './dto/create-repartidor.dto';
import { UpdateRepartidorDto } from './dto/update-repartidor.dto';

@Injectable()
export class RepartidorService {
  create(createRepartidorDto: CreateRepartidorDto) {
    return 'This action adds a new repartidor';
  }

  findAll() {
    return `This action returns all repartidor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} repartidor`;
  }

  update(id: number, updateRepartidorDto: UpdateRepartidorDto) {
    return `This action updates a #${id} repartidor`;
  }

  remove(id: number) {
    return `This action removes a #${id} repartidor`;
  }
}
