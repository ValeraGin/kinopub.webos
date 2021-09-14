import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import useApiMutation from 'hooks/useApiMutation';
import useDeviceInfo from 'hooks/useDeviceInfo';
import useStorageState from 'hooks/useStorageState';
import { PATHS, generatePath } from 'routes';

import { logException } from 'utils/logging';

export type AuthorizationStep = 'processing' | 'pair' | 'authorized';

function useDeviceAuthorizationEffect(onAuthorization?: (authorizationStep: AuthorizationStep) => void) {
  const history = useHistory();
  const deviceInfo = useDeviceInfo();
  const { deviceAuthorizationAsync } = useApiMutation('deviceAuthorization');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLogged] = useStorageState<boolean>('is_logged');

  const handleOnConfirm = useCallback(
    (userCode: string, verificationUri: string) =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          history.replace(
            generatePath(PATHS.Pair, null, {
              userCode,
              verificationUri,
            }),
          );
          onAuthorization?.('pair');
          resolve();
        });
      }),
    [history, onAuthorization],
  );

  useEffect(() => {
    if (!isLogged) {
      setIsAuthorized(false);
    }
  }, [isLogged]);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      try {
        if (!isAuthorized) {
          onAuthorization?.('processing');
          await deviceAuthorizationAsync([deviceInfo, handleOnConfirm]);
          setIsAuthorized(true);
        }
        onAuthorization?.('authorized');
      } catch (ex) {
        logException(ex);
      }
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isLogged, isAuthorized, deviceInfo, onAuthorization, handleOnConfirm, deviceAuthorizationAsync]);
}

export default useDeviceAuthorizationEffect;
