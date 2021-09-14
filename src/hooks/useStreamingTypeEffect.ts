import { useEffect, useMemo } from 'react';
import find from 'lodash/find';

import { Bool } from 'api';

import useApi from './useApi';
import useStorageState from './useStorageState';

function useStreamingTypeEffect() {
  const { data: streamingTypes } = useApi('streamingTypes');
  const { data: deviceInfo } = useApi('deviceInfo');
  const [, setStreamingType] = useStorageState<string>('streaming_type');

  const selectedStreamingType = useMemo(
    () => find(deviceInfo?.device?.settings?.streamingType?.value, ({ selected }) => selected === Bool.True),
    [deviceInfo?.device],
  );
  const streamingType = useMemo(
    () => find(streamingTypes?.items, (streamingType) => streamingType?.id === selectedStreamingType?.id),
    [streamingTypes?.items, selectedStreamingType],
  );

  useEffect(() => {
    if (streamingType?.code) {
      setStreamingType(streamingType?.code);
    }
  }, [setStreamingType, streamingType?.code]);
}

export default useStreamingTypeEffect;
