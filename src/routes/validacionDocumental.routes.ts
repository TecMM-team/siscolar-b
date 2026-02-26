import { Router } from 'express';
import multer from 'multer';
import { ValidacionDocumentalController } from '../controllers/validacionDocumental.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/validar', upload.single('archivo'), ValidacionDocumentalController.validar);

export default router;
