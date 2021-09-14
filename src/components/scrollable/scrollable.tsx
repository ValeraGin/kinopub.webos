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
    <div className={cx('overflow-y-auto h-full', className)} {...props} id={id}>
      <ScrollableContext.Provider value={value}>{children}</ScrollableContext.Provider>
      {onScrollToEnd && <div className="h-40" ref={footerRef} />}
    </div>
  );
};

export default Scrollable;
