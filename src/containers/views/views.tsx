import { Switch, useHistory } from 'react-router-dom';
import { Panels, PanelsProps } from '@enact/moonstone/Panels';
import styled from 'styled-components';

import useBackButtonEffect from 'hooks/useBackButtonEffect';
import useDeviceAuthorizationEffect from 'hooks/useDeviceAuthorizationEffect';

const StyledPanels = styled(Panels)`
  article {
    padding: 0;
  }
`;

type Props = {} & PanelsProps;

const Views: React.FC<Props> = ({ children, ...props }) => {
  const history = useHistory();

  useBackButtonEffect(history.goBack);
  useDeviceAuthorizationEffect();

  return (
    <StyledPanels noCloseButton {...props}>
      <Switch>{children}</Switch>
    </StyledPanels>
  );
};

export default Views;
