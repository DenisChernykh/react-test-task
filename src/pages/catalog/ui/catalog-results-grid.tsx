import type { Product } from '@/entities/product/model/product';
import { CatalogProductCard } from './catalog-product-card';

type CatalogResultsGridProps = {
  products: Product[];
};

export function CatalogResultsGrid({ products }: CatalogResultsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <CatalogProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
