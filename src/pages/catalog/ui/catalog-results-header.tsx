import { Badge } from '@/shared/ui/components/badge';

type CatalogResultsHeaderProps = {
  productCount: number;
  query: {
    search: string;
    inStock: boolean;
    sort: 'asc' | 'desc' | null;
  };
};

export function CatalogResultsHeader({ productCount, query }: CatalogResultsHeaderProps) {
  const activeFiltersCount = Number(Boolean(query.search)) + Number(query.inStock) + Number(Boolean(query.sort));

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">
        {activeFiltersCount > 0 ? `Активных фильтров: ${activeFiltersCount}` : 'Все товары'}
      </p>
      <Badge variant="outline">Найдено: {productCount}</Badge>
    </div>
  );
}
