import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem } from '@/entities/cart-item/model/cart-item';
import { formatPrice } from '@/shared/lib/format-price';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/components/alert';
import { Badge } from '@/shared/ui/components/badge';
import { Button } from '@/shared/ui/components/button';
import { Card, CardContent } from '@/shared/ui/components/card';
import { Separator } from '@/shared/ui/components/separator';

type CartItemCardProps = {
  available: boolean;
  item: CartItem;
  onRemove: (itemId: string) => void;
  onSetQuantity: (itemId: string, quantity: number) => void;
};

export function CartItemCard({ available, item, onRemove, onSetQuantity }: CartItemCardProps) {
  return (
    <Card className={available ? 'rounded-3xl' : 'rounded-3xl border-destructive/30'}>
      <CardContent className="grid gap-4 px-6 md:grid-cols-[140px_1fr]">
        <div className="overflow-hidden rounded-2xl bg-muted">
          <img
            alt={item.productName}
            className={available ? 'aspect-square w-full object-cover' : 'aspect-square w-full object-cover opacity-60 grayscale'}
            src={item.image}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">{item.productName}</h2>
              <div className="flex flex-wrap gap-2">
                {!available ? <Badge variant="destructive">Нет в наличии</Badge> : null}
                <Badge variant="secondary">{item.colorName}</Badge>
                <Badge variant="outline">{item.sizeName}</Badge>
              </div>
            </div>

            <Button onClick={() => onRemove(item.id)} size="sm" type="button" variant="outline">
              <Trash2 data-icon="inline-start" />
              Удалить
            </Button>
          </div>

          <Separator />

          {!available ? (
            <Alert variant="destructive">
              <AlertTitle>Этот вариант сейчас недоступен</AlertTitle>
              <AlertDescription>
                Удалите его из корзины или вернитесь в каталог и выберите другой размер или цвет.
              </AlertDescription>
            </Alert>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-md border p-1">
              <Button
                disabled={!available}
                onClick={() => onSetQuantity(item.id, item.quantity - 1)}
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                <Minus />
              </Button>
              <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
              <Button
                disabled={!available}
                onClick={() => onSetQuantity(item.id, item.quantity + 1)}
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                <Plus />
              </Button>
            </div>

            <div className="space-y-1 text-right">
              <p className="text-sm text-muted-foreground">
                {formatPrice(item.price)} × {item.quantity}
              </p>
              <p className="text-lg font-semibold">{formatPrice(item.price * item.quantity)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
