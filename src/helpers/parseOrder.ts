import { Prisma } from '@prisma/client';

/**
 * Interface para el resultado del helper
 * T representa el modelo de Prisma (ej: Prisma.SeriesOrderByWithRelationInput)
 */
interface OrderByResponse<T> {
  orderBy: T[];
  sort: string;
}

/**
 * Helper para construir el orderBy de Prisma
 * @param sortParam - El string del query (ej: "title:asc")
 * @param allowedFields - Whitelist de campos (usamos keyof T para mayor seguridad)
 * @param defaultSort - Orden por defecto
 */
export function getOrderBy<T>(
  sortParam: string | undefined,
  allowedFields: (keyof T)[],
  defaultSort: string = 'createdAt:desc'
): OrderByResponse<T> {
    // 1. Manejo del valor inicial
    const currentSort = sortParam || defaultSort;
    const [field, order] = currentSort.split(':') as [keyof T, string];

    // 2. Validaciones
    const isValidField = allowedFields.includes(field);
    const isValidOrder = ['asc', 'desc'].includes(order?.toLowerCase());

    // 3. Construcción del resultado
    // Si no es válido, se recurre al default (parseado recursivamente o manual)
    if (!isValidField || !isValidOrder) {
      const [defField, defOrder] = defaultSort.split(':') as [keyof T, Prisma.SortOrder];
      return {
        orderBy: [{ [defField]: defOrder } as T],
        sort: defaultSort,
      };
    }

    const finalOrder = order.toLowerCase() as Prisma.SortOrder;

    return {
      orderBy: [{ [field]: finalOrder } as T],
      sort: `${String(field)}:${finalOrder}`,
    };
}