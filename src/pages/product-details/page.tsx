import { useShallow } from 'zustand/react/shallow';
import { useNavigate } from 'react-router-dom';
import type { AddCartItemInput } from '@/entities/cart-item/model/cart-item';
import { selectCartLineCount, useCartStore } from '@/app/store/cart-store';
import { routes } from '@/shared/lib/routing/routes';
import { AsyncState } from '@/shared/ui/async-state';
import { toast } from 'sonner';
import { useProductDetailsPageBoundary } from './model/use-product-details-page-boundary';
import { ProductGallery } from './ui/product-gallery';
import { ProductPurchasePanel } from './ui/product-purchase-panel';

export default function ProductDetailsPage() {
  const navigate = useNavigate();
  const boundary = useProductDetailsPageBoundary();
  const { addItem, lineCount } = useCartStore(
    useShallow((state) => ({
      addItem: state.addItem,
      lineCount: selectCartLineCount(state),
    })),
  );

  const handleNavigateBack = () => {
    const historyIndex = window.history.state?.idx;
    const canGoBack =
      typeof historyIndex === 'number' ? historyIndex > 0 : window.history.length > 1;

    if (canGoBack) {
      navigate(-1);
      return;
    }

    navigate(routes.home(), { replace: true });
  };

  if (boundary.status === 'loading') {
    return (
      <AsyncState
        description="Загружаем фотографии, варианты цвета и доступные размеры."
        skeletonPreset="product"
        title="Загружаем карточку товара"
        variant="loading"
      />
    );
  }

  if (boundary.status === 'error') {
    return (
      <AsyncState
        action={{ label: 'Вернуться в каталог', to: routes.home() }}
        description={boundary.errorMessage}
        title="Не удалось загрузить товар"
        variant="error"
      />
    );
  }

  if (boundary.status === 'notFound') {
    return (
      <AsyncState
        action={{ label: 'Назад', onClick: handleNavigateBack }}
        description="Проверьте ссылку или вернитесь к списку товаров."
        title="Товар не найден"
        variant="notFound"
      />
    );
  }

  const { actions, product, purchaseState, selectedColor, selectedSize, sizes } = boundary;

  const handleAddToCart = () => {
    if (purchaseState === 'unavailable') {
      toast.error('Этот товар сейчас недоступен.', {
        description: 'Для него нет доступных размеров. Вернитесь в каталог и выберите другой.',
      });
      return;
    }

    if (!selectedSize) {
      toast.error('Сначала выберите размер.');
      return;
    }

    const cartItemInput: AddCartItemInput = {
      productId: product.id,
      productName: product.name,
      colorId: selectedColor.id,
      colorName: selectedColor.name,
      sizeId: selectedSize.id,
      sizeName: selectedSize.name,
      image: selectedColor.images[0] ?? '',
      price: selectedColor.price,
    };

    addItem(cartItemInput);

    toast.success('Товар добавлен в корзину.', {
      description: `${product.name}, ${selectedColor.name}, ${selectedSize.name}`,
    });
  };

  return (
    <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <ProductGallery
        key={selectedColor.id}
        images={selectedColor.images}
        productName={product.name}
      />
      <ProductPurchasePanel
        lineCount={lineCount}
        onAddToCart={handleAddToCart}
        onSelectColor={actions.selectColor}
        onSelectSize={actions.selectSize}
        purchaseState={purchaseState}
        product={product}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        sizes={sizes}
      />
    </div>
  );
}
