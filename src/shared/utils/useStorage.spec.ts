import { afterEach, describe, expect, it } from 'vitest';
import type { AppSetting, DateRange, Product, Theme } from '@/shared/types';
import useStorage from '@/shared/utils/useStorage';

const productA: Product = { name: 'productA', calories: 0, proteins: 0, fats: 0, carbs: 0 };
const productB: Product = { name: 'productB', calories: 0, proteins: 0, fats: 0, carbs: 0 };
const productC: Product = { name: 'productC', calories: 0, proteins: 0, fats: 0, carbs: 0 };
const stats: DateRange = { start: '20240420', end: '20240425' };

describe('useStorage', () => {
  afterEach(() => {
    localStorage.clear();
  });

  describe('useStorage primitives', () => {
    const store = useStorage<string>('store');

    it('should be called with correct key', () => {
      expect(store.get()).toBeNull();
    });

    it('should be set value correctly', () => {
      store.set('new string');

      expect(store.get()).toBe('new string');
    });

    it('should be remove value correctly', () => {
      store.set(null);

      expect(store.get()).toBeNull();
    });
  });

  describe('useStorage object prototype', () => {
    const store = useStorage<AppSetting>('store');

    it('should be set value in with merge option equals false correctly', () => {
      store.set({ theme: 'dark' });

      expect(store.get()).toEqual({ theme: 'dark' });

      store.set({ stats });

      expect(store.get()).toEqual({ stats });
    });

    it('should be set value with merge option equals true correctly', () => {
      store.set({ theme: 'dark' });

      expect(store.get()).toEqual({ theme: 'dark' });

      store.set({ stats }, { merge: true });

      expect(store.get()).toEqual({ theme: 'dark', stats });
    });
  });

  describe('useStorage array prototype', () => {
    const store = useStorage<Product[]>('store');

    it('should be set value with merge option equals false correctly', () => {
      store.set([productA, productB]);

      expect(store.get()).toEqual([productA, productB]);

      store.set([productC]);

      expect(store.get()).toEqual([productC]);
    });

    it('should be set value with merge option equals true correctly', () => {
      store.set([productA]);

      expect(store.get()).toEqual([productA]);

      store.set([productB, productC], { merge: true });

      expect(store.get()).toEqual([productA, productB, productC]);
    });

    it('should be set value in case 1 with raw option correctly', () => {
      store.set(productA, { merge: true, raw: true });

      expect(store.get()).toEqual([productA]);
    });

    it('should be set value in case 2 with raw option correctly', () => {
      store.set([productA, productB]);

      expect(store.get()).toEqual([productA, productB]);

      store.set(productC, { merge: true, raw: true });

      expect(store.get()).toEqual([productA, productB, productC]);
    });

    it('should be set value in case 3 with raw option correctly', () => {
      store.set([productA, productB]);

      expect(store.get()).toEqual([productA, productB]);

      store.set(productC, { raw: true });

      expect(store.get()).toEqual([productC]);
    });

    it('should be set value in case 4 with raw option correctly', () => {
      store.set([productA, productB]);

      expect(store.get()).toEqual([productA, productB]);

      store.set(productC, { raw: true });

      expect(store.get()).toEqual([productC]);
    });
  });
});
