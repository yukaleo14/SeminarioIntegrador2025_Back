import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Body,
  Param,
  NotFoundException,
  BadRequestException,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { createReadStream, existsSync, mkdirSync, unlinkSync } from 'fs';
import { ConfigService } from '@nestjs/config';

@Controller('file')
export class FileController {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './images';
          let destination = uploadPath;

          if (!existsSync(destination)) {
            try {
              mkdirSync(destination, { recursive: true });
            } catch (error) {
              return cb(new BadRequestException(`Error al crear la carpeta`), '');
            }
          }

          cb(null, destination);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
          return cb(new Error('Solo se permiten imágenes (JPEG, PNG, GIF)'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { tipo?: string; sucursalId?: string; productoId?: string; categoriaId?: string },
  ) {
    try {
      if (!file) {
        throw new BadRequestException('No se proporcionó un archivo');
      }

      const { tipo, sucursalId, productoId, categoriaId } = body;
      let filePath = file.filename;


      return { filename: filePath };
    } catch (error) {
      const filePath = join(process.cwd(), file.path);
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }
      throw new BadRequestException(`Error al subir el archivo`);
    }
  }

  @Get(':filename/*splat')
  getFile(@Param('filename') filename: string): StreamableFile {
    const uploadPath = './images';
    const filePath = join(process.cwd(), uploadPath, filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException(`Archivo ${filename} no encontrado`);
    }

    const ext = extname(filename).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    if (!allowedExtensions.includes(ext)) {
      throw new BadRequestException('Tipo de archivo no permitido');
    }

    const file = createReadStream(filePath);
    return new StreamableFile(file);
  }
}