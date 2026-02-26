import { Request, Response, NextFunction } from 'express';
import { ValidacionDocumentalService } from '../services/validacionDocumental.service';
import { buildSuccessResponse } from '../utils/responseBuilder';
import { AppError } from '../middlewares/errorHandler';

export class ValidacionDocumentalController {
  /**
   * Endpoint para validar un documento PDF según su tipo documental.
   * POST /api/v1/validacion-documental/validar
   */
  static async validar(req: Request, res: Response, next: NextFunction) {
    try {
      const { claveDocumental } = req.body;
      
      if (!req.file) {
        throw new AppError('No se ha proporcionado ningún archivo PDF.', 400);
      }

      if (!claveDocumental) {
        throw new AppError('La clave de tipo documental (claveDocumental) es requerida.', 400);
      }

      const resultado = await ValidacionDocumentalService.validarDocumento(
        req.file.buffer, 
        claveDocumental as string
      );

      res.status(200).json(buildSuccessResponse(resultado));
    } catch (error) {
      next(error);
    }
  }
}
