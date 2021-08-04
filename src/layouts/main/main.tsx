import React from 'react';

import Menu from 'containers/menu';

type Props = {
  children: React.ReactNode;
};

const MainLayout: React.FC<Props> = ({ children, ...rest }) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden" {...rest}>
      <Menu />
      <div className="w-full px-2">{children}</div>
    </div>
  );
};

export default MainLayout;
