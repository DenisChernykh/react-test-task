import {
  mapProductDto,
  mapSizes,
  type Product,
  type ProductColor,
  type Size,
} from '@/entities/product/model/product';
import { getProductById, listSizes } from '@/shared/api/catalog-api';
import { startTransition, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

type ProductDetailsBoundaryActions = {
  selectColor: (colorId: number) => void;
  selectSize: (sizeId: number) => void;
};

export type ProductPurchaseState = 'available' | 'unavailable';

type ProductDetailsResourceState =
  | { status: 'loading' }
  | { status: 'error'; errorMessage: string }
  | { status: 'notFound' }
  | {
      status: 'ready';
      product: Product;
      sizes: Size[];
    };

type ProductDetailsBoundaryState =
  | { status: 'loading' }
  | { status: 'error'; errorMessage: string }
  | { status: 'notFound' }
  | {
      status: 'ready';
      product: Product;
      sizes: Size[];
      selectedColor: ProductColor;
      selectedSize: Size | null;
      purchaseState: ProductPurchaseState;
      actions: ProductDetailsBoundaryActions;
    };

type ProductDetailsQuery = {
  colorId: number | null;
  sizeId: number | null;
};

const initialResourceState: ProductDetailsResourceState = { status: 'loading' };

function parseParamValue(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function readProductDetailsQuery(searchParams: URLSearchParams): ProductDetailsQuery {
  return {
    colorId: parseParamValue(searchParams.get('color')),
    sizeId: parseParamValue(searchParams.get('size')),
  };
}

function resolveSelectedColor(product: Product, colorId: number | null) {
  if (colorId === null) {
    return product.colors[0] ?? null;
  }

  for (const color of product.colors) {
    if (color.id === colorId) {
      return color;
    }
  }

  return product.colors[0] ?? null;
}

function findFirstAvailableColor(product: Product) {
  for (const color of product.colors) {
    if (color.inStock) {
      return color;
    }
  }

  return null;
}

export function useProductDetailsPageBoundary(): ProductDetailsBoundaryState {
  const { productId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [resourceState, setResourceState] = useState<ProductDetailsResourceState>(
    initialResourceState,
  );

  useEffect(() => {
    if (!productId) {
      setResourceState({ status: 'notFound' });
      return;
    }

    let isMounted = true;

    setResourceState(initialResourceState);

    Promise.all([getProductById(productId), listSizes()])
      .then(([productResponse, sizesResponse]) => {
        if (!isMounted) {
          return;
        }

        setResourceState({
          status: 'ready',
          product: mapProductDto(productResponse),
          sizes: mapSizes(sizesResponse),
        });
      })
      .catch((reason: unknown) => {
        if (!isMounted) {
          return;
        }

        if (reason instanceof Error && /Product not found/i.test(reason.message)) {
          setResourceState({ status: 'notFound' });
          return;
        }

        setResourceState({
          status: 'error',
          errorMessage: reason instanceof Error ? reason.message : 'Не удалось загрузить товар.',
        });
      });

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const query = useMemo(() => readProductDetailsQuery(searchParams), [searchParams]);

  const updateQuery = (updater: (current: URLSearchParams) => URLSearchParams) => {
    startTransition(() => {
      setSearchParams((current) => updater(current), { replace: true });
    });
  };

  const readyState = resourceState.status === 'ready' ? resourceState : null;
  const firstAvailableColor = readyState ? findFirstAvailableColor(readyState.product) : null;
  const purchaseState: ProductPurchaseState | null = readyState
    ? firstAvailableColor
      ? 'available'
      : 'unavailable'
    : null;
  const requestedColor = readyState ? resolveSelectedColor(readyState.product, query.colorId) : null;
  const selectedColor =
    purchaseState === 'available'
      ? requestedColor?.inStock
        ? requestedColor
        : firstAvailableColor
      : requestedColor;
  const sizeById = new Map((readyState?.sizes ?? []).map((size) => [size.id, size]));
  const selectedColorId = selectedColor?.id ?? null;
  const selectedColorSizeIds = selectedColor?.sizeIds ?? [];

  const shouldSyncSelectedColor =
    purchaseState === 'available' &&
    selectedColorId !== null &&
    query.colorId !== null &&
    query.colorId !== selectedColorId;
  const selectedSize =
    !selectedColor || purchaseState === 'unavailable' || query.sizeId === null
      ? null
      : sizeById.get(query.sizeId) ?? null;
  const resolvedSize =
    selectedColor && selectedSize && selectedColorSizeIds.includes(selectedSize.id)
      ? selectedSize
      : null;
  const shouldClearInvalidSize =
    selectedColorId !== null &&
    query.sizeId !== null &&
    (purchaseState === 'unavailable' || !selectedColorSizeIds.includes(query.sizeId));

  useEffect(() => {
    if (selectedColorId === null || (!shouldSyncSelectedColor && !shouldClearInvalidSize)) {
      return;
    }

    startTransition(() => {
      setSearchParams((current) => {
        const next = new URLSearchParams(current);

        if (shouldSyncSelectedColor) {
          next.set('color', String(selectedColorId));
        }

        if (shouldClearInvalidSize) {
          next.delete('size');
        }

        return next;
      }, { replace: true });
    });
  }, [
    selectedColorId,
    setSearchParams,
    shouldClearInvalidSize,
    shouldSyncSelectedColor,
  ]);

  if (resourceState.status !== 'ready') {
    return resourceState;
  }

  if (!selectedColor || !purchaseState) {
    return { status: 'notFound' };
  }

  return {
    status: 'ready',
    product: resourceState.product,
    sizes: resourceState.sizes,
    selectedColor,
    selectedSize: resolvedSize,
    purchaseState,
    actions: {
      selectColor: (colorId) =>
        updateQuery((current) => {
          const next = new URLSearchParams(current);
          next.set('color', String(colorId));
          next.delete('size');
          return next;
        }),
      selectSize: (sizeId) =>
        updateQuery((current) => {
          const next = new URLSearchParams(current);
          next.set('size', String(sizeId));
          return next;
        }),
    },
  };
}
