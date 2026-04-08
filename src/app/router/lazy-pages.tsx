import { lazy } from 'react';

export const CartPageRoute = lazy(() => import('@/pages/cart/page'));
export const CatalogPageRoute = lazy(() => import('@/pages/catalog/page'));
export const NotFoundPageRoute = lazy(() => import('@/pages/not-found/page'));
export const ProductDetailsPageRoute = lazy(() => import('@/pages/product-details/page'));
