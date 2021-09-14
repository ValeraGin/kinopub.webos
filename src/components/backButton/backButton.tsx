import { useCallback } from 'react';

import Button, { ButtonProps } from 'components/button';

import { triggerButtonClick } from 'utils/keyboard';

const BackButton: React.FC<ButtonProps> = ({ onClick, ...props }) => {
  const handleBackClick = useCallback<React.MouseEventHandler<HTMLElement>>(
    (e) => {
      triggerButtonClick('Back');
      onClick?.(e);
    },
    [onClick],
  );

  return <Button icon="arrow_back" {...props} onClick={handleBackClick} />;
};

export default BackButton;
