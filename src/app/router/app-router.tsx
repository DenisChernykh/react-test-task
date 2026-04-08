import { Suspense, type ReactNode } from 'react';
import { AppLayout } from '@/app/layouts/app-layout';
import { routePaths } from '@/shared/lib/routing/route-paths';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  type RouteObject,
} from 'react-router-dom';
import {
  CartPageRoute,
  CatalogPageRoute,
  NotFoundPageRoute,
  ProductDetailsPageRoute,
} from './lazy-pages';
import { RouteLoadingFallback } from './route-loading-fallback';

function withRouteFallback(page: ReactNode, fallback: ReactNode) {
  return <Suspense fallback={fallback}>{page}</Suspense>;
}

export const appRoutes: RouteObject[] = createRoutesFromElements(
  <Route element={<AppLayout />}>
    <Route
      index
      element={withRouteFallback(
        <CatalogPageRoute />,
        <RouteLoadingFallback
          description="Подтягиваем товары и собираем карточки каталога."
          skeletonPreset="catalog"
          title="Загружаем каталог"
        />,
      )}
    />
    <Route
      path={routePaths.home}
      element={withRouteFallback(
        <CatalogPageRoute />,
        <RouteLoadingFallback
          description="Подтягиваем товары и собираем карточки каталога."
          skeletonPreset="catalog"
          title="Загружаем каталог"
        />,
      )}
    />
    <Route
      path={routePaths.products.details}
      element={withRouteFallback(
        <ProductDetailsPageRoute />,
        <RouteLoadingFallback
          description="Готовим фотографии, цвета и размеры."
          skeletonPreset="product"
          title="Загружаем карточку товара"
        />,
      )}
    />
    <Route
      path={routePaths.cart.root}
      element={withRouteFallback(
        <CartPageRoute />,
        <RouteLoadingFallback
          description="Собираем актуальные позиции корзины."
          skeletonPreset="cart"
          title="Загружаем корзину"
        />,
      )}
    />
    <Route
      path="*"
      element={withRouteFallback(
        <NotFoundPageRoute />,
        <RouteLoadingFallback title="Проверяем маршрут" />,
      )}
    />
  </Route>,
);

export const appRouter = createBrowserRouter(appRoutes);
