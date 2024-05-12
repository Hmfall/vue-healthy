import type { Product, ProductDto } from '@/shared/types/product.types';

export default function mapProduct(dto: ProductDto): Product {
  return {
    name: dto.name,
    calories: formatProduct(dto.calories),
    proteins: formatProduct(dto.proteins),
    fats: formatProduct(dto.fats),
    carbs: formatProduct(dto.carbs),
  };
}

const formatProduct = (str: string) => {
  return parseFloat(
    str
      .replace(',', '.')
      .replace(/[a-zA-Zа-яА-Я]+/g, '')
      .replace(/\s/g, ''),
  );
};
