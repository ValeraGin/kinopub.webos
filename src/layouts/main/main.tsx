import React from 'react';
import styled from 'styled-components';

import Menu from 'containers/menu';

const Wrapper = styled.div`
  display: flex;
  height: 100%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem 0;
`;

type Props = {
  children: React.ReactNode;
};

const MainLayout: React.FC<Props> = ({ children, ...rest }) => {
  return (
    <Wrapper {...rest}>
      <Menu />
      <Content>{children}</Content>
    </Wrapper>
  );
};

export default MainLayout;
