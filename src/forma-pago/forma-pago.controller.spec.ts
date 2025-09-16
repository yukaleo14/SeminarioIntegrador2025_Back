import { Test, TestingModule } from '@nestjs/testing';
import { FormaPagoController } from './forma-pago.controller';
import { FormaPagoService } from './forma-pago.service';

describe('FormaPagoController', () => {
  let controller: FormaPagoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormaPagoController],
      providers: [FormaPagoService],
    }).compile();

    controller = module.get<FormaPagoController>(FormaPagoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
