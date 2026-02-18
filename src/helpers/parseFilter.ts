/**
 * Convierte query params en un objeto 'where' para Prisma
 * y mantiene un registro de los filtros aplicados.
 */
export function parseFilters<T>(query: Record<string, any>) {
    const where: Record<string, any> = {};
    const appliedFilters: Record<string, any> = {};

    // Definimos qué parámetros NO son filtros de base de datos
    const excludedFields = ['page', 'limit', 'sort', 'order'];

    Object.keys(query).forEach((key) => {
        if (!excludedFields.includes(key) && query[key] !== undefined && query[key] !== '') {
            const value = query[key];
            // Lógica para convertir strings numéricos en Numbers de JS
            // (Importante para IDs o campos de cantidad)
            const parsedValue = isNaN(Number(value)) ? value : Number(value);
            
            where[key] = parsedValue;
            appliedFilters[key] = parsedValue;
        }
    });

    return {
        where: where as T, // Cast al tipo de Input del modelo
        appliedFilters,
    };
}