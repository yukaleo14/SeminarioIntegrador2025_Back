import { Test, TestingModule } from '@nestjs/testing';
import { CompradorService } from './comprador.service';

describe('CompradorService', () => {
  let service: CompradorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompradorService],
    }).compile();

    service = module.get<CompradorService>(CompradorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
