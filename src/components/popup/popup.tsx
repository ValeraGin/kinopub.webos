import { useCallback, useEffect, useMemo } from 'react';
import Spotlight from '@enact/spotlight';
import cx from 'classnames';

import SpotlightContainer from 'components/spotlightContainer';
import useButtonEffect from 'hooks/useButtonEffect';

type Props = {
  visible: boolean;
  onClose: (visible: boolean) => void;
} & React.HTMLAttributes<HTMLDivElement>;

const Popup: React.FC<Props> = ({ visible, onClose, className, ...props }) => {
  const containerId = useMemo(() => Spotlight.add({}), []);
  const handleClose = useCallback(() => {
    onClose(false);
  }, [onClose]);

  const handleCloseOnBackButton = useCallback(() => {
    if (visible) {
      handleClose();

      return false;
    }
  }, [visible, handleClose]);

  const spotPopupContent = useCallback(() => {
    if (!Spotlight.focus(containerId)) {
      const current = Spotlight.getCurrent();

      // In cases where the container contains no spottable controls or we're in pointer-mode, focus
      // cannot inherently set the active container or blur the active control, so we must do that
      // here.
      if (current) {
        // @ts-expect-error
        current.blur();
      }

      Spotlight.setActiveContainer(containerId);
      setTimeout(() => {
        Spotlight.setPointerMode(false);
        Spotlight.focus(containerId);
      }, 500);
    }
  }, [containerId]);

  useButtonEffect('Back', handleCloseOnBackButton);

  useEffect(() => {
    if (visible) {
      spotPopupContent();
    }
  }, [visible, spotPopupContent]);

  return (
    <>
      <div
        className={cx('fixed z-999 top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50', {
          hidden: !visible,
        })}
        onClick={handleClose}
      />
      <SpotlightContainer
        {...props}
        spotlightId={containerId}
        spotlightRestrict="self-only"
        spotlightDisabled={!visible}
        className={cx(
          'fixed z-999 bottom-0 left-0 right-0 p-4 bg-primary ring',
          {
            hidden: !visible,
          },
          className,
        )}
      />
    </>
  );
};

export default Popup;
