import { PaginatedVm, PaginationVm, SortVm } from '../models/domain.models';

type ApiPagination = Partial<{
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  returned: number;
  has_next_page: boolean;
  has_previous_page: boolean;
}>;

type ApiSort = Partial<{
  field: string;
  direction: string;
}>;

type ApiCollectionResponse<T> = {
  meta?: unknown;
} & Record<string, unknown>;

export const DEFAULT_LOOKUP_LIMIT = 100;

export const createDefaultPagination = (): PaginationVm => ({
  page: 1,
  limit: 25,
  total: 0,
  totalPages: 0,
  returned: 0,
  hasNextPage: false,
  hasPreviousPage: false,
});

export function mapPaginatedCollectionResponse<TInput, TOutput>(
  response: ApiCollectionResponse<TInput>,
  collectionKey: string,
  mapItem: (item: TInput) => TOutput
): PaginatedVm<TOutput> {
  const rawItems = response[collectionKey];
  const items = Array.isArray(rawItems) ? (rawItems as TInput[]).map(mapItem) : [];
  const meta = response.meta as { pagination?: ApiPagination; sort?: ApiSort } | undefined;
  const pagination = meta?.pagination;
  const sort = meta?.sort;

  const normalizedPagination: PaginationVm = {
    page: pagination?.page ?? 1,
    limit: pagination?.limit ?? Math.max(items.length, 25),
    total: pagination?.total ?? items.length,
    totalPages: pagination?.total_pages ?? (items.length ? 1 : 0),
    returned: pagination?.returned ?? items.length,
    hasNextPage: pagination?.has_next_page ?? false,
    hasPreviousPage: pagination?.has_previous_page ?? false,
  };

  const normalizedSort: SortVm | null = sort
    ? {
        field: sort.field ?? null,
        direction: sort.direction ?? null,
      }
    : null;

  return {
    items,
    pagination: normalizedPagination,
    sort: normalizedSort,
  };
}
