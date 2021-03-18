import { useCallback, useEffect } from 'react';
import MoonstonePopup, { PopupProps } from '@enact/moonstone/Popup';

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

  useEffect(() => {
    const listiner = (e: KeyboardEvent) => {
      if (e.keyCode === 461 && visible) {
        e.stopPropagation();
        onVisibilityChange(false);
      }
    };

    window.addEventListener('keydown', listiner, true);

    return () => {
      window.removeEventListener('keydown', listiner, true);
    };
  }, [visible, onVisibilityChange]);

  return <MoonstonePopup {...props} open={visible} onShow={handleShow} onClose={handleClose} />;
};

export default Popup;
