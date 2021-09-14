export type Value = object | string | number | boolean | null;

export type Key =
  | 'is_logged'
  | 'access_token'
  | 'refresh_token'
  | 'streaming_type'
  | 'is_hls.js_active'
  | 'is_ac3_by_default_active'
  | 'is_forced_by_default_active'
  | 'is_pause_by_ok_click_active'
  | `item_${string}_saved_audio_name`
  | `item_${string}_saved_source_name`
  | `item_${string}_saved_subtitle_name`;

function getItem(storage: Storage, prefix: string, key: string) {
  const data = JSON.parse(storage.getItem(prefix) || '{}') || {};

  const { value, expire } = data[key] || {};

  if (expire && Date.now() > expire) {
    return null;
  }

  return value;
}

function setItem(storage: Storage, prefix: string, key: string, value?: Value, expire?: number) {
  const data = JSON.parse(storage.getItem(prefix) || '{}') || {};

  storage.setItem(
    prefix,
    JSON.stringify({
      ...data,
      [key]:
        typeof value !== 'undefined'
          ? {
              value,
              expire: typeof expire === 'number' ? Date.now() + expire * 1000 : undefined,
            }
          : undefined,
    }),
  );
}

function removeItem(storage: Storage, prefix: string, key: string) {
  return setItem(storage, prefix, key);
}

export class MyStorage<TKeys extends string = string> {
  private prefix: string;
  private listeners: (() => void)[];
  private storage: Storage;

  constructor(prefix: string, storage: Storage = window.localStorage) {
    this.prefix = prefix;
    this.listeners = [];
    this.storage = storage;
  }

  private emit() {
    requestAnimationFrame(() => {
      this.listeners.forEach((listener) => listener());
    });
  }

  subscribe = (listener: () => void) => {
    this.listeners = [...this.listeners, listener];

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  };

  getItem = <T extends Value>(key: TKeys): T => {
    return getItem(this.storage, this.prefix, key);
  };

  setItem = <T extends Value>(key: TKeys, value: T, expire?: number) => {
    const item = setItem(this.storage, this.prefix, key, value, expire);

    this.emit();

    return item;
  };

  removeItem = (key: TKeys) => {
    removeItem(this.storage, this.prefix, key);

    this.emit();
  };
}

export default new MyStorage<Key>('kinopub');

export const createSessionStorage = <Key extends string>(prefix: string = 'kinopub') => new MyStorage<Key>(prefix, window.sessionStorage);
