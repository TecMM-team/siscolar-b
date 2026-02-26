import { extraerTextoPdf } from '../utils/pdf_text.extractor';
import { 
  ResultadoValidacion, 
  EstrategiaValidacionDocumental, 
  EstadoValidacion 
} from '../types/validacion.types';
import { AppError } from '../middlewares/errorHandler';
import { ActaNacimientoStrategy } from './strategies/ActaNacimiento.strategy';

/**
 * Estrategia de validación por defecto para cualquier tipo documental.
 * Actúa como "esqueleto" mientras se crean reglas específicas.
 */
class EstrategiaGenerica implements EstrategiaValidacionDocumental {
  constructor(public clave: string) {}

  async validar(texto: string): Promise<ResultadoValidacion> {
    const reglas: any[] = [
      { nombre: 'Legibilidad de Texto', resultado: texto.length > 50 ? 'Cumple' : 'NoCumple' },
      { nombre: 'Detección de Formato', resultado: 'Cumple' }
    ];

    const estado: EstadoValidacion = texto.length > 100 ? 'ValidadoAutomatico' : 'RequiereRevision';

    return {
      estado,
      fuente: 'PDF_TEXT',
      reglasEjecutadas: reglas,
      hallazgos: {
        totalCaracteres: texto.length,
        tipoDocumentoDetectado: this.clave,
      }
    };
  }
}

export class ValidacionDocumentalService {
  /**
   * Registro de estrategias específicas (ej: ACTA_NAC, CURP, etc.)
   */
  private static estrategias: Record<string, EstrategiaValidacionDocumental> = {
    'ACTA_NAC': new ActaNacimientoStrategy(),
  };

  /**
   * Orquestador principal de validación.
   */
  static async validarDocumento(buffer: Buffer, claveDocumental: string): Promise<ResultadoValidacion> {
    try {
      // 1. Intentar extraer texto
      let extResult;
      try {
        extResult = await extraerTextoPdf(buffer);
      } catch (parseError: any) {
        const estado: EstadoValidacion = 'RechazadoTecnico';
        return {
          estado,
          fuente: 'PENDIENTE',
          reglasEjecutadas: [
            { nombre: 'Lectura de Estructura PDF', resultado: 'NoCumple', mensaje: 'El archivo no tiene una estructura PDF válida o está corrupto.' }
          ],
          hallazgos: {
            errorTecnico: parseError.message
          }
        };
      }
      
      // 2. Obtener estrategia (específica o genérica)
      const estrategia = this.estrategias[claveDocumental] || new EstrategiaGenerica(claveDocumental);

      // 3. Ejecutar reglas
      const resultado = await estrategia.validar(extResult.texto);

      return {
        ...resultado,
        fuente: extResult.meta.fuente // Priorizar la fuente real del extractor
      };
    } catch (error: any) {
      throw new AppError(`Error en el motor de validación documental: ${error.message}`, 500);
    }
  }
}
