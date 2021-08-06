import { BrowserRouter, BrowserRouterProps, HashRouter, HashRouterProps } from 'react-router-dom';

import { IS_WEB } from 'utils/enviroment';

export type RouterProps = BrowserRouterProps | HashRouterProps;

const Router: React.FC<RouterProps> = (props) => {
  if (IS_WEB) {
    return <BrowserRouter {...props} />;
  }

  return <HashRouter {...props} />;
};

export default Router;
