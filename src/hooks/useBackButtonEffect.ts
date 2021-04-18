import { useEffect } from 'react';

import { BackButtonHandler, registerBackButtonHandler } from 'utils/keyboard';

function useBackButtonEffect(handler: BackButtonHandler) {
  useEffect(() => {
    const unregister = registerBackButtonHandler(handler);

    return unregister;
  }, [handler]);
}

export default useBackButtonEffect;
