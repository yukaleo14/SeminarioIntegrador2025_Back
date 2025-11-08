import { Test, TestingModule } from '@nestjs/testing';
import { UbicacionController } from './ubicacion.controller';
import { UbicacionService } from './ubicacion.service';

describe('UbicacionController', () => {
  let controller: UbicacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UbicacionController],
      providers: [UbicacionService],
    }).compile();

    controller = module.get<UbicacionController>(UbicacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
