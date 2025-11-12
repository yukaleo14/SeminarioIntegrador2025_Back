import { Test, TestingModule } from '@nestjs/testing';
import { RepartidorController } from './repartidor.controller';
import { RepartidorService } from './repartidor.service';

describe('RepartidorController', () => {
  let controller: RepartidorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepartidorController],
      providers: [RepartidorService],
    }).compile();

    controller = module.get<RepartidorController>(RepartidorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
