import { Test, TestingModule } from '@nestjs/testing';
import { HorarioController } from './horario.controller';
import { HorarioService } from './horario.service';

describe('HorarioController', () => {
  let controller: HorarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HorarioController],
      providers: [HorarioService],
    }).compile();

    controller = module.get<HorarioController>(HorarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
