import { Test, TestingModule } from '@nestjs/testing';
import { CompradorController } from './comprador.controller';
import { CompradorService } from './comprador.service';

describe('CompradorController', () => {
  let controller: CompradorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompradorController],
      providers: [CompradorService],
    }).compile();

    controller = module.get<CompradorController>(CompradorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
