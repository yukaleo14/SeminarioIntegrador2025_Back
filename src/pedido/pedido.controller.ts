import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PedidoGateway } from '../websocket/pedido.gateway';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Rol } from '@prisma/client';

@Controller('pedidos')
export class PedidoController {
  constructor(
    private readonly pedidoService: PedidoService,
    private readonly pedidoGateway: PedidoGateway,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Rol.COMPRADOR)
  async create(@Body() createPedidoDto: CreatePedidoDto) {
    const pedido = await this.pedidoService.create(createPedidoDto);
    if (pedido?.empresaId) {
      this.pedidoGateway.notifyNewPedido(pedido.empresaId, pedido);
    }
    return pedido;
  }

  @Get()
  @Public()
  findAll() {
    return this.pedidoService.findAll();
  }

  @Get('disponibles')
  @UseGuards(RolesGuard)
  @Roles(Rol.REPARTIDOR)
  findDisponibles() {
    return this.pedidoService.findDisponibles();
  }

  @Get('repartidor/me')
  @UseGuards(RolesGuard)
  @Roles(Rol.REPARTIDOR)
  findMisPedidos(@Req() req: any) {
    return this.pedidoService.findByRepartidor(req.user.userId);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.pedidoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePedidoDto: UpdatePedidoDto) {
    return this.pedidoService.update(+id, updatePedidoDto);
  }

  @Patch(':id/cancelar')
  @UseGuards(RolesGuard)
  @Roles(Rol.COMPRADOR)
  async cancelar(@Param('id') id: number) {
    const pedidoCancelado = await this.pedidoService.cancelar(id);
    if (pedidoCancelado.empresaId) {
      this.pedidoGateway.notifyPedidoActualizado(
        pedidoCancelado.empresaId,
        pedidoCancelado,
      );
    }
    return pedidoCancelado;
  }

  @Patch(':id/estado')
  @UseGuards(RolesGuard)
  @Roles(Rol.EMPRESA, Rol.REPARTIDOR)
  async actualizarEstado(
    @Param('id') id: number,
    @Body('estado') nuevoEstado: string,
  ) {
    const pedidoActualizado = await this.pedidoService.actualizarEstado(
      id,
      nuevoEstado,
    );

    // Notificamos vía WebSocket DESPUÉS de guardar en la BD
    if (pedidoActualizado.empresaId) {
      this.pedidoGateway.notifyPedidoActualizado(
        pedidoActualizado.empresaId,
        pedidoActualizado,
      );
    }

    return pedidoActualizado;
  }

  @Patch(':id/tomar')
  @UseGuards(RolesGuard)
  @Roles(Rol.REPARTIDOR)
  async tomar(@Param('id') id: number, @Req() req: any) {
    const pedidoTomado = await this.pedidoService.tomarPedido(id, req.user.userId);
    if (pedidoTomado?.empresaId) {
      this.pedidoGateway.notifyPedidoActualizado(pedidoTomado.empresaId, pedidoTomado);
    }
    return pedidoTomado;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pedidoService.remove(+id);
  }
}
