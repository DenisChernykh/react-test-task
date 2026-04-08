import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '@/entities/product/model/product';
import { formatPrice } from '@/shared/lib/format-price';
import { routes } from '@/shared/lib/routing/routes';
import { Badge } from '@/shared/ui/components/badge';
import { buttonVariants } from '@/shared/ui/components/button';
import { Card, CardContent, CardFooter } from '@/shared/ui/components/card';

type CatalogProductCardProps = {
  product: Product;
};

export function CatalogProductCard({ product }: CatalogProductCardProps) {
  return (
    <Card className="rounded-3xl">
      <CardContent className="flex flex-col gap-5 px-6">
        <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
          <img
            alt={product.name}
            className="h-full w-full object-cover transition duration-300"
            src={product.colors[0]?.images[0]}
          />
        </div>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{product.brand}</Badge>
            {!product.inStock ? <Badge variant="destructive">Нет в наличии</Badge> : null}
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-sm text-muted-foreground">От {formatPrice(product.minPrice)}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link
          className={buttonVariants({ className: 'w-full', variant: 'contrast' })}
          to={routes.productDetails(product.id)}
        >
          <span className="text-background">{product.inStock ? 'Открыть карточку' : 'Подробнее'}</span>
          <ArrowRight className="text-background" data-icon="inline-end" />
        </Link>
      </CardFooter>
    </Card>
  );
}
