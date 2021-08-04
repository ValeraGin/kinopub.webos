import { useCallback } from 'react';
import cx from 'classnames';

import Icon from 'components/icon';
import Spottable from 'components/spottable';
import Text from 'components/text';
import useChangebleState from 'hooks/useChangebleState';

type Props = {
  title: string;
  subtitle?: string;
  className?: string;
  open?: boolean;
  onToggle?: (open: boolean) => void;
};

const Accordion: React.FC<Props> = ({ open, onToggle, title, subtitle, className, children }) => {
  const [visible, setVisible] = useChangebleState(open);

  const handleClick = useCallback(() => {
    setVisible((visible) => {
      const newVisible = !visible;

      onToggle?.(newVisible);

      return newVisible;
    });
  }, [setVisible, onToggle]);

  return (
    <div className="flex flex-col w-full">
      <Spottable onClick={handleClick} className={cx('p-1 cursor-pointer', className)}>
        <div className="flex flex-col">
          <div className="flex items-center">
            <Text>{title}</Text>

            <Icon name={visible ? 'expand_less' : 'expand_more'} />
          </div>
          {!visible && <Text className="mt-2">{subtitle}</Text>}
        </div>
      </Spottable>
      {visible && children}
    </div>
  );
};

export default Accordion;
