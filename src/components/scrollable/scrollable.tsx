import { createContext, useMemo, useRef } from 'react';
import Scroller, { ScrollerProps } from '@enact/moonstone/Scroller';
import styled from 'styled-components';

import useInViewport from 'hooks/useInViewport';
import useUniqueId from 'hooks/useUniqueId';

const Footer = styled.div`
  height: 5rem;
`;

export const ScrollableContext = createContext<{ id?: string }>({});

type Props = {
  onScrollToEnd?: () => void;
} & ScrollerProps;

const Scrollable: React.FC<Props> = ({ children, onScrollToEnd, ...props }) => {
  const footerRef = useRef<HTMLDivElement>(null);
  const id = useUniqueId('scrollable');
  const value = useMemo(
    () => ({
      id,
    }),
    [id],
  );

  useInViewport(footerRef, { onEnterViewport: onScrollToEnd });

  return (
    <Scroller id={id} direction="vertical" verticalScrollbar="hidden" horizontalScrollbar="hidden" {...props}>
      <ScrollableContext.Provider value={value}>{children}</ScrollableContext.Provider>
      <Footer ref={footerRef} />
    </Scroller>
  );
};

export default Scrollable;
