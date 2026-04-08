import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AsyncState } from './async-state';

describe('AsyncState', () => {
  it('renders loading with spinner and skeleton preset', () => {
    const { container } = render(
      <AsyncState
        description="Подтягиваем товары"
        skeletonPreset="catalog"
        title="Загружаем каталог"
        variant="loading"
      />,
    );

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
    expect(screen.getByText('Загружаем каталог')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);
  });

  it('renders destructive alert with link action', () => {
    render(
      <MemoryRouter>
        <AsyncState
          action={{ label: 'Вернуться в каталог', to: '/' }}
          description="Сервис недоступен"
          title="Не удалось загрузить каталог"
          variant="error"
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Не удалось загрузить каталог')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Вернуться в каталог' })).toBeInTheDocument();
  });

  it('renders empty state content', () => {
    render(
      <MemoryRouter>
        <AsyncState
          action={{ label: 'Перейти в каталог', to: '/' }}
          description="В корзине пока ничего нет."
          title="Корзина пуста"
          variant="empty"
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Корзина пуста')).toBeInTheDocument();
    expect(screen.getByText('В корзине пока ничего нет.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Перейти в каталог' })).toBeInTheDocument();
  });

  it('renders not found state with action', () => {
    render(
      <MemoryRouter>
        <AsyncState
          action={{ label: 'Назад в каталог', to: '/' }}
          description="Проверьте ссылку."
          title="Товар не найден"
          variant="notFound"
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Товар не найден')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Назад в каталог' })).toBeInTheDocument();
  });
});
