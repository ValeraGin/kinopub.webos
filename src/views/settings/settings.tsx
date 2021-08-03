import React, { useCallback, useMemo, useState } from 'react';
import CheckboxItem from '@enact/moonstone/CheckboxItem';
import ExpandableList from '@enact/moonstone/ExpandableList';
import filter from 'lodash/filter';
import findIndex from 'lodash/findIndex';
import map from 'lodash/map';
import styled from 'styled-components';

import { Bool, DeviceSettingBoolean, DeviceSettingList, DeviceSettingsParams } from 'api';
import Button from 'components/button';
import Text from 'components/text';
import useApi from 'hooks/useApi';
import useApiMutation from 'hooks/useApiMutation';
import useDeviceInfo from 'hooks/useDeviceInfo';

const Content = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Settings = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 2rem;
`;

const Setting = styled.div`
  flex-basis: 50%;
  box-sizing: border-box;
  padding-right: 1rem;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const User = styled.div`
  display: flex;
  align-items: center;

  ${Text} {
    padding-right: 2rem;
  }
`;

const Device = styled.div`
  display: flex;
  flex-basis: 50%;
  padding-left: 1rem;
  align-items: flex-end;
`;

const SettingBool: React.FC<{ setting: DeviceSettingBoolean; onToggle?: Function }> = ({ setting, onToggle }) => {
  return (
    <CheckboxItem defaultSelected={setting.value === Bool.True} onToggle={onToggle}>
      {setting.label}
    </CheckboxItem>
  );
};

const SettingList: React.FC<{ setting: DeviceSettingList; onSelect?: Function }> = ({ setting, onSelect }) => {
  return (
    <ExpandableList
      // @ts-expect-error
      defaultSelected={findIndex(setting.value, (value) => value.selected === Bool.True)}
      title={setting.label}
      select="radio"
      onSelect={onSelect}
      closeOnSelect
    >
      {map(setting.value, (value) => `${value.label} ${value.description ? `(${value.description})` : ''}`) as string[]}
    </ExpandableList>
  );
};

const SettingsView: React.FC = () => {
  const { data } = useApi('user');
  const { data: deviceInfo } = useApi('deviceInfo');
  const { saveDeviceSettingsAsync } = useApiMutation('saveDeviceSettings');
  const { deactivate } = useApiMutation('deactivate');
  const [newSettings, setNewSettings] = useState<DeviceSettingsParams>({});
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

  const handleBoolSettingToggle = useCallback(
    (setting: typeof boolSettings[0]) =>
      async ({ selected }: { selected: boolean }) => {
        setNewSettings({ ...newSettings, [setting['key']]: selected });
      },
    [newSettings],
  );
  const handleListSettingSelect = useCallback(
    (setting: typeof listSettings[0]) =>
      ({ selected }: { selected: number }) => {
        setNewSettings({ ...newSettings, [setting['key']]: setting.value[selected].id });
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
      <Text>Настройки устройства</Text>

      <Content>
        {deviceInfo?.device && (
          <>
            <div>
              <Settings key={`bool-${deviceInfo?.device.updated}`}>
                {map(boolSettings, (setting) => (
                  <Setting key={setting['key']}>
                    <SettingBool setting={setting} onToggle={handleBoolSettingToggle(setting)} />
                  </Setting>
                ))}
              </Settings>
              <Settings key={`list-${deviceInfo?.device.updated}`}>
                {map(listSettings, (setting) => (
                  <Setting key={setting['key']}>
                    <SettingList setting={setting} onSelect={handleListSettingSelect(setting)} />
                  </Setting>
                ))}
              </Settings>
            </div>

            <div>
              <Button icon="done" onClick={handleSaveClick}>
                Сохранить
              </Button>
            </div>
          </>
        )}

        <Footer>
          <div>
            <Text>Пользователь</Text>
            <User>
              {data?.user && (
                <Text>
                  {data.user.profile.name || data.user.username} ({Math.floor(data.user.subscription.days)} дн.)
                </Text>
              )}

              <Button icon="logout" onClick={handleLogoutClick}>
                Выход
              </Button>
            </User>
          </div>

          <Device>
            <Text>
              <div>{hardware}</div>
              <div>{software}</div>
            </Text>
          </Device>
        </Footer>
      </Content>
    </>
  );
};

export default SettingsView;
