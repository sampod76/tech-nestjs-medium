import { OffsetPagination, OffsetPaginationMeta } from './pagination.types';

export const buildOffsetPagination = (
  query: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  },
  allowedSortFields: string[],
): OffsetPagination => {
  const sortBy = allowedSortFields.includes(query.sortBy)
    ? query.sortBy
    : allowedSortFields[0];

  return {
    page: query.page,
    limit: query.limit,
    skip: (query.page - 1) * query.limit,
    sortBy,
    sortOrder: query.sortOrder,
  };
};

export const buildOffsetMeta = (
  total: number,
  page: number,
  limit: number,
): OffsetPaginationMeta => {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};
