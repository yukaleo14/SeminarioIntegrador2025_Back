import { Test, TestingModule } from '@nestjs/testing';
import { RutaController } from './ruta.controller';
import { RutaService } from './ruta.service';

describe('RutaController', () => {
  let controller: RutaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RutaController],
      providers: [RutaService],
    }).compile();

    controller = module.get<RutaController>(RutaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
