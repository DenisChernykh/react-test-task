import {
  selectAppliedPromo,
  selectCartDiscount,
  selectCartSubtotal,
  selectCartTotal,
  selectCartUnitsCount,
  useCartStore,
} from '@/app/store/cart-store';
import { beforeEach, describe, expect, it } from 'vitest';

const storageKey = 'react-test-task-cart';

const baseCartItem = {
  productId: 1,
  productName: 'Футболка',
  colorId: 2,
  colorName: 'белый',
  sizeId: 4,
  sizeName: 'L',
  image: '/images/1/white_front.png',
  price: 125,
};

describe('cart store', () => {
  beforeEach(() => {
    localStorage.clear();
    useCartStore.getState().reset();
  });

  it('increments quantity for the same product-color-size combination', () => {
    useCartStore.getState().addItem(baseCartItem);
    useCartStore.getState().addItem(baseCartItem);

    const state = useCartStore.getState();

    expect(state.items).toHaveLength(1);
    expect(state.items[0]?.quantity).toBe(2);
    expect(selectCartUnitsCount(state)).toBe(2);
    expect(selectCartSubtotal(state)).toBe(250);
  });

  it('applies percentage and fixed promos with correct totals', () => {
    useCartStore.getState().addItem(baseCartItem);
    useCartStore.getState().addItem(baseCartItem);

    const saleResult = useCartStore.getState().applyPromo('sale10');
    expect(saleResult.success).toBe(true);

    let state = useCartStore.getState();
    expect(selectAppliedPromo(state)?.code).toBe('SALE10');
    expect(selectCartDiscount(state)).toBe(25);
    expect(selectCartTotal(state)).toBe(225);

    const fixedResult = useCartStore.getState().applyPromo('MINUS300');
    expect(fixedResult.success).toBe(true);

    state = useCartStore.getState();
    expect(selectAppliedPromo(state)?.code).toBe('MINUS300');
    expect(selectCartDiscount(state)).toBe(250);
    expect(selectCartTotal(state)).toBe(0);
  });

  it('keeps promo state unchanged for invalid codes', () => {
    useCartStore.getState().addItem(baseCartItem);

    const initialResult = useCartStore.getState().applyPromo('SALE10');
    expect(initialResult.success).toBe(true);

    const invalidResult = useCartStore.getState().applyPromo('INVALID');

    expect(invalidResult).toEqual({
      success: false,
      errorMessage: 'Промокод не найден.',
    });
    expect(selectAppliedPromo(useCartStore.getState())?.code).toBe('SALE10');
  });

  it('creates a new line for a different size or color', () => {
    useCartStore.getState().addItem(baseCartItem);
    useCartStore.getState().addItem({
      ...baseCartItem,
      sizeId: 5,
      sizeName: 'XL',
    });

    expect(useCartStore.getState().items).toHaveLength(2);
  });

  it('rehydrates persisted items from localStorage', async () => {
    useCartStore.getState().addItem(baseCartItem);
    useCartStore.getState().applyPromo('SALE10');

    const snapshot = localStorage.getItem(storageKey);

    useCartStore.setState({ items: [] });

    if (!snapshot) {
      throw new Error('Cart snapshot was not persisted');
    }

    localStorage.setItem(storageKey, snapshot);

    await useCartStore.persist.rehydrate();

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0]?.id).toBe('1:2:4');
    expect(selectAppliedPromo(useCartStore.getState())?.code).toBe('SALE10');
  });
});
