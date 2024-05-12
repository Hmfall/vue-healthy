export interface Summary {
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
}

export interface ProductDto {
  name: string;
  calories: string;
  proteins: string;
  fats: string;
  carbs: string;
}

export interface Product extends Summary {
  name: string;
}
