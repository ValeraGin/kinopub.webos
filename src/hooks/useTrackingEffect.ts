import { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import type { Action, Location, UnregisterCallback } from 'history';

import { IS_WEB } from 'utils/enviroment';

const mapActionToChangeSource = (action: Action) => {
  if (action === 'PUSH') {
    return 'pushState';
  }
  if (action === 'POP') {
    return 'popstate';
  }

  if (action === 'REPLACE') {
    return 'replaceState';
  }

  return action;
};

function useTrackingEffect() {
  const prevLocation = useRef<Location>(null);
  const { listen } = useHistory();

  useEffect(() => {
    let unlisten: UnregisterCallback;

    if (!IS_WEB) {
      unlisten = listen((location, action) => {
        // @ts-expect-error
        window.dataLayer?.push({
          event: 'gtm.historyChange-v2',
          'gtm.historyChangeSource': mapActionToChangeSource(action),
          'gtm.oldUrlFragment': prevLocation?.current?.hash,
          'gtm.newUrlFragment': location.hash,
          'gtm.oldHistoryState': prevLocation?.current?.state,
          'gtm.newHistoryState': location.state,
          'gtm.oldUrl': prevLocation?.current?.pathname,
          'gtm.newUrl': location.pathname,
          'gtm.triggers': ['1_36'].join(','),
        });
      });
    }

    return () => {
      unlisten?.();
    };
  }, [listen]);
}

export default useTrackingEffect;
