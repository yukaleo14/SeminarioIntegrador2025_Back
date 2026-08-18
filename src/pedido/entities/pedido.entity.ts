export class Pedido {
  id: number;
  numero: string;
  horaLlegadaEstimada: Date;
  montoTotal: number;
  tiempoPreparacionEstimado: number;
  tiempoRepartoEstimado: number;
  fechaHora: Date;
  compradorId: number;
  repartidorId: number | null;
  empresaId: number;
  rutaId: number;
  pagoId: number;
  estadoId: number;
}
