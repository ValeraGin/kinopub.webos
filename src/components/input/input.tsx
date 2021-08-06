import { useCallback } from 'react';
import InputBase, { InputProps } from '@enact/moonstone/Input';
import cx from 'classnames';

type Props = {
  onChange?: (value: string) => void;
  className?: string;
} & InputProps;

const Input: React.FC<Props> = ({ className, onChange, ...props }) => {
  const handleChange = useCallback(
    ({ value }: { value: string }) => {
      onChange?.(value);
    },
    [onChange],
  );

  return <InputBase {...props} className={cx('w-full', className)} onChange={handleChange} />;
};

export default Input;
