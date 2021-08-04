import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';

import Icon from 'components/icon';
import Spottable from 'components/spottable';

type Props = {
  href: string;
  icon?: string;
  iconOnly?: boolean;
  active?: boolean;
  state?: any;
  className?: string;
  onClick?: () => void;
};

const Link: React.FC<Props> = ({ href, state, children, icon, iconOnly, active, className, onClick, ...props }) => {
  const history = useHistory();
  const handleOnClick = useCallback(() => {
    history.push(href, state);
    onClick?.();
  }, [href, state, onClick, history]);

  return (
    <Spottable
      {...props}
      className={cx(
        'whitespace-nowrap cursor-pointer p-1',
        {
          'text-primary': !active,
          'text-red-600': active,
        },
        className,
      )}
      onClick={handleOnClick}
      role="button"
    >
      <div className="flex items-center ">
        {icon && <Icon className={cx({ 'mr-2': !iconOnly })} name={icon} />}
        {!iconOnly && children}
      </div>
    </Spottable>
  );
};

export default Link;
