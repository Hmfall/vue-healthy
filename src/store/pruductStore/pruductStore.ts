import { defineStore } from 'pinia';
import type { Product } from '@/shared/types';
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
        this.products = products.concat(appProducts).sort((a, b) => a.name.localeCompare(b.name));
      } else {
        this.products = products.sort((a, b) => a.name.localeCompare(b.name));
      }
    },
    addProduct(product: Product) {
      this.products = this.products.concat(product).sort((a, b) => a.name.localeCompare(b.name));
      appProductStore.set(product, { merge: true, raw: true });
    },
  },
});
