import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productoService.create(createProductoDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.productoService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productoService.findOne(id);
  }

  @Get('sucursal/')
  @Public()
  findAllBySucursalAndCategoria(
    @Query('sucursalId', ParseIntPipe) sucursalId: number,
    @Query('categoriaId', ParseIntPipe) categoriaId: number,
  ) {
    return this.productoService.findAllBySucursalAndCategoria(
      sucursalId,
      categoriaId,
    );
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.productoService.update(id, updateProductoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productoService.remove(id);
  }
}
