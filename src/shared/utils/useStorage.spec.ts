import { afterEach, describe, expect, it } from 'vitest';
import type { AppSetting } from '@/shared/types/app.types';
import type { Product } from '@/shared/types/product.types';
import useStorage from '@/shared/utils/useStorage';

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

      store.set({ stats: { start: '20240420', end: '20240425' } });

      expect(store.get()).toEqual({ stats: { start: '20240420', end: '20240425' } });
    });

    it('should be set value with merge option equals true correctly', () => {
      store.set({ theme: 'dark' });

      expect(store.get()).toEqual({ theme: 'dark' });

      store.set({ stats: { start: '20240420', end: '20240425' } }, { merge: true });

      expect(store.get()).toEqual({ theme: 'dark', stats: { start: '20240420', end: '20240425' } });
    });

    // it('should be set value with raw option correctly', () => {
    //   store.set({ theme: 'dark' }, { raw: true });
    //
    //   expect(store.get()).toEqual({ theme: 'dark' });
    // });
  });

  describe('useStorage array prototype', () => {
    const store = useStorage<Product[]>('store');

    it('should be set value with merge option equals false correctly', () => {
      store.set([
        { name: 'productA', calories: 0, proteins: 0, fats: 0, carbs: 0 },
        { name: 'productB', calories: 0, proteins: 0, fats: 0, carbs: 0 },
      ]);

      expect(store.get()).toEqual([
        { name: 'productA', calories: 0, proteins: 0, fats: 0, carbs: 0 },
        { name: 'productB', calories: 0, proteins: 0, fats: 0, carbs: 0 },
      ]);

      store.set([{ name: 'productC', calories: 0, proteins: 0, fats: 0, carbs: 0 }]);

      expect(store.get()).toEqual([
        { name: 'productC', calories: 0, proteins: 0, fats: 0, carbs: 0 },
      ]);
    });

    it('should be set value with merge option equals true correctly', () => {
      store.set([{ name: 'productA', calories: 0, proteins: 0, fats: 0, carbs: 0 }]);

      expect(store.get()).toEqual([
        { name: 'productA', calories: 0, proteins: 0, fats: 0, carbs: 0 },
      ]);

      store.set(
        [
          { name: 'productB', calories: 0, proteins: 0, fats: 0, carbs: 0 },
          { name: 'productC', calories: 0, proteins: 0, fats: 0, carbs: 0 },
        ],
        { merge: true },
      );

      expect(store.get()).toEqual([
        { name: 'productA', calories: 0, proteins: 0, fats: 0, carbs: 0 },
        { name: 'productB', calories: 0, proteins: 0, fats: 0, carbs: 0 },
        { name: 'productC', calories: 0, proteins: 0, fats: 0, carbs: 0 },
      ]);
    });

    it('should be set value in case 1 with raw option correctly', () => {
      store.set(
        { name: 'productA', calories: 0, proteins: 0, fats: 0, carbs: 0 },
        { merge: true, raw: true },
      );

      expect(store.get()).toEqual([
        { name: 'productA', calories: 0, proteins: 0, fats: 0, carbs: 0 },
      ]);
    });

    it('should be set value in case 2 with raw option correctly', () => {
      store.set([
        { name: 'productA', calories: 0, proteins: 0, fats: 0, carbs: 0 },
        { name: 'productB', calories: 0, proteins: 0, fats: 0, carbs: 0 },
      ]);

      expect(store.get()).toEqual([
        { name: 'productA', calories: 0, proteins: 0, fats: 0, carbs: 0 },
        { name: 'productB', calories: 0, proteins: 0, fats: 0, carbs: 0 },
      ]);

      store.set(
        { name: 'productC', calories: 0, proteins: 0, fats: 0, carbs: 0 },
        { merge: true, raw: true },
      );

      expect(store.get()).toEqual([
        { name: 'productA', calories: 0, proteins: 0, fats: 0, carbs: 0 },
        { name: 'productB', calories: 0, proteins: 0, fats: 0, carbs: 0 },
        { name: 'productC', calories: 0, proteins: 0, fats: 0, carbs: 0 },
      ]);
    });

    it('should be set value in case 3 with raw option correctly', () => {
      store.set([
        { name: 'productA', calories: 0, proteins: 0, fats: 0, carbs: 0 },
        { name: 'productB', calories: 0, proteins: 0, fats: 0, carbs: 0 },
      ]);

      expect(store.get()).toEqual([
        { name: 'productA', calories: 0, proteins: 0, fats: 0, carbs: 0 },
        { name: 'productB', calories: 0, proteins: 0, fats: 0, carbs: 0 },
      ]);

      store.set({ name: 'productC', calories: 0, proteins: 0, fats: 0, carbs: 0 }, { raw: true });

      expect(store.get()).toEqual([
        { name: 'productC', calories: 0, proteins: 0, fats: 0, carbs: 0 },
      ]);
    });

    it('should be set value in case 4 with raw option correctly', () => {
      store.set([
        { name: 'productA', calories: 0, proteins: 0, fats: 0, carbs: 0 },
        { name: 'productB', calories: 0, proteins: 0, fats: 0, carbs: 0 },
      ]);

      expect(store.get()).toEqual([
        { name: 'productA', calories: 0, proteins: 0, fats: 0, carbs: 0 },
        { name: 'productB', calories: 0, proteins: 0, fats: 0, carbs: 0 },
      ]);

      store.set({ name: 'productC', calories: 0, proteins: 0, fats: 0, carbs: 0 }, { raw: true });

      expect(store.get()).toEqual([
        { name: 'productC', calories: 0, proteins: 0, fats: 0, carbs: 0 },
      ]);
    });
  });
});
