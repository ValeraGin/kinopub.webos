import { useCallback } from 'react';
import cx from 'classnames';

import Spottable from 'components/spottable';

type Props = {
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  type?: string;
} & Omit<React.HTMLAttributes<HTMLInputElement>, 'onChange'>;

const Checkbox: React.FC<Props> = ({ defaultChecked, checked, onChange, className, children, ...props }) => {
  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      onChange?.(e.target.checked, e);
    },
    [onChange],
  );

  return (
    <Spottable component="label" className={cx('text-primary p-2', className)}>
      <div className="inline-flex items-center cursor-pointer">
        <input
          {...props}
          type="checkbox"
          className="inline-block w-4 h-4"
          defaultChecked={defaultChecked}
          checked={checked}
          onChange={handleChange}
        />
        <span className="inline-block ml-2 whitespace-nowrap">{children}</span>
      </div>
    </Spottable>
  );
};

export default Checkbox;
