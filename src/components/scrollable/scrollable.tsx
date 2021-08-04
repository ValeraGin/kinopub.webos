import { createContext, useMemo, useRef } from 'react';
import cx from 'classnames';

import useInViewport from 'hooks/useInViewport';
import useUniqueId from 'hooks/useUniqueId';

export const ScrollableContext = createContext<{ id?: string }>({});

type Props = {
  onScrollToEnd?: () => void;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const Scrollable: React.FC<Props> = ({ children, className, onScrollToEnd, ...props }) => {
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
    <div id={id} className="overflow-hidden h-screen" {...props}>
      <ScrollableContext.Provider value={value}>
        <div className={cx('overflow-y-auto h-full', className)}>
          {children}
          <div className="h-40" ref={footerRef} />
        </div>
      </ScrollableContext.Provider>
    </div>
  );
};

export default Scrollable;
