import { buildCartItemId, createCartItem } from '@/entities/cart-item/model/cart-item';
import type { AddCartItemInput, CartItem } from '@/entities/cart-item/model/cart-item';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  calculatePromoDiscount,
  resolvePromo,
  type AppliedPromo,
  type ApplyPromoResult,
} from './cart-promo';

const CART_STORAGE_KEY = 'react-test-task-cart';

export type CartStoreState = {
  items: CartItem[];
  appliedPromo: AppliedPromo | null;
  addItem: (input: AddCartItemInput) => void;
  applyPromo: (code: string) => ApplyPromoResult;
  setQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearPromo: () => void;
  clear: () => void;
  reset: () => void;
};

const initialState = {
  items: [],
  appliedPromo: null,
};

export const useCartStore = create<CartStoreState>()(
  persist(
    (set) => ({
      ...initialState,
      addItem: (input) =>
        set((state) => {
          const itemId = buildCartItemId(input);
          const existingItem = state.items.find((item) => item.id === itemId);

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item,
              ),
            };
          }

          return {
            items: [...state.items, createCartItem(input)],
          };
        }),
      applyPromo: (code) => {
        const promo = resolvePromo(code);

        if (!promo) {
          return {
            success: false,
            errorMessage: 'Промокод не найден.',
          };
        }

        set({ appliedPromo: promo });

        return {
          success: true,
          promo,
        };
      },
      setQuantity: (itemId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item,
          ),
        })),
      removeItem: (itemId) =>
        set((state) => {
          const items = state.items.filter((item) => item.id !== itemId);

          return {
            items,
            appliedPromo: items.length > 0 ? state.appliedPromo : null,
          };
        }),
      clearPromo: () => set({ appliedPromo: null }),
      clear: () => set(initialState),
      reset: () => set(initialState),
    }),
    {
      name: CART_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        appliedPromo: state.appliedPromo,
      }),
    },
  ),
);

export const selectCartItems = (state: CartStoreState) => state.items;
export const selectAppliedPromo = (state: CartStoreState) => state.appliedPromo;
export const selectCartLineCount = (state: CartStoreState) => state.items.length;
export const selectCartUnitsCount = (state: CartStoreState) =>
  state.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartSubtotal = (state: CartStoreState) =>
  state.items.reduce((total, item) => total + item.price * item.quantity, 0);
export const selectCartDiscount = (state: CartStoreState) =>
  calculatePromoDiscount(selectCartSubtotal(state), state.appliedPromo);
export const selectCartTotal = (state: CartStoreState) =>
  Math.max(0, selectCartSubtotal(state) - selectCartDiscount(state));
