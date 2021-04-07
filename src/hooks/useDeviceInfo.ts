import { useEffect, useMemo, useState } from 'react';
import { detect } from '@enact/core/platform';
import { deviceinfo } from '@enact/webos/deviceinfo';

const pkg = require('../../package.json');

const APP_TITLE = pkg.description;
const APP_INFO = `${pkg.name} ${pkg.version}`;

function useDeviceInfo() {
  const [software, setSoftware] = useState('');
  const [hardware, setHardware] = useState('');

  useEffect(() => {
    const platform = detect();

    setHardware(navigator.platform);
    setSoftware(`${platform.platformName} (${APP_INFO})`);

    deviceinfo(
      // @ts-expect-error
      (device: { modelName: string; sdkVersion: string; version: string }) => {
        setHardware(`${device.modelName}${device.version ? ` (${device.version})` : ''}`);
        setSoftware(
          `${platform.platformName} ${
            device.sdkVersion ||
            // @ts-expect-error
            platform[platform.platformName]
          } (${APP_INFO})`,
        );
      },
    );
  }, []);

  const deviceInfo = useMemo(
    () => ({
      software,
      hardware,
      title: APP_TITLE,
    }),
    [software, hardware],
  );

  return deviceInfo;
}

export default useDeviceInfo;
