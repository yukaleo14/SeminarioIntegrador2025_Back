export class Pedido {
  id: number;
  numero: string;
  horaLlegadaEstimada: Date;
  montoTotal: number;
  tiempoPreparacionEstimado: number;
  tiempoRepartoEstimado: number;
  fechaHora: Date;
  compradorId: number;
  repartidorId: number;
  empresaId: number;
  rutaId: number;
  pagoId: number;
  estadoId: number;
}
