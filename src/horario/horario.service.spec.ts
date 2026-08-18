import { Test, TestingModule } from '@nestjs/testing';
import { HorarioService } from './horario.service';

describe('HorarioService', () => {
  let service: HorarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HorarioService],
    }).compile();

    service = module.get<HorarioService>(HorarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
