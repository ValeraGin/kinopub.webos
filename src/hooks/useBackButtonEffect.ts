import { useEffect } from 'react';

import { ButtonClickHandler, registerBackButtonHandler } from 'utils/keyboard';

function useBackButtonEffect(handler: ButtonClickHandler) {
  useEffect(() => {
    const unregister = registerBackButtonHandler(handler);

    return unregister;
  }, [handler]);
}

export default useBackButtonEffect;
