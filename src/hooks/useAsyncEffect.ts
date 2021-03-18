import { useEffect } from 'react';

function useAsyncEffect(effect: () => Promise<Function | void>, deps?: React.DependencyList): void {
  useEffect(() => {
    let destroyHandler: Function | void;

    (async () => {
      destroyHandler = await effect();
    })();

    return () => {
      if (destroyHandler instanceof Function) {
        destroyHandler();
      }
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}

export default useAsyncEffect;
