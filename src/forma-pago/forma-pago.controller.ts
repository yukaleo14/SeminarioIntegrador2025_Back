import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { FormaPagoService } from './forma-pago.service';
import { CreateFormaPagoDto } from './dto/create-forma-pago.dto';
import { UpdateFormaPagoDto } from './dto/update-forma-pago.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { FormaPago } from './entities/forma-pago.entity';

@Controller('forma-pago')
export class FormaPagoController {
  constructor(private readonly formaPagoService: FormaPagoService) {}

  @Post()
  @Public()
  create(@Body() createFormaPagoDto: CreateFormaPagoDto) {
    return this.formaPagoService.create(createFormaPagoDto);
  }

  @Get()
  @ApiCreatedResponse({ type: FormaPago, isArray: true })
  findAll() {
    return this.formaPagoService.findAll();
  }

  @Get(':id')
  @ApiCreatedResponse({ type: FormaPago })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.formaPagoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFormaPagoDto: UpdateFormaPagoDto,
  ) {
    return this.formaPagoService.update(id, updateFormaPagoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.formaPagoService.remove(id);
  }
}
