import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import map from 'lodash/map';
import styled from 'styled-components';

import Button from 'components/button';
import Text from 'components/text';
import useApi from 'hooks/useApi';

const Locations = styled.div`
  display: flex;
  justify-content: space-around;
`;

const Location = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Actions = styled.div`
  padding-top: 3rem;
  display: flex;
  justify-content: center;
`;

function updateSpeedReducer(state: { [location: string]: string }, action: { type: string; payload: string }) {
  return {
    ...state,
    [action.type]: action.payload,
  };
}

const SpeedView: React.FC = () => {
  const { data } = useApi('serverLocations');
  const [speed, setSpeed] = useReducer(updateSpeedReducer, {});
  const [started, setStarted] = useState(false);

  const servers = useMemo(
    () =>
      map(data?.items, ({ name, location }) => ({
        name,
        location,
        server: `https://${location}-speed.streambox.in`,
        dlURL: `/garbage.php`,
        ulURL: `/empty.php`,
        pingURL: `/empty.php`,
        getIpURL: `/getIP.php`,
      })),
    [data?.items],
  );
  const workers = useMemo(
    () =>
      map(servers, (server) => {
        // @ts-expect-error
        const worker = new window['Speedtest']();

        worker._settings.test_order = 'IP_D';
        worker._settings.xhr_dlMultistream = 1;

        worker.setSelectedServer(server);

        worker.onupdate = ({ testState, dlStatus }: { testState: number; dlStatus: string }) => {
          setSpeed({
            type: server.location,
            payload: dlStatus || ((testState === 1 || testState === 2) && 'Начинаем') || '',
          });
        };

        return worker;
      }),
    [servers, setSpeed],
  );
  const [currentWorkerIndex, setCurrentWorkerIndex] = useState(0);

  const handleStart = useCallback(() => {
    setStarted(true);
    setCurrentWorkerIndex(0);
  }, []);

  const handleStop = useCallback(() => {
    setStarted(false);
  }, []);

  useEffect(() => {
    if (workers[currentWorkerIndex]) {
      if (started) {
        workers[currentWorkerIndex].onend = () => {
          setCurrentWorkerIndex(currentWorkerIndex + 1);
        };

        if (workers[currentWorkerIndex]._state !== 3) {
          workers[currentWorkerIndex].start();
        }
      } else {
        if (workers[currentWorkerIndex]._state === 3) {
          workers[currentWorkerIndex].abort();
        }
      }
    } else {
      handleStop();
    }
  }, [started, workers, currentWorkerIndex, handleStop]);

  useEffect(() => {
    return () => {
      handleStop();
    };
  }, [handleStop]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = './speedtest.js';
    script.async = true;

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <>
      <Text>Проверка скорости</Text>

      <Locations>
        {map(data?.items, (location) => (
          <Location key={location.id}>
            <Text>{location.name}</Text>
            {speed[location.location] || '0.00'}
            <Text>Mbit/s</Text>
          </Location>
        ))}
      </Locations>

      <Actions>
        {started ? (
          <Button icon="stop" onClick={handleStop}>
            Стоп
          </Button>
        ) : (
          <Button icon="play_arrow" onClick={handleStart}>
            Начать
          </Button>
        )}
      </Actions>
    </>
  );
};

export default SpeedView;
