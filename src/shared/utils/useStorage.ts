interface UseStorage<T> {
  get(): T | null;

  set(rawInit: null, options?: never): void;

  set(rawInit: T, options?: SetOptions<T>): void;

  set(rawInit: ArrayElement<T>, options: RequireKeys<SetOptions<T>, 'raw'>): void;
}

interface SetOptions<T> {
  merge?: T extends object ? true : never;
  raw?: T extends object ? true : never;
}

export default function useStorage<T>(key: string, storage: Storage = localStorage): UseStorage<T> {
  function get(): T | null {
    const storageValue = storage.getItem(key);
    return storageValue && JSON.parse(storageValue);
  }

  function write(value: unknown) {
    try {
      if (value === null) {
        storage.removeItem(key);
      } else {
        storage.setItem(key, JSON.stringify(value));
      }
    } catch (e) {
      console.log(e);
    }
  }

  function set(rawInit: null, options?: never): void;
  function set(rawInit: T, options?: SetOptions<T>): void;
  function set(rawInit: ArrayElement<T>, options: RequireKeys<SetOptions<T>, 'raw'>): void;
  function set(rawInit: unknown, options: SetOptions<T> = {}): void {
    const value = get() as unknown;

    if (rawInit === null) {
      if (value) {
        write(null);
      }
      return;
    }

    const valueIsArray = Array.isArray(value);
    const rawInitIsArray = Array.isArray(rawInit);

    if (value && options?.merge && typeof value === 'object' && typeof rawInit === 'object') {
      if (!valueIsArray) {
        write({ ...value, ...rawInit });
      } else {
        if (valueIsArray && rawInitIsArray) {
          write([...value, ...rawInit]);
        } else if (valueIsArray && !rawInitIsArray) {
          write([...value, rawInit]);
        }
      }
    } else {
      if (options?.raw && typeof rawInit === 'object') {
        write([rawInit]);
      } else if (rawInit) {
        write(rawInit);
      }
    }
  }

  return { set, get };
}
