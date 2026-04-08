import { SlidersHorizontalIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/components/card';
import { Checkbox } from '@/shared/ui/components/checkbox';
import { Field, FieldGroup, FieldLabel } from '@/shared/ui/components/field';
import { Input } from '@/shared/ui/components/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/components/select';

type CatalogFiltersCardProps = {
  query: {
    search: string;
    inStock: boolean;
    sort: 'asc' | 'desc' | null;
  };
  actions: {
    setSearch: (search: string) => void;
    setInStock: (inStock: boolean) => void;
    setSort: (sort: 'asc' | 'desc' | '') => void;
  };
};

export function CatalogFiltersCard({ actions, query }: CatalogFiltersCardProps) {
  const sortValue = query.sort ?? 'none';

  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SlidersHorizontalIcon />
          Фильтры каталога
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup className="gap-6 md:grid md:grid-cols-3 md:items-start">
          <Field>
            <FieldLabel htmlFor="catalog-search">Поиск</FieldLabel>
            <Input
              id="catalog-search"
              onChange={(event) => actions.setSearch(event.target.value)}
              placeholder="Например, худи"
              value={query.search}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="catalog-in-stock">Наличие</FieldLabel>
            <label className="flex min-h-9 items-start gap-3 py-2" htmlFor="catalog-in-stock">
              <Checkbox
                checked={query.inStock}
                id="catalog-in-stock"
                onCheckedChange={(checked) => actions.setInStock(checked === true)}
              />
              <span className="block text-sm font-medium leading-none">Только в наличии</span>
            </label>
          </Field>

          <Field>
            <FieldLabel htmlFor="catalog-sort">Сортировка по цене</FieldLabel>
            <Select
              onValueChange={(value) =>
                actions.setSort(value === 'none' ? '' : (value as 'asc' | 'desc'))
              }
              value={sortValue}
            >
              <SelectTrigger id="catalog-sort" className="w-full">
                <SelectValue placeholder="Без сортировки" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="none">Без сортировки</SelectItem>
                  <SelectItem value="asc">Сначала дешевле</SelectItem>
                  <SelectItem value="desc">Сначала дороже</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
