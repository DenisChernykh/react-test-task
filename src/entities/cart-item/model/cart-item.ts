export type CartItem = {
  id: string;
  productId: number;
  productName: string;
  colorId: number;
  colorName: string;
  sizeId: number;
  sizeName: string;
  image: string;
  price: number;
  quantity: number;
};

export type AddCartItemInput = Omit<CartItem, 'id' | 'quantity'>;

export function buildCartItemId(input: Pick<CartItem, 'productId' | 'colorId' | 'sizeId'>) {
  return `${input.productId}:${input.colorId}:${input.sizeId}`;
}

export function createCartItem(input: AddCartItemInput): CartItem {
  return {
    ...input,
    id: buildCartItemId(input),
    quantity: 1,
  };
}
