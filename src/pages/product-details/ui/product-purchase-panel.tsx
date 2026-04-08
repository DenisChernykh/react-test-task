import { AlertCircleIcon, ArrowLeft, Check, PaletteIcon, RulerIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product, ProductColor, Size } from '@/entities/product/model/product';
import { formatPrice } from '@/shared/lib/format-price';
import { routes } from '@/shared/lib/routing/routes';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/components/alert';
import { Badge } from '@/shared/ui/components/badge';
import { Button, buttonVariants } from '@/shared/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/components/card';
import { Separator } from '@/shared/ui/components/separator';
import { ToggleGroup, ToggleGroupItem } from '@/shared/ui/components/toggle-group';
import type { ProductPurchaseState } from '../model/use-product-details-page-boundary';
import { ProductOptionGroup } from './product-option-group';

type ProductPurchasePanelProps = {
  lineCount: number;
  onAddToCart: () => void;
  onSelectColor: (colorId: number) => void;
  onSelectSize: (sizeId: number) => void;
  purchaseState: ProductPurchaseState;
  product: Product;
  selectedColor: ProductColor;
  selectedSize: Size | null;
  sizes: Size[];
};

export function ProductPurchasePanel({
  lineCount,
  onAddToCart,
  onSelectColor,
  onSelectSize,
  purchaseState,
  product,
  selectedColor,
  selectedSize,
  sizes,
}: ProductPurchasePanelProps) {
  const unavailable = purchaseState === 'unavailable';

  return (
    <Card className="rounded-[2rem]">
      <CardHeader className="gap-3">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="secondary">{product.brand}</Badge>
          <Link className={buttonVariants({ size: 'sm', variant: 'ghost' })} to={routes.home()}>
            <ArrowLeft data-icon="inline-start" />
            Назад
          </Link>
        </div>
        <div className="space-y-2">
          <CardTitle>
            <h1 className="text-3xl tracking-tight">{product.name}</h1>
          </CardTitle>
          <CardDescription className="text-base">{selectedColor.description}</CardDescription>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline">{selectedColor.name}</Badge>
          <p className="text-2xl font-semibold">{formatPrice(selectedColor.price)}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <ProductOptionGroup
          badgeLabel={`Выбран: ${selectedColor.name}`}
          label="Цвет"
          leadingIcon={<PaletteIcon />}
        >
          <ToggleGroup
            className="w-full flex-wrap gap-3"
            onValueChange={(value) => {
              if (value) {
                onSelectColor(Number(value));
              }
            }}
            type="single"
            value={String(selectedColor.id)}
            variant="outline"
          >
            {product.colors.map((color) => (
              <ToggleGroupItem disabled={!color.inStock} key={color.id} value={String(color.id)}>
                {color.name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </ProductOptionGroup>

        <Separator />

        <ProductOptionGroup
          badgeLabel={
            unavailable
              ? 'Нет доступных размеров'
              : selectedSize
                ? `Выбран: ${selectedSize.name}`
                : 'Размер не выбран'
          }
          label="Размер"
          leadingIcon={<RulerIcon />}
        >
          <ToggleGroup
            className="w-full flex-wrap gap-3"
            onValueChange={(value) => {
              if (value) {
                onSelectSize(Number(value));
              }
            }}
            type="single"
            value={selectedSize ? String(selectedSize.id) : ''}
            variant="outline"
          >
            {sizes.map((size) => (
              <ToggleGroupItem
                disabled={!selectedColor.sizeIds.includes(size.id)}
                key={size.id}
                value={String(size.id)}
              >
                {size.name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </ProductOptionGroup>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-3">
        {unavailable ? (
          <>
            <Alert>
              <AlertCircleIcon />
              <AlertTitle>Нет в наличии</AlertTitle>
              <AlertDescription>
                Этот товар сейчас недоступен. Для него нет доступных размеров.
              </AlertDescription>
            </Alert>
            <Button disabled size="lg" type="button" variant="contrast">
              Нет в наличии
            </Button>
            <Link className={buttonVariants({ size: 'lg', variant: 'outline' })} to={routes.home()}>
              Вернуться в каталог
            </Link>
          </>
        ) : (
          <>
            <Button onClick={onAddToCart} size="lg" type="button" variant="contrast">
              <Check data-icon="inline-start" />
              Добавить в корзину
            </Button>
            <p className="text-sm text-muted-foreground">
              Уникальных позиций в корзине сейчас: {lineCount}
            </p>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
