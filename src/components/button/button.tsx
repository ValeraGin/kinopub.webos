import { useEffect, useRef } from 'react';
import cx from 'classnames';

import Icon from 'components/icon';
import Spottable from 'components/spottable';

type Props = {
  icon?: string;
  iconOnly?: boolean;
  autoFocus?: boolean;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const Button: React.FC<Props> = ({ icon, iconOnly, children, autoFocus, className, ...props }) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let frameId: number;

    if (autoFocus) {
      frameId = requestAnimationFrame(() => {
        // @ts-expect-error
        wrapperRef.current?.node?.focus();
      });
    }

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [wrapperRef, autoFocus]);

  return (
    <Spottable
      {...props}
      ref={wrapperRef}
      className={cx(
        'text-primary whitespace-nowrap cursor-pointer rounded px-2 py-1',
        {
          'pr-3': !!icon,
        },
        className,
      )}
      role="button"
    >
      <div className="flex items-center">
        {icon && <Icon name={icon} />}
        {!iconOnly && children}
      </div>
    </Spottable>
  );
};

export default Button;
