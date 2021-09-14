import { useMemo } from 'react';
import { useUID } from 'react-uid';

function useUniqueId(prefix: string) {
  const uid = useUID();
  const id = useMemo(() => `${prefix}-${uid}`, [prefix, uid]);

  return id;
}

export default useUniqueId;
