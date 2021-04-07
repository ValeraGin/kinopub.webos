import { useEffect } from 'react';
import { Switch, useHistory } from 'react-router-dom';
import { Panels, PanelsProps } from '@enact/moonstone/Panels';
import styled from 'styled-components';

import useDeviceAuthorizationEffect from 'hooks/useDeviceAuthorizationEffect';

import { isBackButton } from 'utils/keyboard';

const StyledPanels = styled(Panels)`
  article {
    padding: 0;
  }
`;

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

type Props = {} & PanelsProps;

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
