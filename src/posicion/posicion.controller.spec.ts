import { Test, TestingModule } from '@nestjs/testing';
import { PosicionController } from './posicion.controller';
import { PosicionService } from './posicion.service';

describe('PosicionController', () => {
  let controller: PosicionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PosicionController],
      providers: [PosicionService],
    }).compile();

    controller = module.get<PosicionController>(PosicionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
