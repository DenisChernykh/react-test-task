import { ShoppingBagIcon } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import {
  selectAppliedPromo,
  selectCartDiscount,
  selectCartSubtotal,
  selectCartTotal,
  selectCartUnitsCount,
  useCartStore,
} from '@/app/store/cart-store';
import { routes } from '@/shared/lib/routing/routes';
import { AsyncState } from '@/shared/ui/async-state';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/components/alert';
import { useCartAvailability } from './model/use-cart-availability';
import { CartHeader } from './ui/cart-header';
import { CartItemCard } from './ui/cart-item-card';
import { CartSummaryCard } from './ui/cart-summary-card';

export default function CartPage() {
  const {
    appliedPromo,
    applyPromo,
    clear,
    clearPromo,
    discount,
    items,
    removeItem,
    setQuantity,
    subtotal,
    total,
    unitsCount,
  } = useCartStore(
    useShallow((state) => ({
      appliedPromo: selectAppliedPromo(state),
      applyPromo: state.applyPromo,
      clear: state.clear,
      clearPromo: state.clearPromo,
      discount: selectCartDiscount(state),
      items: state.items,
      removeItem: state.removeItem,
      setQuantity: state.setQuantity,
      subtotal: selectCartSubtotal(state),
      total: selectCartTotal(state),
      unitsCount: selectCartUnitsCount(state),
    })),
  );
  const { items: itemsWithAvailability, unavailableCount } = useCartAvailability(items);

  return (
    <div className="flex w-full flex-col gap-6">
      <CartHeader total={total} unitsCount={unitsCount} />

      {items.length === 0 ? (
        <AsyncState
          action={{ label: 'Перейти в каталог', to: routes.home() }}
          description="Добавьте товары из каталога, чтобы они появились в корзине."
          icon={<ShoppingBagIcon />}
          title="Корзина пока пуста"
          variant="empty"
        />
      ) : null}

      {items.length > 0 ? (
        <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {unavailableCount > 0 ? (
              <Alert variant="destructive">
                <AlertTitle>В корзине есть недоступные товары</AlertTitle>
                <AlertDescription>
                  {unavailableCount === 1
                    ? 'Один вариант больше нельзя купить в выбранной комплектации.'
                    : `Недоступных вариантов: ${unavailableCount}. Проверьте карточки ниже.`}
                </AlertDescription>
              </Alert>
            ) : null}

            {itemsWithAvailability.map(({ available, item }) => (
              <CartItemCard
                available={available}
                item={item}
                key={item.id}
                onRemove={removeItem}
                onSetQuantity={setQuantity}
              />
            ))}
          </div>

          <CartSummaryCard
            appliedPromo={appliedPromo}
            discount={discount}
            onApplyPromo={applyPromo}
            onClear={clear}
            onClearPromo={clearPromo}
            subtotal={subtotal}
            total={total}
            unitsCount={unitsCount}
          />
        </section>
      ) : null}
    </div>
  );
}
