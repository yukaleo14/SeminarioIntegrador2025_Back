import { Test, TestingModule } from '@nestjs/testing';
import { DetallePedidoController } from './detalle-pedido.controller';
import { DetallePedidoService } from './detalle-pedido.service';

describe('DetallePedidoController', () => {
  let controller: DetallePedidoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetallePedidoController],
      providers: [DetallePedidoService],
    }).compile();

    controller = module.get<DetallePedidoController>(DetallePedidoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
