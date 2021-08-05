import { useCallback, useRef } from 'react';
import cx from 'classnames';

import Spottable from 'components/spottable';

type Props = {
  onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

const Input: React.FC<Props> = ({ className, onChange, ...props }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      onChange?.(e.target.value, e);
    },
    [onChange],
  );
  const handleClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <Spottable className={cx('w-full rounded', className)} onClick={handleClick}>
      <input {...props} ref={inputRef} onChange={handleChange} className={'w-full h-auto px-2 py-1 rounded text-gray-500'} />
    </Spottable>
  );
};

export default Input;
