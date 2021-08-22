import { useCallback, useMemo, useState } from 'react';
import map from 'lodash/map';

import Accordion from 'components/accordion';
import Radio from 'components/radio';
import useChangebleState from 'hooks/useChangebleState';

type Option<T = any> = {
  title: string;
  value: T;
};

type Props<T = any> = {
  label: string;
  options: Option<T>[] | string[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  closeOnChange?: boolean;
  className?: string;
  splitIn?: 2 | 3 | 4 | 5 | 6;
  disabled?: boolean;
};

const Select: React.FC<Props> = ({ label, options, defaultValue, value, onChange, closeOnChange = true, className, splitIn, disabled }) => {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useChangebleState(value || defaultValue);
  const opts = useMemo(
    () =>
      Array.isArray(options) ? options.map((option, idx) => (typeof option === 'object' ? option : { title: option, value: idx })) : [],
    [options],
  );
  const selectedOption = useMemo(() => opts.find((o) => o.value === val), [opts, val]);

  const handleChanged = useCallback(
    (value) => {
      setVal(value);
      onChange?.(value);

      if (closeOnChange) {
        setOpen(false);
      }
    },
    [setVal, onChange, closeOnChange],
  );
  const handleChecked = useCallback(
    (option: Option) => (checked: boolean) => {
      if (checked) {
        handleChanged(option.value);
      }
    },
    [handleChanged],
  );

  return (
    <Accordion open={open} onToggle={setOpen} title={label} subtitle={selectedOption?.title} className={className} disabled={disabled}>
      <div className="flex flex-wrap">
        {map(opts, (opt) => (
          <Radio
            key={opt.value}
            className={splitIn ? `w-1/${splitIn}` : 'w-full'}
            checked={opt.value === val}
            onChange={handleChecked(opt)}
          >
            {opt.title}
          </Radio>
        ))}
      </div>
    </Accordion>
  );
};

export default Select;
