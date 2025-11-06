import { Test, TestingModule } from '@nestjs/testing';
import { PosicionService } from './posicion.service';

describe('PosicionService', () => {
  let service: PosicionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PosicionService],
    }).compile();

    service = module.get<PosicionService>(PosicionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
