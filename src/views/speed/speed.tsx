import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import map from 'lodash/map';

import Button from 'components/button';
import Seo from 'components/seo';
import Text from 'components/text';
import useApi from 'hooks/useApi';

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
  const [error, setError] = useState('');

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
  const workers = useMemo(() => {
    // @ts-expect-error
    if (!window['Speedtest']) {
      return [];
    }

    return map(servers, (server) => {
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
    });
  }, [servers, setSpeed]);
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
    script.onerror = (error) => {
      setError(`Не удалось загрузить скрипт для замера скорости: ${error}`);
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <>
      <Seo title="Проверка скорости" />
      <Text className="m-1 mb-10">Проверка скорости</Text>

      {error ? (
        <div className="m-1 mb-10">
          <Text className="text-red-600">{error}</Text>
        </div>
      ) : (
        servers.length > 0 &&
        !workers.length && (
          <div className="m-1 mb-10">
            <Text className="text-red-600">Не удалось создать ни одного воркера для замера скорости</Text>
          </div>
        )
      )}

      <div className="flex justify-around">
        {map(data?.items, (location) => (
          <div className="flex flex-col items-center" key={location.id}>
            <Text>{location.name}</Text>
            {speed[location.location] || '0.00'}
            <Text>Mbit/s</Text>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-12">
        {started ? (
          <Button icon="stop" onClick={handleStop}>
            Стоп
          </Button>
        ) : (
          <Button icon="play_arrow" onClick={handleStart} disabled={!workers.length}>
            Начать
          </Button>
        )}
      </div>
    </>
  );
};

export default SpeedView;
