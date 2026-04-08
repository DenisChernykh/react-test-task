import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { useCartStore } from '@/app/store/cart-store';
import { AppHeader } from './app-header';

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

describe('AppHeader', () => {
  beforeEach(() => {
    localStorage.clear();
    useCartStore.getState().reset();
  });

  it('renders active catalog link content with contrast text class', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppHeader />
      </MemoryRouter>,
    );

    expect(screen.getByText('Каталог')).toHaveClass('text-background');
  });

  it('renders active cart link content with contrast text class', () => {
    render(
      <MemoryRouter initialEntries={['/cart']}>
        <AppHeader />
      </MemoryRouter>,
    );

    const cartLabels = screen.getAllByText('Корзина');
    expect(cartLabels.at(-1)).toHaveClass('text-background');
  });

  it('renders quantity and total inside the cart link', () => {
    useCartStore.getState().addItem(baseCartItem);
    useCartStore.getState().addItem(baseCartItem);
    useCartStore.getState().applyPromo('SALE10');

    render(
      <MemoryRouter initialEntries={['/']}>
        <AppHeader />
      </MemoryRouter>,
    );

    const cartLink = screen.getByRole('link', { name: /Корзина/ });

    expect(within(cartLink).getByText('2')).toBeInTheDocument();
    expect(cartLink).toHaveTextContent('225');
    expect(cartLink).toHaveTextContent('₽');
  });
});
