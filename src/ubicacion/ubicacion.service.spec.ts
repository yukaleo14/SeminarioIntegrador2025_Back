import { Test, TestingModule } from '@nestjs/testing';
import { UbicacionService } from './ubicacion.service';

describe('UbicacionService', () => {
  let service: UbicacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UbicacionService],
    }).compile();

    service = module.get<UbicacionService>(UbicacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
