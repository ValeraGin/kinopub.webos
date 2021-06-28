import React, { Suspense, createElement, useMemo } from 'react';
import { Route, RouteComponentProps, RouteProps } from 'react-router-dom';
import { Panel } from '@enact/moonstone/Panels';

import Spinner from 'components/spinner';
import FillLayout from 'layouts/fill';
import MainLayout from 'layouts/main';

export type ViewProps = {
  component: RouteProps['component'];
  layout?: 'main' | 'fill';
} & Omit<RouteProps, 'component' | 'render'>;

const View: React.FC<ViewProps> = ({ component, layout, ...props }) => {
  const Layout = useMemo(() => {
    if (layout === 'fill') {
      return FillLayout;
    }

    return MainLayout;
  }, [layout]);
  const render = useMemo<React.FC<RouteComponentProps>>(
    () => (routeProps) =>
      (
        <Panel>
          <Layout>
            <Suspense fallback={<Spinner />}>{createElement(component!, routeProps)}</Suspense>
          </Layout>
        </Panel>
      ),
    [component, Layout],
  );

  return <Route {...props} render={render} />;
};

export default View;
