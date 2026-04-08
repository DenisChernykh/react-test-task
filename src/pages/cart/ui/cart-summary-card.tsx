import { useState } from 'react';
import { X } from 'lucide-react';
import { formatPrice } from '@/shared/lib/format-price';
import { toast } from 'sonner';
import type { AppliedPromo, ApplyPromoResult } from '@/app/store/cart-promo';
import { Badge } from '@/shared/ui/components/badge';
import { Button } from '@/shared/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/components/card';
import { Input } from '@/shared/ui/components/input';
import { Separator } from '@/shared/ui/components/separator';

type CartSummaryCardProps = {
  appliedPromo: AppliedPromo | null;
  discount: number;
  onApplyPromo: (code: string) => ApplyPromoResult;
  onClear: () => void;
  onClearPromo: () => void;
  subtotal: number;
  total: number;
  unitsCount: number;
};

export function CartSummaryCard({
  appliedPromo,
  discount,
  onApplyPromo,
  onClear,
  onClearPromo,
  subtotal,
  total,
  unitsCount,
}: CartSummaryCardProps) {
  const [promoCode, setPromoCode] = useState('');

  const handleApplyPromo = () => {
    const result = onApplyPromo(promoCode);

    if (!result.success) {
      toast.error(result.errorMessage);
      return;
    }

    setPromoCode('');
    toast.success('Промокод применён.', {
      description: result.promo.code,
    });
  };

  return (
    <Card className="h-fit rounded-3xl">
      <CardHeader>
        <CardTitle>Сводка</CardTitle>
        <CardDescription>Всего единиц товара: {unitsCount}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            onChange={(event) => setPromoCode(event.target.value)}
            placeholder="Введите промокод"
            value={promoCode}
          />
          <Button
            disabled={!promoCode.trim()}
            onClick={handleApplyPromo}
            type="button"
            variant="outline"
          >
            Применить
          </Button>
        </div>

        {appliedPromo ? (
          <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/60 px-3 py-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{appliedPromo.code}</Badge>
              <span className="text-sm text-muted-foreground">
                {appliedPromo.type === 'percent'
                  ? `Скидка ${appliedPromo.amount}%`
                  : `Скидка ${formatPrice(appliedPromo.amount)}`}
              </span>
            </div>
            <Button onClick={onClearPromo} size="icon-sm" type="button" variant="ghost">
              <X />
            </Button>
          </div>
        ) : null}

        <Separator />

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Товары</span>
          <span className="font-semibold">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Скидка</span>
          <span className="font-semibold">{discount > 0 ? `-${formatPrice(discount)}` : formatPrice(0)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Итог</span>
          <span className="text-lg font-semibold">{formatPrice(total)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={onClear} type="button" variant="outline">
          Очистить корзину
        </Button>
      </CardFooter>
    </Card>
  );
}
