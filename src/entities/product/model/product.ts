import type {
  CategoryDto,
  ProductColorDto,
  ProductDto,
  SizeDto,
} from '@/shared/api/contracts';

export type Size = {
  id: number;
  name: string;
  number: number;
};

export type Category = {
  id: number;
  name: string;
};

export type ProductColor = {
  id: number;
  name: string;
  images: string[];
  price: number;
  description: string;
  sizeIds: number[];
  inStock: boolean;
};

export type Product = {
  id: number;
  name: string;
  categoryId: number;
  brand: string;
  colors: ProductColor[];
  minPrice: number;
  inStock: boolean;
};

export function mapSizeDto(size: SizeDto): Size {
  return {
    id: size.id,
    name: size.name,
    number: size.number,
  };
}

export function mapCategoryDto(category: CategoryDto): Category {
  return {
    id: category.id,
    name: category.name,
  };
}

export function mapProductColorDto(color: ProductColorDto): ProductColor {
  return {
    id: color.id,
    name: color.name,
    images: color.images,
    price: Number(color.price),
    description: color.description,
    sizeIds: color.sizes,
    inStock: color.sizes.length > 0,
  };
}

export function mapProductDto(product: ProductDto): Product {
  const colors: ProductColor[] = [];
  let minPrice = 0;
  let hasColor = false;
  let inStock = false;

  for (const color of product.colors) {
    const mappedColor = mapProductColorDto(color);

    colors.push(mappedColor);

    if (!hasColor || mappedColor.price < minPrice) {
      minPrice = mappedColor.price;
    }

    if (mappedColor.inStock) {
      inStock = true;
    }

    hasColor = true;
  }

  return {
    id: product.id,
    name: product.name,
    categoryId: product.categoryId,
    brand: product.brand,
    colors,
    minPrice,
    inStock,
  };
}

export function mapProducts(products: ProductDto[]): Product[] {
  return products.map(mapProductDto);
}

export function mapSizes(sizes: SizeDto[]): Size[] {
  return sizes.map(mapSizeDto);
}

export function mapCategories(categories: CategoryDto[]): Category[] {
  return categories.map(mapCategoryDto);
}

export function isProductColorInStock(color: ProductColor) {
  return color.inStock;
}

export function isProductInStock(product: Product) {
  return product.inStock;
}

export function getProductMinPrice(product: Product) {
  return product.minPrice;
}

export function getProductColorById(product: Product, colorId: number | null) {
  if (colorId === null) {
    return product.colors[0] ?? null;
  }

  return product.colors.find((color) => color.id === colorId) ?? product.colors[0] ?? null;
}

export function getSizeById(sizes: Size[], sizeId: number | null) {
  if (sizeId === null) {
    return null;
  }

  return sizes.find((size) => size.id === sizeId) ?? null;
}
