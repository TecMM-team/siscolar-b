import { Request, Response } from 'express';
//import { PrismaClient/*, Prisma */} from '@prisma/client';
import prisma from '../config/db';


export const getUbicaciones = async (req: Request, res: Response) => {
    try{
        //const prisma = req.app.get('prisma') as PrismaClient;

        const ubicaciones = await prisma.ubicacion.findMany({});

        return res.status(200).json(ubicaciones);

    }catch(error){
        console.log(error);
        res.status(500).json({ error: 'Error al obtener series' });
    }
}

export const getUbicacionesById = async (req: Request, res: Response) => {
    const {id} = req.params;
    try{
        //const prisma = req.app.get('prisma') as PrismaClient;

        const ubicacion = await prisma.ubicacion.findUnique({
            where: {
                id: Number(id)
            }
        });

        res.status(200).json(ubicacion);
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Error al obtener ubicaciones'});
    }
}

export const guardaUbicaciones = async (req: Request, res: Response) => {
    try{
        //const prisma = req.app.get('prisma') as PrismaClient;

        const nuevaUbicacion = await prisma.ubicacion.create({
            data: req.body
        });

        res.status(201).json(nuevaUbicacion);
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Error al registrar ubicacion'});
    }
}

export const actualizarUbicacion = async (req: Request, res: Response) => {
    const {id} = req.params; 
    try{
        //console.log(id);
        //console.log(req.body);
        //const prisma = req.app.get('prisma') as PrismaClient;
        
        const ubicacionActualizada = await prisma.ubicacion.update({
            where: { id: Number(id) },
            data: req.body
        });

        return res.status(200).json(ubicacionActualizada);
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Error al actualizar ubicacion'});
    }
}

export const actualizarEstado = async (req:Request, res: Response) => {
    const {id} = req.params;
    try{
        //const prisma = req.app.get('prisma') as PrismaClient;

        const ubicacionActualizada = await prisma.ubicacion.update({
            where: {id: Number(id)},
            data: req.body
        })

        res.status(200).json(ubicacionActualizada);
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Error al actualizar estado'})
    }
}