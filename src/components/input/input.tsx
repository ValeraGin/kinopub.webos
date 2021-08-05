import { useCallback, useRef } from 'react';
import cx from 'classnames';

import Spottable from 'components/spottable';

type Props = {
  onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

const Input: React.FC<Props> = ({ className, onChange, ...props }) => {
  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      onChange?.(e.target.value, e);
    },
    [onChange],
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <Spottable className={cx('w-full rounded', className)} onClick={handleClick}>
      <input {...props} onChange={handleChange} className={'w-full h-auto px-2 py-1 rounded text-gray-500'} />
    </Spottable>
  );
};

export default Input;
