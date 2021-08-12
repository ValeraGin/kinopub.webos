export type Value = string | number | boolean | null;

export type Key =
  | 'is_logged'
  | 'access_token'
  | 'refresh_token'
  | 'streaming_type'
  | 'is_hls.js_active'
  | 'is_abc3_by_default_active'
  | `item_${string}_saved_audio_name`
  | `item_${string}_saved_source_name`
  | `item_${string}_saved_subtitle_name`;

function getItem(prefix: string, key: string) {
  const data = JSON.parse(window.localStorage.getItem(prefix) || '{}') || {};

  const { value, expire } = data[key] || {};

  if (expire && Date.now() > expire) {
    return null;
  }

  return value;
}

function setItem(prefix: string, key: string, value?: Value, expire?: number) {
  const data = JSON.parse(window.localStorage.getItem(prefix) || '{}') || {};

  window.localStorage.setItem(
    prefix,
    JSON.stringify({
      ...data,
      [key]:
        typeof value !== 'undefined'
          ? {
              value,
              expire: expire ? Date.now() + expire * 1000 : undefined,
            }
          : undefined,
    }),
  );
}

function removeItem(prefix: string, key: string) {
  return setItem(prefix, key);
}

export class Storage<TKeys extends string = string> {
  private prefix: string;
  private listeners: (() => void)[];

  constructor(prefix: string) {
    this.prefix = prefix;
    this.listeners = [];
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
    return getItem(this.prefix, key);
  };

  setItem = <T extends Value>(key: TKeys, value: T, expire?: number) => {
    const item = setItem(this.prefix, key, value, expire);

    this.emit();

    return item;
  };

  removeItem = (key: TKeys) => {
    removeItem(this.prefix, key);

    this.emit();
  };
}

export default new Storage<Key>('kinopub');
