import { useCallback, useEffect, useState } from 'react';

import { Value, createSessionStorage } from 'storage';

const sessionStorage = createSessionStorage();

function useSessionState<T extends Value>(key: string, defaultValue?: T) {
  const [value, _setValue] = useState<T>(sessionStorage.getItem<T>(key) ?? (defaultValue as T));
  const setValue = useCallback(
    (newValue: any, expire?: number) => {
      sessionStorage.setItem(key, newValue, expire);
    },
    [key],
  );

  useEffect(() => {
    const listener = () => {
      _setValue(sessionStorage.getItem<T>(key) ?? (defaultValue as T));
    };

    const unsubscribe = sessionStorage.subscribe(listener);

    listener();

    return unsubscribe;
  }, [key, defaultValue]);

  return [value, setValue] as const;
}

export default useSessionState;
