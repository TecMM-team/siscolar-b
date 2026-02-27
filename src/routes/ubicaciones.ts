import { Router } from 'express';

import { actualizarEstado, actualizarUbicacion, getUbicaciones, getUbicacionesById, guardaUbicaciones } from '../controllers/ubicaciones';

const router = Router();

router.post('/', guardaUbicaciones);
router.get('/', getUbicaciones);
router.get('/clave/:id', getUbicacionesById);
router.patch('/:id', actualizarUbicacion);
router.patch('/:id/estado', actualizarEstado);

export default router;