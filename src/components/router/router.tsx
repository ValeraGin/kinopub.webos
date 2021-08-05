import { BrowserRouter, BrowserRouterProps, MemoryRouter, MemoryRouterProps } from 'react-router-dom';

export type RouterProps = BrowserRouterProps | MemoryRouterProps;

const IS_WEB = window.location.origin.startsWith('http');

const Router: React.FC<RouterProps> = (props) => {
  if (IS_WEB) {
    return <BrowserRouter {...props} />;
  }

  return <MemoryRouter {...props} />;
};

export default Router;
