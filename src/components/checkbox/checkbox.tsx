import { useCallback, useRef } from 'react';
import React from 'react';
import cx from 'classnames';

import Spottable from 'components/spottable';

import { isKey } from 'utils/keyboard';

export type CheckboxProps = {
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  type?: string;
} & Omit<React.HTMLAttributes<HTMLInputElement>, 'onChange'>;

const Checkbox: React.FC<CheckboxProps> = ({ defaultChecked, checked, onChange, className, children, ...props }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      onChange?.(e.target.checked, e);
    },
    [onChange],
  );
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (isKey(e, 'Enter')) {
      inputRef.current?.click();
    }
  }, []);

  return (
    <Spottable
      component="label"
      className={cx('text-gray-200 p-2', className)}
      // @ts-expect-error
      onKeyPress={handleKeyPress}
      role="button"
    >
      <div className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          {...props}
          ref={inputRef}
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
