// ruta/ruta.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

export interface CoordenadaDto {
  lat: number;
  lng: number;
}

export interface CreateRutaDto {
  origen: {
    coordenadas: CoordenadaDto;
    calle?: string;
    altura?: string;
    nombre?: string;
  };
  destino: {
    coordenadas: CoordenadaDto;
    calle?: string;
    altura?: string;
    nombre?: string;
  };
}

@Injectable()
export class RutaService {
  // API pública de OSRM — sin API key, gratuita
  private readonly OSRM_BASE =
    'https://router.project-osrm.org/route/v1/driving';

  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  /**
   * Llama a OSRM y devuelve distancia (km), duración (min) y geometría GeoJSON.
   */
  async calcularRutaOSRM(origen: CoordenadaDto, destino: CoordenadaDto) {
    const url =
      `${this.OSRM_BASE}/` +
      `${origen.lng},${origen.lat};${destino.lng},${destino.lat}` +
      `?overview=full&geometries=geojson&steps=true`;

    try {
      const response = await firstValueFrom(this.httpService.get<any>(url));
      const data = response.data;

      if (data.code !== 'Ok' || !data.routes?.length) {
        throw new HttpException(
          'OSRM no pudo calcular la ruta',
          HttpStatus.BAD_GATEWAY,
        );
      }

      const route = data.routes[0];
      return {
        distanciaKm: +(route.distance / 1000).toFixed(2),
        duracionMin: +(route.duration / 60).toFixed(1),
        geometria: route.geometry, // GeoJSON LineString → para el mapa
        pasos: route.legs[0].steps.map((s: any) => ({
          instruccion: s.maneuver.instruction ?? s.name,
          distanciaM: s.distance,
          duracionSeg: s.duration,
        })),
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      const message = err instanceof Error ? err.message : 'Error desconocido';
      throw new HttpException(
        `Error al contactar OSRM: ${message}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  /**
   * Crea Posicion + Ubicacion en la BD y devuelve el id de Ubicacion.
   */
  private async crearUbicacion(
    coordenadas: CoordenadaDto,
    extra: { calle?: string; altura?: string; nombre?: string },
  ) {
    const posicion = await this.prisma.posicion.create({
      data: {
        coordenadaX: coordenadas.lat,
        coordenadaY: coordenadas.lng,
      },
    });

    const ubicacion = await this.prisma.ubicacion.create({
      data: {
        posicionId: posicion.id,
        calle: extra.calle,
        altura: extra.altura,
        nombre: extra.nombre,
      },
    });

    return ubicacion.id;
  }

  /**
   * Crea la Ruta completa (con sus Ubicaciones) y la persiste.
   * Retorna la Ruta con la geometría calculada por OSRM.
   */
  async crearRuta(dto: CreateRutaDto) {
    // 1. Calcular ruta real en OSRM
    const osrmData = await this.calcularRutaOSRM(
      dto.origen.coordenadas,
      dto.destino.coordenadas,
    );

    // 2. Tarifa: ej. $50 por km
    const TARIFA_POR_KM = 50;
    const tarifaDistancia = osrmData.distanciaKm * TARIFA_POR_KM;

    // 3. Persistir ubicaciones
    const [origenId, destinoId] = await Promise.all([
      this.crearUbicacion(dto.origen.coordenadas, dto.origen),
      this.crearUbicacion(dto.destino.coordenadas, dto.destino),
    ]);

    // 4. Crear la Ruta en BD
    const ruta = await this.prisma.ruta.create({
      data: {
        origenId,
        destinoId,
        tarifaDistancia,
      },
      include: {
        origen: { include: { posicion: true } },
        destino: { include: { posicion: true } },
      },
    });

    // 5. Devolver ruta BD + datos de OSRM (geometría para el mapa)
    return {
      ...ruta,
      osrm: osrmData,
    };
  }

  async findOne(id: number) {
    const ruta = await this.prisma.ruta.findUnique({
      where: { id },
      include: {
        origen: { include: { posicion: true } },
        destino: { include: { posicion: true } },
        pedido: true,
      },
    });
    if (!ruta)
      throw new HttpException('Ruta no encontrada', HttpStatus.NOT_FOUND);
    return ruta;
  }
}
