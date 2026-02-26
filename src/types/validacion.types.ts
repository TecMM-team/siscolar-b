export type EstadoValidacion = 'ValidadoAutomatico' | 'RequiereRevision' | 'RechazadoTecnico';
export type FuenteValidacion = 'PDF_TEXT' | 'OCR' | 'PENDIENTE';

export interface ReglaEjecutada {
  nombre: string;
  resultado: 'Cumple' | 'NoCumple' | 'NoAplica';
  mensaje?: string;
}

export interface ResultadoValidacion {
  estado: EstadoValidacion;
  fuente: FuenteValidacion;
  reglasEjecutadas: ReglaEjecutada[];
  hallazgos: Record<string, any>;
}

/**
 * Contrato base para las estrategias de validación por tipo documental.
 */
export interface EstrategiaValidacionDocumental {
  clave: string;
  validar(texto: string): Promise<ResultadoValidacion>;
}
