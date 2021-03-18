import { useEffect, useRef } from 'react';
import Scroller, { ScrollerProps } from '@enact/moonstone/Scroller';
import styled from 'styled-components';

const Footer = styled.div`
  height: 5rem;
`;

type Props = {
  onScrollToFooter?: () => void;
} & ScrollerProps;

const Scrollable: React.FC<Props> = ({ children, onScrollToFooter, ...props }) => {
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let observer: IntersectionObserver;

    if (footerRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].intersectionRatio > 0) {
            onScrollToFooter?.();
          }
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0.5,
        },
      );

      observer.observe(footerRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [footerRef, onScrollToFooter]);

  return (
    <Scroller direction="vertical" verticalScrollbar="hidden" horizontalScrollbar="hidden" {...props}>
      {children}
      <Footer ref={footerRef} />
    </Scroller>
  );
};

export default Scrollable;
