import { useEffect, useMemo, useState } from 'react';
import { buildCartItemId, type CartItem } from '@/entities/cart-item/model/cart-item';
import { mapProducts } from '@/entities/product/model/product';
import { listProducts } from '@/shared/api/catalog-api';

function buildAvailabilitySet(items: Awaited<ReturnType<typeof listProducts>>) {
  const availableItemIds = new Set<string>();
  const products = mapProducts(items);

  for (const product of products) {
    for (const color of product.colors) {
      for (const sizeId of color.sizeIds) {
        availableItemIds.add(
          buildCartItemId({
            productId: product.id,
            colorId: color.id,
            sizeId,
          }),
        );
      }
    }
  }

  return availableItemIds;
}

export function useCartAvailability(items: CartItem[]) {
  const [availableItemIds, setAvailableItemIds] = useState<Set<string> | null>(null);

  const signature = useMemo(
    () => items.map((item) => item.id).sort().join('|'),
    [items],
  );

  useEffect(() => {
    let isMounted = true;

    if (items.length === 0) {
      setAvailableItemIds(new Set());
      return;
    }

    listProducts()
      .then((response) => {
        if (!isMounted) {
          return;
        }

        setAvailableItemIds(buildAvailabilitySet(response));
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setAvailableItemIds(null);
      });

    return () => {
      isMounted = false;
    };
  }, [items.length, signature]);

  return useMemo(() => {
    if (availableItemIds === null) {
      return {
        items: items.map((item) => ({ available: true, item })),
        unavailableCount: 0,
      };
    }

    const itemsWithAvailability = items.map((item) => ({
      available: availableItemIds.has(item.id),
      item,
    }));

    return {
      items: itemsWithAvailability,
      unavailableCount: itemsWithAvailability.filter((entry) => !entry.available).length,
    };
  }, [availableItemIds, items]);
}
