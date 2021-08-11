import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import useApiMutation from 'hooks/useApiMutation';
import useDeviceInfo from 'hooks/useDeviceInfo';
import useStorageState from 'hooks/useStorageState';
import { PATHS } from 'routes';

function useDeviceAuthorizationEffect(onAuthorization?: (isAuthorized: boolean) => void) {
  const history = useHistory();
  const deviceInfo = useDeviceInfo();
  const { deviceAuthorizationAsync } = useApiMutation('deviceAuthorization');
  const { deviceNotify } = useApiMutation('deviceNotify');
  const [isLogged] = useStorageState<boolean>('is_logged');

  const handleOnConfirm = useCallback(
    (userCode: string, verificationUri: string) => {
      history.replace(PATHS.Pair, {
        userCode,
        verificationUri,
      });
    },
    [history],
  );

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      onAuthorization?.(false);

      await deviceAuthorizationAsync([handleOnConfirm]);

      onAuthorization?.(true);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isLogged, onAuthorization, handleOnConfirm, deviceAuthorizationAsync]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLogged) {
        deviceNotify([deviceInfo]);
      }
    }, 2 * 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isLogged, deviceInfo, deviceNotify]);
}

export default useDeviceAuthorizationEffect;
