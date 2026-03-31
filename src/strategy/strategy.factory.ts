import { Injectable } from '@nestjs/common';
import CompradorStrategy from './implementations/comprador.strategy';
import EmpresaStrategy from './implementations/empresa.strategy';
import RepartidorStrategy from './implementations/repartidor.strategy';
import { IRegister } from './interfaces/IRegister.interface';

@Injectable()
export class StrategyFactory {
  constructor(
    private compradorStr: CompradorStrategy,
    private empresaStr: EmpresaStrategy,
    private repartidorStr: RepartidorStrategy,
  ) {}

  getStrategy(role: string): IRegister {
    switch (role) {
      case 'COMPRADOR':
        return this.compradorStr;
      case 'EMPRESA':
        return this.empresaStr;
      case 'REPARTIDOR':
        return this.repartidorStr;
      default:
        throw new Error(`Rol no soportado: ${role}`);
    }
  }
}
