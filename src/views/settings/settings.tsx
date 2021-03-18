import { useCallback, useMemo } from 'react';
import CheckboxItem from '@enact/moonstone/CheckboxItem';
import ExpandableList from '@enact/moonstone/ExpandableList';
import filter from 'lodash/filter';
import findIndex from 'lodash/findIndex';
import map from 'lodash/map';
import styled from 'styled-components';

import { Bool, DeviceSettingBoolean, DeviceSettingList } from '../../api';
import Button from '../../components/button';
import Text from '../../components/text';
import useApi from '../../hooks/useApi';
import useApiMutation from '../../hooks/useApiMutation';
import MainLayout from '../../layouts/main';

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

const User = styled.div`
  display: flex;
  align-items: center;

  ${Text} {
    padding-right: 2rem;
  }
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

type Props = {};

const SettingsView: React.FC<Props> = () => {
  const { data } = useApi('user');
  const { data: deviceInfo } = useApi('deviceInfo');
  const { saveDeviceSettings } = useApiMutation('saveDeviceSettings');
  const { deactivate } = useApiMutation('deactivate');

  const boolSettings = useMemo(
    () =>
      filter(
        map(deviceInfo?.device.settings, (setting, key) => ({ ...setting, key })),
        (setting) => typeof setting['type'] === 'undefined',
      ) as DeviceSettingBoolean[],
    [deviceInfo?.device.settings],
  );
  const listSettings = useMemo(
    () =>
      filter(
        map(deviceInfo?.device.settings, (setting, key) => ({ ...setting, key })),
        (setting: DeviceSettingBoolean) => setting['type'] === 'list',
      ) as DeviceSettingList[],
    [deviceInfo?.device.settings],
  );

  const handleBoolSettingToggle = useCallback(
    (setting: DeviceSettingBoolean) => async ({ selected }) => {
      if (deviceInfo?.device.id) {
        saveDeviceSettings([deviceInfo.device.id, { [setting['key']]: selected }]);
      }
    },
    [deviceInfo?.device.id, saveDeviceSettings],
  );
  const handleListSettingSelect = useCallback(
    (setting: DeviceSettingList) => ({ selected }) => {
      if (deviceInfo?.device.id) {
        saveDeviceSettings([deviceInfo.device.id, { [setting['key']]: setting.value[selected].id }]);
      }
    },
    [deviceInfo?.device.id, saveDeviceSettings],
  );
  const handleLogoutClick = useCallback(() => {
    deactivate([]);
  }, [deactivate]);

  return (
    <MainLayout>
      <Text>Настройки устройства</Text>

      <Content>
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

        {data?.user && (
          <div>
            <Text>Пользователь</Text>

            <User>
              <Text>
                {data.user.profile.name || data.user.username} ({Math.floor(data.user.subscription.days)} дн.)
              </Text>

              <Button icon="logout" onClick={handleLogoutClick}>
                Выход
              </Button>
            </User>
          </div>
        )}
      </Content>
    </MainLayout>
  );
};

export default SettingsView;
