import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream, existsSync, mkdirSync, unlinkSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('file')
export class FileController {
  constructor(private readonly configService: ConfigService) { }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './images';
          if (!existsSync(uploadPath)) {
            try {
              mkdirSync(uploadPath, { recursive: true });
            } catch {
              return cb(
                new BadRequestException('Error al crear la carpeta'),
                '',
              );
            }
          }

          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowed.includes(file.mimetype)) {
          return cb(
            new BadRequestException(
              'Solo se permiten imágenes (JPEG, PNG, GIF)',
            ),
            false,
          );
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
    @Body()
    body: {
      tipo?: string;
      sucursalId?: string;
      productoId?: string;
      categoriaId?: string;
    },
  ) {
    if (!file) {
      throw new BadRequestException('No se proporcionó un archivo');
    }

    try {
      // En este ejemplo solo devolvés el filename
      return { filename: file.filename };
    } catch (error) {
      if (file?.path) {
        const fullPath = join(process.cwd(), file.path);
        if (existsSync(fullPath)) {
          unlinkSync(fullPath);
        }
      }
      throw new BadRequestException('Error al subir el archivo');
    }
  }

  @Get('/*path')
  @Public()
  getFile(@Param('path') params: string[]): StreamableFile {
    // El path viene como array, lo convertimos a string
    const path = Array.isArray(params) ? params.join('/') : params['0'] || '';

    if (!path) {
      throw new BadRequestException('Ruta de archivo inválida');
    }

    // Normalizar la ruta para evitar ataques de path traversal
    const normalizedPath = path.replace(/\.\./g, '');
    const filePath = join(process.cwd(), 'images', normalizedPath);

    // Verificar que el archivo está dentro de la carpeta images
    const imagesDir = join(process.cwd(), 'images');
    if (!filePath.startsWith(imagesDir)) {
      throw new BadRequestException('Ruta de archivo inválida');
    }

    if (!existsSync(filePath)) {
      throw new NotFoundException(`Archivo ${path} no encontrado`);
    }

    const ext = extname(path).toLowerCase();

    // Mapa tipado
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    } as const;

    type AllowedExtension = keyof typeof mimeTypes;
    const allowedExtensions = Object.keys(mimeTypes) as AllowedExtension[];

    if (!allowedExtensions.includes(ext as AllowedExtension)) {
      throw new BadRequestException('Tipo de archivo no permitido');
    }

    const file = createReadStream(filePath);

    return new StreamableFile(file, {
      type: mimeTypes[ext as AllowedExtension],
    });
  }
}