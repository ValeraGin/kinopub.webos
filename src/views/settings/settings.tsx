import React, { useCallback, useMemo, useState } from 'react';
import filter from 'lodash/filter';
import findIndex from 'lodash/findIndex';
import map from 'lodash/map';

import { Bool, DeviceSettingBoolean, DeviceSettingList, DeviceSettingsParams } from 'api';
import Button from 'components/button';
import Checkbox from 'components/checkbox';
import Select from 'components/select';
import Seo from 'components/seo';
import Text from 'components/text';
import useApi from 'hooks/useApi';
import useApiMutation from 'hooks/useApiMutation';
import useDeviceInfo from 'hooks/useDeviceInfo';
import useStorageState from 'hooks/useStorageState';

const SettingBool: React.FC<{ setting: DeviceSettingBoolean; onChange?: (checked: boolean) => void }> = ({ setting, onChange }) => {
  return (
    <Checkbox className="w-full" defaultChecked={setting.value === Bool.True} onChange={onChange}>
      {setting.label}
    </Checkbox>
  );
};

const SettingList: React.FC<{ setting: DeviceSettingList; onChange?: (value: number) => void }> = ({ setting, onChange }) => {
  const options = useMemo(
    () => map(setting.value, (value) => `${value.label} ${value.description ? `(${value.description})` : ''}`),
    [setting.value],
  );

  return (
    <Select
      defaultValue={findIndex(setting.value, (value) => value.selected === Bool.True)}
      label={setting.label}
      onChange={onChange}
      options={options}
      closeOnChange
    />
  );
};

const SettingsView: React.FC = () => {
  const { data } = useApi('user');
  const { data: deviceInfo } = useApi('deviceInfo');
  const { saveDeviceSettingsAsync } = useApiMutation('saveDeviceSettings');
  const { deactivate } = useApiMutation('deactivate');
  const [newSettings, setNewSettings] = useState<DeviceSettingsParams>({});
  const [isHLSJSActive, setIsHLSJSActive] = useStorageState<boolean>('is_hls.js_active');
  const { software, hardware } = useDeviceInfo();

  const boolSettings = useMemo(
    () =>
      filter(
        map(deviceInfo?.device?.settings, (setting, key) => ({ ...setting, key })),
        (setting: DeviceSettingBoolean) => typeof setting['type'] === 'undefined',
      ) as (DeviceSettingBoolean & { key: string })[],
    [deviceInfo?.device?.settings],
  );
  const listSettings = useMemo(
    () =>
      filter(
        map(deviceInfo?.device?.settings, (setting, key) => ({ ...setting, key })),
        (setting: DeviceSettingList) => setting['type'] === 'list',
      ) as (DeviceSettingList & { key: string })[],
    [deviceInfo?.device?.settings],
  );

  const handleHLSJSToogle = useCallback(
    (checked: boolean) => {
      setIsHLSJSActive(checked);
    },
    [setIsHLSJSActive],
  );
  const handleBoolSettingToggle = useCallback(
    (setting: typeof boolSettings[0]) => async (checked: boolean) => {
      setNewSettings({ ...newSettings, [setting['key']]: checked ? Bool.True : Bool.False });
    },
    [newSettings],
  );
  const handleListSettingSelect = useCallback(
    (setting: typeof listSettings[0]) => (value: number) => {
      setNewSettings({ ...newSettings, [setting['key']]: setting.value[value].id });
    },
    [newSettings],
  );

  const handleSaveClick = useCallback(async () => {
    await saveDeviceSettingsAsync([deviceInfo?.device.id!, newSettings]);

    window.location.reload();
  }, [newSettings, deviceInfo?.device, saveDeviceSettingsAsync]);
  const handleLogoutClick = useCallback(() => {
    deactivate([]);
  }, [deactivate]);

  return (
    <>
      <Seo title="Настройки устройства" />
      <div className="h-screen relative">
        <Text className="m-1 mb-3">Настройки устройства</Text>

        <div className="flex flex-col">
          {deviceInfo?.device && (
            <>
              <div>
                <div className="flex flex-wrap pb-4" key={`bool-${deviceInfo?.device.updated}`}>
                  {map(boolSettings, (setting) => (
                    <div className="flex w-1/2 pr-4" key={setting['key']}>
                      <SettingBool setting={setting} onChange={handleBoolSettingToggle(setting)} />
                    </div>
                  ))}
                  <div className="flex w-1/2 pr-4" key="use-hls.js">
                    <Checkbox className="w-full" defaultChecked={isHLSJSActive !== false} onChange={handleHLSJSToogle}>
                      Использовать HLS.js
                    </Checkbox>
                  </div>
                </div>
                <div className="flex flex-wrap pb-4" key={`list-${deviceInfo?.device.updated}`}>
                  {map(listSettings, (setting) => (
                    <div className="flex w-1/2 pr-4" key={setting['key']}>
                      <SettingList setting={setting} onChange={handleListSettingSelect(setting)} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex my-8">
                <Button icon="done" onClick={handleSaveClick}>
                  Сохранить
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-between absolute bottom-0 left-0 right-0 py-2">
          <div>
            <Text>Пользователь</Text>
            <div className="flex items-center">
              {data?.user && (
                <Text className="mr-4">
                  {data.user.profile.name || data.user.username} ({Math.floor(data.user.subscription.days)} дн.)
                </Text>
              )}

              <Button icon="logout" onClick={handleLogoutClick}>
                Выход
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-end pr-4">
            <Text>{hardware}</Text>
            <Text>{software}</Text>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsView;
