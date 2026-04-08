import { ShoppingBag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import {
  selectCartTotal,
  selectCartUnitsCount,
  useCartStore,
} from '@/app/store/cart-store';
import { formatPrice } from '@/shared/lib/format-price';
import { routes } from '@/shared/lib/routing/routes';
import { Badge } from '@/shared/ui/components/badge';
import { buttonVariants } from '@/shared/ui/components/button';
import { cn } from '@/shared/lib/utils';

function AppNavButton({ active, label, to }: { active: boolean; label: string; to: string }) {
  return (
    <Link
      className={buttonVariants({
        size: 'sm',
        variant: active ? 'contrast' : 'ghost',
      })}
      to={to}
    >
      <span className={cn(active && 'text-background')}>{label}</span>
    </Link>
  );
}

export function AppHeader() {
  const location = useLocation();
  const pathname = location.pathname;
  const cartActive = pathname === routes.cart();
  const { total, unitsCount } = useCartStore(
    useShallow((state) => ({
      total: selectCartTotal(state),
      unitsCount: selectCartUnitsCount(state),
    })),
  );

  return (
    <header className="border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link className="text-lg font-semibold tracking-tight text-foreground" to={routes.home()}>
          Mini Catalog
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-2">
          <AppNavButton active={pathname === routes.home()} label="Каталог" to={routes.home()} />
          <Link
            className={cn(
              buttonVariants({
                size: 'sm',
                variant: cartActive ? 'contrast' : 'ghost',
              }),
              'min-w-0',
            )}
            to={routes.cart()}
          >
            <ShoppingBag className={cn(cartActive && 'text-background')} data-icon="inline-start" />
            <span className={cn(cartActive && 'text-background')}>Корзина</span>
            <Badge variant="secondary">{unitsCount}</Badge>
            <Badge variant={cartActive ? 'secondary' : 'outline'}>{formatPrice(total)}</Badge>
          </Link>
        </nav>
      </div>
    </header>
  );
}
