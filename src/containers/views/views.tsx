import { useCallback, useEffect, useState } from 'react';
import { Switch, useHistory } from 'react-router-dom';

import Spinner from 'components/spinner';
import Text from 'components/text';
import useButtonEffect from 'hooks/useButtonEffect';
import useDeviceAuthorizationEffect from 'hooks/useDeviceAuthorizationEffect';
import { PATHS } from 'routes';

const Views: React.FC = ({ children, ...props }) => {
  const history = useHistory();
  const [showNotice, setShowNotice] = useState(false);
  const [showSpinner, setShowSpinner] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const handleBackButtonClick = useCallback(() => {
    if (history.location.pathname !== PATHS.Home) {
      history.goBack();
    } else if (showNotice) {
      window.close();
    } else {
      setShowNotice(true);

      setTimeout(() => {
        setShowNotice(false);
      }, 5 * 1000);
    }
  }, [history, showNotice]);

  const handleAuthorization = useCallback(
    (isAuthorized: boolean) => {
      setIsAuthorized(isAuthorized);

      const path = history.location.pathname;
      if (isAuthorized) {
        if (path === PATHS.Pair || path === PATHS.Index) {
          history.replace(PATHS.Home);
        }
      }
    },
    [history],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowSpinner(!isAuthorized && history.location.pathname !== PATHS.Pair);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isAuthorized, history.location.pathname]);

  useButtonEffect('Back', handleBackButtonClick);
  useDeviceAuthorizationEffect(handleAuthorization);

  if (showSpinner) {
    return <Spinner />;
  }

  return (
    <div {...props}>
      {showNotice && (
        <div className="fixed top-2 right-2 p-4 z-999 shadow-xl rounded-xl bg-gray-500 bg-opacity-70">
          <Text>
            Чтобы закрыть приложение,
            <br />
            нажмите кнопку "назад" ещё раз
          </Text>
        </div>
      )}
      <Switch>{children}</Switch>
    </div>
  );
};

export default Views;
