import { routePaths } from './route-paths';

export const routes = {
  home() {
    return routePaths.home;
  },

  productDetails(productId: number | string) {
    return routePaths.products.details.replace(':productId', String(productId));
  },

  cart() {
    return routePaths.cart.root;
  },
} as const;
