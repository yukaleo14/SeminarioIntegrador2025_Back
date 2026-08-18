import { Test, TestingModule } from '@nestjs/testing';
import { RepartidorService } from './repartidor.service';

describe('RepartidorService', () => {
  let service: RepartidorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RepartidorService],
    }).compile();

    service = module.get<RepartidorService>(RepartidorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
