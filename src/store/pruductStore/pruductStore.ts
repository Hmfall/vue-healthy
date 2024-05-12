import { defineStore } from 'pinia';
import type { Product } from '@/shared/types/product.types';
import useStorage from '@/shared/utils/useStorage';
import db from '../../../db.json';
import mapProduct from './utils/mapProduct';

interface State {
  products: Product[];
}

export const appProductStore = useStorage<Product[]>('products');

export const useProductStore = defineStore('product', {
  state: (): State => ({
    products: [],
  }),
  actions: {
    fetchProducts() {
      const products = db.map(mapProduct);
      const appProducts = appProductStore.get();

      if (appProducts) {
        this.products = [...products, ...appProducts];
      } else {
        this.products = products;
      }
    },
    addProduct(product: Product) {
      this.products.push(product);
      appProductStore.set(product, { merge: true, raw: true });
    },
  },
});
