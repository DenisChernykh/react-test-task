import { describe, expect, it } from 'vitest';
import { getProductMinPrice, isProductColorInStock, isProductInStock, mapProductDto } from './product';

describe('product model', () => {
  it('maps computed availability and min price fields once', () => {
    const product = mapProductDto({
      id: 7,
      name: 'Анорак',
      categoryId: 1,
      brand: 'North Street',
      colors: [
        {
          id: 1,
          name: 'оливковый',
          images: ['/images/7/olive_front.png'],
          price: '199.00',
          description: 'Описание',
          sizes: [],
        },
        {
          id: 2,
          name: 'черный',
          images: ['/images/7/black_front.png'],
          price: '189.00',
          description: 'Описание',
          sizes: [2, 3],
        },
      ],
    });

    expect(product.minPrice).toBe(189);
    expect(product.inStock).toBe(true);
    expect(product.colors[0]?.inStock).toBe(false);
    expect(product.colors[1]?.inStock).toBe(true);
  });

  it('keeps compatibility helpers backed by computed fields', () => {
    const product = mapProductDto({
      id: 8,
      name: 'Пальто',
      categoryId: 1,
      brand: 'WarmLine',
      colors: [
        {
          id: 1,
          name: 'графит',
          images: ['/images/8/graphite_front.png'],
          price: '519.00',
          description: 'Описание',
          sizes: [],
        },
      ],
    });

    expect(getProductMinPrice(product)).toBe(519);
    expect(isProductInStock(product)).toBe(false);
    expect(isProductColorInStock(product.colors[0]!)).toBe(false);
  });
});
