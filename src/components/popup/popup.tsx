import { useCallback } from 'react';
import MoonstonePopup, { PopupProps } from '@enact/moonstone/Popup';

import useBackButtonEffect from 'hooks/useBackButtonEffect';

type Props = {
  visible: boolean;
  onVisibilityChange: (visible: boolean) => void;
} & Omit<PopupProps, 'open' | 'onShow' | 'onClose'>;

const Popup: React.FC<Props> = ({ visible, onVisibilityChange, ...props }) => {
  const handleShow = useCallback(() => {
    onVisibilityChange(true);
  }, [onVisibilityChange]);
  const handleClose = useCallback(() => {
    onVisibilityChange(false);
  }, [onVisibilityChange]);

  const handleCloseOnBackButton = useCallback(() => {
    if (visible) {
      onVisibilityChange(false);

      return false;
    }
  }, [visible, onVisibilityChange]);

  useBackButtonEffect(handleCloseOnBackButton);

  return <MoonstonePopup {...props} open={visible} onShow={handleShow} onClose={handleClose} />;
};

export default Popup;
