declare global {
  export type Nullable<T> = T | null;

  export type ArrayElement<T> = T extends readonly (infer E)[] ? E : never;

  export type RequireKeys<T extends object, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>;
}

/* eslint-disable */
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';

export {};
