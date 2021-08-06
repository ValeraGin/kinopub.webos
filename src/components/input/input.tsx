import { useCallback, useEffect, useRef } from 'react';
import { findDOMNode } from 'react-dom';
import InputBase, { InputProps } from '@enact/moonstone/Input';
import cx from 'classnames';

type Props = {
  onChange?: (value: string) => void;
  className?: string;
} & InputProps;

const Input: React.FC<Props> = ({ className, onChange, autoFocus, ...props }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange = useCallback(
    ({ value }: { value: string }) => {
      onChange?.(value);
    },
    [onChange],
  );

  useEffect(() => {
    let frameId: number;

    if (autoFocus) {
      frameId = requestAnimationFrame(() => {
        const domNode = findDOMNode(inputRef.current) as HTMLDivElement;
        domNode?.querySelector('input')?.focus();
      });
    }

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [inputRef, autoFocus]);

  return (
    <InputBase
      {...props}
      // @ts-expect-error
      ref={inputRef}
      className={cx('w-full', className)}
      onChange={handleChange}
    />
  );
};

export default Input;
