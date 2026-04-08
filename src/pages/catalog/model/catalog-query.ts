import type { SortDirection } from '@/shared/api';

export type CatalogQueryState = {
  search: string;
  inStock: boolean;
  sort: SortDirection | null;
};

const sortValues: SortDirection[] = ['asc', 'desc'];

export function readCatalogQuery(searchParams: URLSearchParams): CatalogQueryState {
  const sort = searchParams.get('sort');

  return {
    search: searchParams.get('search') ?? '',
    inStock: searchParams.get('inStock') === 'true',
    sort: sortValues.includes(sort as SortDirection) ? (sort as SortDirection) : null,
  };
}

export function writeCatalogQuery(
  current: URLSearchParams,
  patch: Partial<CatalogQueryState>,
): URLSearchParams {
  const next = new URLSearchParams(current);

  if (patch.search !== undefined) {
    if (patch.search.trim()) {
      next.set('search', patch.search.trim());
    } else {
      next.delete('search');
    }
  }

  if (patch.inStock !== undefined) {
    if (patch.inStock) {
      next.set('inStock', 'true');
    } else {
      next.delete('inStock');
    }
  }

  if (patch.sort !== undefined) {
    if (patch.sort) {
      next.set('sort', patch.sort);
    } else {
      next.delete('sort');
    }
  }

  return next;
}
