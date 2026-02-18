interface PaginationParams {
  page?: string | number;
  pageSize?: string | number;
}

interface PrismaPagination {
  skip: number;
  take: number;
  currentPage: number;
  pageSize: number;
}

export const getPagination = (query: PaginationParams): PrismaPagination => {
    // Convertimos a número y validamos que no sean menores a 1
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.max(Number(query.pageSize) || 10, 1);

    // Cálculo para Prisma
    const skip = (page - 1) * limit;
    const take = limit;

    return {
        skip,
        take,
        currentPage: page,
        pageSize: limit,
    };
}