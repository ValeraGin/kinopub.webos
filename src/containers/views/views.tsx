import { Switch, useHistory } from 'react-router-dom';

import useBackButtonEffect from 'hooks/useBackButtonEffect';
import useDeviceAuthorizationEffect from 'hooks/useDeviceAuthorizationEffect';

const Views: React.FC = ({ children, ...props }) => {
  const history = useHistory();

  useBackButtonEffect(history.goBack);
  useDeviceAuthorizationEffect();

  return (
    <div {...props}>
      <Switch>{children}</Switch>
    </div>
  );
};

export default Views;
