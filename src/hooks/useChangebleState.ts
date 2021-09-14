import { useEffect, useState } from 'react';

function useChangebleState<T>(initialState?: T) {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    setState(initialState);
  }, [initialState]);

  return [state, setState] as const;
}

export default useChangebleState;
