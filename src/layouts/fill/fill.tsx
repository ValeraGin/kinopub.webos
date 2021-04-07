import React from 'react';
import styled from 'styled-components';

import Scrollable from 'components/scrollable';

const Wrapper = styled(Scrollable)``;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

type Props = {
  children: React.ReactNode;
};

const FillLayout: React.FC<Props> = ({ children }) => {
  return (
    <Wrapper>
      <Content>{children}</Content>
    </Wrapper>
  );
};

export default FillLayout;
