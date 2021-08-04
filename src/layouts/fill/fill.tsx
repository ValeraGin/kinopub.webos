import React from 'react';

type Props = {
  children: React.ReactNode;
};

const FillLayout: React.FC<Props> = ({ children }) => {
  return <div className="w-full h-full">{children}</div>;
};

export default FillLayout;
