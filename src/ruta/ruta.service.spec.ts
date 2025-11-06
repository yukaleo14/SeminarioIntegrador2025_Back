import { Test, TestingModule } from '@nestjs/testing';
import { RutaService } from './ruta.service';

describe('RutaService', () => {
  let service: RutaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RutaService],
    }).compile();

    service = module.get<RutaService>(RutaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
