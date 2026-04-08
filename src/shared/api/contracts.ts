export type SizeDto = {
  id: number;
  name: string;
  number: number;
};

export type CategoryDto = {
  id: number;
  name: string;
};

export type ProductColorDto = {
  id: number;
  name: string;
  images: string[];
  price: string;
  description: string;
  sizes: number[];
};

export type ProductDto = {
  id: number;
  name: string;
  categoryId: number;
  brand: string;
  colors: ProductColorDto[];
};

export type SortDirection = 'asc' | 'desc';
