import { useRef } from 'react';
import cx from 'classnames';

import useInViewport from 'hooks/useInViewport';

type Props = {
  onScrollToEnd?: () => void;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const Scrollable: React.FC<Props> = ({ children, className, onScrollToEnd, ...props }) => {
  const footerRef = useRef<HTMLDivElement>(null);

  useInViewport(footerRef, { onEnterViewport: onScrollToEnd });

  return (
    <div className={cx('overflow-y-auto h-full', className)} {...props}>
      {children}
      {onScrollToEnd && <div className="h-40" ref={footerRef} />}
    </div>
  );
};

export default Scrollable;
