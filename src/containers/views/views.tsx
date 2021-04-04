import { useCallback, useEffect } from 'react';
import { Switch, useHistory } from 'react-router-dom';
import { Panels, PanelsProps } from '@enact/moonstone/Panels';
import styled from 'styled-components';

import useApiMutation from '../../hooks/useApiMutation';
import useDeviceInfo from '../../hooks/useDeviceInfo';
import useStorageState from '../../hooks/useStorageState';
import { PATHS } from '../../routes';

import { isBackButton } from '../../utils/keyboard';

const StyledPanels = styled(Panels)`
  article {
    padding: 0;
  }
`;

type Props = {} & PanelsProps;

const useBackButtonEffect = () => {
  const history = useHistory();

  useEffect(() => {
    const listiner = (e: KeyboardEvent) => {
      if (isBackButton(e)) {
        history.goBack();
      }
    };

    window.addEventListener('keydown', listiner);

    return () => {
      window.removeEventListener('keydown', listiner);
    };
  }, [history]);
};

const useDeviceAuthorizationEffect = () => {
  const history = useHistory();
  const deviceInfo = useDeviceInfo();
  const { deviceAuthorizationAsync } = useApiMutation('deviceAuthorization');
  const { deviceNotify } = useApiMutation('deviceNotify');
  const [isLogged] = useStorageState<boolean>('is_logged');

  const handleOnConfirm = useCallback(
    (userCode: string, verificationUri: string) => {
      history.push(PATHS.Pair, {
        userCode,
        verificationUri,
      });
    },
    [history],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      deviceNotify([deviceInfo]);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [deviceInfo, deviceNotify]);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (!isLogged) {
        await deviceAuthorizationAsync([deviceInfo, handleOnConfirm]);

        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isLogged, deviceInfo, handleOnConfirm, deviceAuthorizationAsync]);

  useEffect(() => {
    if (isLogged) {
      history.push(PATHS.Index);
    }
  }, [isLogged, history]);
};

const Views: React.FC<Props> = ({ children, ...props }) => {
  useBackButtonEffect();
  useDeviceAuthorizationEffect();

  return (
    <StyledPanels noCloseButton {...props}>
      <Switch>{children}</Switch>
    </StyledPanels>
  );
};

export default Views;
