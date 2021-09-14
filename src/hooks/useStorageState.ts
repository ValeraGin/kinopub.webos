import { useCallback, useEffect, useState } from 'react';

import storage, { Key, Value } from 'storage';

function useStorageState<T extends Value = Value>(key: Key, defaultValue?: T) {
  const [value, _setValue] = useState<T>(storage.getItem<T>(key) ?? (defaultValue as T));
  const setValue = useCallback(
    (newValue: Value, expire?: number) => {
      storage.setItem(key, newValue, expire);
    },
    [key],
  );

  useEffect(() => {
    const listener = () => {
      _setValue(storage.getItem<T>(key) ?? (defaultValue as T));
    };

    const unsubscribe = storage.subscribe(listener);

    listener();

    return unsubscribe;
  }, [key, defaultValue]);

  return [value, setValue] as const;
}

export default useStorageState;
