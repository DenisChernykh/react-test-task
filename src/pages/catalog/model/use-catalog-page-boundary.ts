import { mapProducts, type Product } from '@/entities/product/model/product';
import { listProducts } from '@/shared/api/catalog-api';
import { useDeferredValue, useEffect, useMemo, useState, startTransition } from 'react';
import { useSearchParams } from 'react-router-dom';
import { readCatalogQuery, writeCatalogQuery } from './catalog-query';

type CatalogQuery = ReturnType<typeof readCatalogQuery>;

type CatalogBoundaryActions = {
  setSearch: (search: string) => void;
  setInStock: (inStock: boolean) => void;
  setSort: (sort: 'asc' | 'desc' | '') => void;
};

type CatalogBoundaryState = {
  status: 'loading' | 'error' | 'ready';
  errorMessage?: string;
  query: CatalogQuery;
  products: Product[];
  actions: CatalogBoundaryActions;
};

type RequestState =
  | { status: 'loading' }
  | { status: 'error'; errorMessage: string }
  | { status: 'ready' };

const initialRequestState: RequestState = { status: 'loading' };

export function useCatalogPageBoundary(): CatalogBoundaryState {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [requestState, setRequestState] = useState<RequestState>(initialRequestState);

  const query = useMemo(() => readCatalogQuery(searchParams), [searchParams]);
  const deferredSearch = useDeferredValue(query.search);

  useEffect(() => {
    let isMounted = true;

    setRequestState(initialRequestState);

    listProducts()
      .then((response) => {
        if (!isMounted) {
          return;
        }

        setRawProducts(mapProducts(response));
        setRequestState({ status: 'ready' });
      })
      .catch((reason: unknown) => {
        if (!isMounted) {
          return;
        }

        setRequestState({
          status: 'error',
          errorMessage:
            reason instanceof Error ? reason.message : 'Не удалось загрузить каталог.',
        });
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleProducts = useMemo(() => {
    const normalizedSearch = deferredSearch.trim().toLowerCase();

    const filteredProducts = rawProducts.filter((product) => {
      const matchesSearch =
        !normalizedSearch || product.name.toLowerCase().includes(normalizedSearch);
      const matchesStock = !query.inStock || product.inStock;

      return matchesSearch && matchesStock;
    });

    if (!query.sort) {
      return filteredProducts;
    }

    const direction = query.sort === 'asc' ? 1 : -1;

    return [...filteredProducts].sort(
      (left, right) => (left.minPrice - right.minPrice) * direction,
    );
  }, [deferredSearch, query.inStock, query.sort, rawProducts]);

  const updateQuery = (patch: Parameters<typeof writeCatalogQuery>[1]) => {
    startTransition(() => {
      setSearchParams((current) => writeCatalogQuery(current, patch), { replace: true });
    });
  };

  return {
    status: requestState.status,
    errorMessage: requestState.status === 'error' ? requestState.errorMessage : undefined,
    query,
    products: visibleProducts,
    actions: {
      setSearch: (search) => updateQuery({ search }),
      setInStock: (inStock) => updateQuery({ inStock }),
      setSort: (sort) => updateQuery({ sort: sort || null }),
    },
  };
}
