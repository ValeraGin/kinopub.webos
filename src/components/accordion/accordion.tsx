import { useCallback } from 'react';
import cx from 'classnames';

import Icon from 'components/icon';
import Spottable from 'components/spottable';
import Text from 'components/text';
import useChangebleState from 'hooks/useChangebleState';
import useThrottledCallback from 'hooks/useThrottledCallback';

type Props = {
  title: string;
  subtitle?: string;
  className?: string;
  open?: boolean;
  disabled?: boolean;
  onToggle?: (open: boolean) => void;
};

const Accordion: React.FC<Props> = ({ open, onToggle, title, subtitle, className, children, disabled }) => {
  const [visible, setVisible] = useChangebleState(open);

  const handleClick = useCallback(() => {
    if (!disabled) {
      const newVisible = !visible;
      onToggle?.(newVisible);
      setVisible(newVisible);
    }
  }, [disabled, visible, setVisible, onToggle]);

  const handleClickThrottled = useThrottledCallback(handleClick);

  return (
    <div className="flex flex-col w-full">
      <Spottable onClick={handleClickThrottled} className={cx('p-1 cursor-pointer', className)} disabled={disabled}>
        <div className="flex flex-col">
          <div className="flex items-center">
            <Text>{title}</Text>

            {!disabled && <Icon name={visible ? 'expand_less' : 'expand_more'} />}
          </div>
          {!visible && subtitle && <Text className="mt-2">{subtitle}</Text>}
        </div>
      </Spottable>
      {visible && children}
    </div>
  );
};

export default Accordion;
