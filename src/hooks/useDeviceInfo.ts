import { useEffect, useMemo, useState } from 'react';
import { detect } from '@enact/core/platform';
import { deviceinfo } from '@enact/webos/deviceinfo';

const pkg = require('../../package.json');

function useDeviceInfo() {
  const [software, setSoftware] = useState('');
  const [hardware, setHardware] = useState('');

  useEffect(() => {
    const platform = detect();

    setHardware(navigator.platform);
    setSoftware(platform.platformName);

    deviceinfo((device) => {
      setHardware(device['modelName']);
      setSoftware(`${platform.platformName} ${device['version']} (${pkg.name} ${pkg.version})`);
    });
  }, []);

  const deviceInfo = useMemo(
    () => ({
      software,
      hardware,
      title: pkg.description,
    }),
    [software, hardware],
  );

  return deviceInfo;
}

export default useDeviceInfo;
