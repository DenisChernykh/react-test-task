import { formatPrice } from '@/shared/lib/format-price';
import { Card, CardContent, CardDescription, CardTitle } from '@/shared/ui/components/card';

type CartHeaderProps = {
  total: number;
  unitsCount: number;
};

export function CartHeader({ total, unitsCount }: CartHeaderProps) {
  return (
    <Card className="rounded-[2rem]">
      <CardContent className="flex flex-col gap-6 px-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <CardTitle>
            <h1 className="text-3xl tracking-tight">Корзина</h1>
          </CardTitle>
          <CardDescription>
            Проверьте выбранные позиции и при необходимости измените количество товаров.
          </CardDescription>
        </div>

        <div className="space-y-1 md:text-right">
          <p className="text-sm text-muted-foreground">Товаров: {unitsCount}</p>
          <p className="text-2xl font-semibold">{formatPrice(total)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
