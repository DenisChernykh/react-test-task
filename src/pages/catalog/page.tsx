import { SearchIcon } from 'lucide-react';
import { routes } from '@/shared/lib/routing/routes';
import { AsyncState } from '@/shared/ui/async-state';
import { useCatalogPageBoundary } from './model/use-catalog-page-boundary';
import { CatalogFiltersCard } from './ui/catalog-filters-card';
import { CatalogResultsGrid } from './ui/catalog-results-grid';
import { CatalogResultsHeader } from './ui/catalog-results-header';

export default function CatalogPage() {
  const { actions, errorMessage, products, query, status } = useCatalogPageBoundary();

  return (
    <div className="flex w-full flex-col gap-8">
      <section className="space-y-3">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Каталог товаров</h1>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Выберите подходящую модель, цвет и размер, а затем добавьте нужный вариант в
            корзину.
          </p>
        </div>
      </section>

      <CatalogFiltersCard actions={actions} query={query} />

      <section className="space-y-4">
        <CatalogResultsHeader productCount={products.length} query={query} />

        {status === 'loading' ? (
          <AsyncState
            description="Подтягиваем товары и готовим карточки каталога."
            skeletonPreset="catalog"
            title="Загружаем каталог"
            variant="loading"
          />
        ) : null}

        {status === 'error' ? (
          <AsyncState
            action={{ label: 'Повторить позже', to: routes.home() }}
            description={errorMessage}
            title="Не удалось загрузить каталог"
            variant="error"
          />
        ) : null}

        {status === 'ready' && products.length === 0 ? (
          <AsyncState
            description="Попробуйте изменить запрос, фильтр наличия или сортировку."
            icon={<SearchIcon />}
            title="Ничего не найдено"
            variant="empty"
          />
        ) : null}

        {status === 'ready' && products.length > 0 ? <CatalogResultsGrid products={products} /> : null}
      </section>
    </div>
  );
}
