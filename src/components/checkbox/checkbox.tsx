import { useCallback, useRef } from 'react';
import React from 'react';

import Button from 'components/button';

export type CheckboxProps = {
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  type?: string;
  disabled?: boolean;
} & Omit<React.HTMLAttributes<HTMLInputElement>, 'onChange'>;

const Checkbox: React.FC<CheckboxProps> = ({ defaultChecked, checked, onChange, className, children, disabled, ...props }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      onChange?.(e.target.checked, e);
    },
    [onChange],
  );
  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <Button className={className} onClick={handleClick} disabled={disabled}>
      <input
        type="checkbox"
        {...props}
        ref={inputRef}
        className="inline-block w-4 h-4"
        defaultChecked={defaultChecked}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <span className="inline-block ml-2 whitespace-nowrap">{children}</span>
    </Button>
  );
};

export default Checkbox;
