import { useEffect } from 'react';

import { ButtonClickHandler, isPlayButton } from 'utils/keyboard';

function usePlayButtonEffect(handler: ButtonClickHandler) {
  useEffect(() => {
    const listiner = (e: KeyboardEvent) => {
      if (isPlayButton(e)) {
        handler(e);
      }
    };

    window.addEventListener('keydown', listiner);

    return () => {
      window.removeEventListener('keydown', listiner);
    };
  }, [handler]);
}

export default usePlayButtonEffect;
