import { useCallback } from 'react';
import onClickOutside from 'react-onclickoutside';
import cx from 'classnames';

import useBackButtonEffect from 'hooks/useBackButtonEffect';

type Props = {
  visible: boolean;
  onClose: (visible: boolean) => void;
} & React.HTMLAttributes<HTMLDivElement>;

const Popup: React.FC<Props> = ({ visible, onClose, className, ...props }) => {
  const handleClose = useCallback(() => {
    onClose(false);
  }, [onClose]);

  const handleCloseOnBackButton = useCallback(() => {
    if (visible) {
      handleClose();

      return false;
    }
  }, [visible, handleClose]);

  useBackButtonEffect(handleCloseOnBackButton);

  // @ts-expect-error
  Popup.handleClickOutside = handleClose;

  if (!visible) {
    return null;
  }

  return <div {...props} className={cx('fixed z-999 bottom-0 left-0 right-0 p-4 bg-primary ring', className)} />;
};

const clickOutsideConfig = {
  handleClickOutside: () =>
    // @ts-expect-error
    Popup.handleClickOutside,
};

export default onClickOutside(Popup, clickOutsideConfig);
