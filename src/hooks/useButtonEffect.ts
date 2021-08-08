import { useEffect } from 'react';

import { ButtonClickHandler, KeyboardCodesKeys, registerButtonHandler } from 'utils/keyboard';

export type { ButtonClickHandler, KeyboardCodesKeys } from 'utils/keyboard';

function useButtonEffect(key: KeyboardCodesKeys | KeyboardCodesKeys[], handler: ButtonClickHandler) {
  useEffect(() => {
    return registerButtonHandler(key, handler);
  }, [key, handler]);
}

export default useButtonEffect;
