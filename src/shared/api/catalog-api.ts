import {
  getCategories,
  getProduct,
  getProductColor,
  getProducts,
  getSizes,
} from '@/services/api.js';
import type { CategoryDto, ProductColorDto, ProductDto, SizeDto } from './contracts';

export async function listProducts(): Promise<ProductDto[]> {
  return (await getProducts()) as ProductDto[];
}

export async function getProductById(productId: number | string): Promise<ProductDto> {
  return (await getProduct(productId)) as ProductDto;
}

export async function getProductColorById(
  productId: number | string,
  colorId: number | string,
): Promise<ProductColorDto> {
  return (await getProductColor(productId, colorId)) as ProductColorDto;
}

export async function listSizes(): Promise<SizeDto[]> {
  return (await getSizes()) as SizeDto[];
}

export async function listCategories(): Promise<CategoryDto[]> {
  return (await getCategories()) as CategoryDto[];
}
