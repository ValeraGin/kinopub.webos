import React, { createElement, useMemo } from 'react';
import { Route, RouteComponentProps, RouteProps } from 'react-router-dom';
import { Panel } from '@enact/moonstone/Panels';

export type ViewProps = {} & Omit<RouteProps, 'render'>;

const View: React.FC<ViewProps> = ({ component, ...props }) => {
  const render = useMemo<React.FC<RouteComponentProps>>(() => (routeProps) => <Panel>{createElement(component, routeProps)}</Panel>, [
    component,
  ]);

  return <Route {...props} render={render} />;
};

export default View;
