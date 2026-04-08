import { useCartStore } from '@/app/store/cart-store';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { appRoutes } from './app-router';

function renderAtRoute(initialEntries: string | string[], initialIndex?: number) {
  const router = createMemoryRouter(appRoutes, {
    initialEntries: Array.isArray(initialEntries) ? initialEntries : [initialEntries],
    initialIndex,
  });

  return render(<RouterProvider router={router} />);
}

describe('app router', () => {
  beforeEach(() => {
    localStorage.clear();
    useCartStore.getState().reset();
    window.history.replaceState({ idx: 0 }, '', '/');
  });

  it('renders the catalog route and restores query state from the URL', async () => {
    renderAtRoute('/?search=Худи&inStock=true&sort=asc');

    expect(screen.getByText('Загружаем каталог')).toBeInTheDocument();
    expect(
      await screen.findByRole('heading', { name: 'Каталог товаров' }, { timeout: 5000 }),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue('Худи')).toBeInTheDocument();
    expect(screen.getByText('Активных фильтров: 3')).toBeInTheDocument();
    expect(screen.getByText('Фильтры каталога')).toBeInTheDocument();
  });

  it('renders product details and restores selected color and size from the URL', async () => {
    renderAtRoute('/products/1?color=2&size=4');

    expect(screen.getByText('Загружаем карточку товара')).toBeInTheDocument();
    expect(
      await screen.findByRole('heading', { name: 'Футболка' }, { timeout: 5000 }),
    ).toBeInTheDocument();
    expect(screen.getByText('Выбран: L')).toBeInTheDocument();
  });

  it('falls back from an unavailable color to the first available color', async () => {
    renderAtRoute('/products/1?color=3&size=1');

    expect(
      await screen.findByRole('heading', { name: 'Футболка' }, { timeout: 5000 }),
    ).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'черный' })).toHaveAttribute('data-state', 'on');
    expect(screen.getByRole('radio', { name: 'XS' })).toHaveAttribute('data-state', 'on');
  });

  it('renders unavailable product details without switching to notFound', async () => {
    renderAtRoute('/products/6');

    expect(
      await screen.findByRole('heading', { name: 'Пальто' }, { timeout: 5000 }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Товар не найден')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Нет в наличии');
    expect(screen.getByRole('button', { name: 'Нет в наличии' })).toBeDisabled();
    expect(screen.getByText('Нет доступных размеров')).toBeInTheDocument();
  });

  it('shows a not found state for an unknown product', async () => {
    const view = renderAtRoute('/products/999');

    expect(await screen.findByText('Товар не найден', {}, { timeout: 5000 })).toBeInTheDocument();
    expect(view.container.querySelector('[data-slot="empty"]')).toBeInTheDocument();
  });

  it('navigates back from product notFound when history exists', async () => {
    const user = userEvent.setup();
    window.history.replaceState({ idx: 1 }, '', '/products/999');

    renderAtRoute(['/cart', '/products/999'], 1);

    expect(await screen.findByText('Товар не найден', {}, { timeout: 5000 })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Назад' }));

    expect(await screen.findByRole('heading', { name: 'Корзина' }, { timeout: 5000 })).toBeInTheDocument();
  });

  it('falls back to catalog from product notFound when history is empty', async () => {
    const user = userEvent.setup();
    window.history.replaceState({ idx: 0 }, '', '/products/999');

    renderAtRoute('/products/999');

    expect(await screen.findByText('Товар не найден', {}, { timeout: 5000 })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Назад' }));

    expect(
      await screen.findByRole('heading', { name: 'Каталог товаров' }, { timeout: 5000 }),
    ).toBeInTheDocument();
  });

  it('renders the cart route', async () => {
    const view = renderAtRoute('/cart');

    expect(await screen.findByRole('heading', { name: 'Корзина' }, { timeout: 5000 })).toBeInTheDocument();
    expect(view.container.querySelector('[data-slot="empty"]')).toBeInTheDocument();
  });
});
