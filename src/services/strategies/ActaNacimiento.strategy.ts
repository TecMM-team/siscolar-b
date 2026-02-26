import { EstrategiaValidacionDocumental, ResultadoValidacion, ReglaEjecutada, EstadoValidacion } from '../../types/validacion.types';

/**
 * Estrategia de validación para Actas de Nacimiento Mexicanas (Digitales/Normalizadas)
 */
export class ActaNacimientoStrategy implements EstrategiaValidacionDocumental {
  clave = 'ACTA_NAC';

  async validar(texto: string): Promise<ResultadoValidacion> {
    const hallazgos: Record<string, any> = {};
    const reglas: ReglaEjecutada[] = [];
    const textoUpper = texto.toUpperCase();

    // --- REGLA 1: Encabezado Oficial ---
    const esOficial = textoUpper.includes('ESTADOS UNIDOS MEXICANOS') || textoUpper.includes('REGISTRO CIVIL');
    reglas.push({
      nombre: 'Encabezado Oficial',
      resultado: esOficial ? 'Cumple' : 'NoCumple',
      mensaje: esOficial ? 'Documento con encabezado oficial detectado.' : 'No se detectó el encabezado de "Estados Unidos Mexicanos" o "Registro Civil".'
    });

    // --- REGLA 2: Buscar CURP ---
    const curpRegex = /[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z\d]\d/;
    const curpMatch = textoUpper.match(curpRegex);
    
    reglas.push({
      nombre: 'Presencia de CURP',
      resultado: curpMatch ? 'Cumple' : 'NoCumple',
      mensaje: curpMatch ? `CURP detectada: ${curpMatch[0]}` : 'No se encontró una CURP válida en el texto del documento.'
    });
    if (curpMatch) hallazgos.curp = curpMatch[0];

    // --- REGLA 3: Cadena Digital (Identificador de 20 dígitos) ---
    const cadenaDigitalRegex = /\d{20}/;
    const cadenaMatch = textoUpper.match(cadenaDigitalRegex);
    
    reglas.push({
      nombre: 'Identificador Digital (Cadena)',
      resultado: cadenaMatch ? 'Cumple' : 'NoCumple',
      mensaje: cadenaMatch ? `Cadena digital de 20 dígitos encontrada: ${cadenaMatch[0]}` : 'Falta el identificador digital de 20 dígitos.'
    });
    if (cadenaMatch) hallazgos.cadenaDigital = cadenaMatch[0];

    // --- REGLA 4: Año de Registro ---
    const añoRegistroRegex = /AÑO\s*(DE\s*)?REGISTRO\s*(\d{4})/;
    const añoMatch = textoUpper.match(añoRegistroRegex);
    if (añoMatch) {
        hallazgos.añoRegistro = añoMatch[2];
        reglas.push({ nombre: 'Detección de Año de Registro', resultado: 'Cumple' });
    }

    let estado: EstadoValidacion = 'ValidadoAutomatico';
    
    if (!curpMatch || !esOficial) {
      estado = 'RequiereRevision';
    }

    if (texto.length < 100) {
      estado = 'RechazadoTecnico';
    }

    return {
      estado,
      fuente: 'PENDIENTE',
      reglasEjecutadas: reglas,
      hallazgos: {
        ...hallazgos,
        caracteresAnalizados: texto.length
      }
    };
  }
}
