import { useCallback, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

function useHashTrigger(hash: string, onClose?: Function, onOpen?: Function) {
  const history = useHistory();
  const hasHash = useCallback(() => history.location.hash.includes(hash), [hash, history]);

  const open = useCallback(() => {
    if (!hasHash()) {
      history.push({
        hash,
        state: history.location.state,
        search: history.location.search,
        pathname: history.location.pathname,
      });
    }
    onOpen?.();
  }, [hash, hasHash, history, onOpen]);

  const close = useCallback(() => {
    if (hasHash()) {
      history.goBack();
    }
    onClose?.();
  }, [hasHash, history, onClose]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (hasHash()) {
        open();
      } else {
        close();
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [hasHash, open, close, history.location.hash]);

  return useMemo(
    () => ({
      open,
      close,
    }),
    [open, close],
  );
}

export default useHashTrigger;
