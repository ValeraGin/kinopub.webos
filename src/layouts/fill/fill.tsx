import React from 'react';

type Props = {
  children: React.ReactNode;
};

const FillLayout: React.FC<Props> = ({ children }) => {
  return <>{children}</>;
};

export default FillLayout;
