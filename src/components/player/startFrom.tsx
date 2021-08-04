import { useCallback, useEffect, useMemo, useState } from 'react';
import { VideoPlayerBase } from '@enact/moonstone/VideoPlayer';

import Button from 'components/button';

type Props = {
  player: React.MutableRefObject<VideoPlayerBase | undefined>;
  startTime?: number;
  startInDelay?: number;
};

const StartFrom: React.FC<Props> = ({ startTime, startInDelay = 5, player }) => {
  const [visible, setVisible] = useState(true);
  const [startIn, setStartIn] = useState(startInDelay);
  const startFrom = useMemo(() => new Date((startTime || 0) * 1000).toISOString().substr(11, 8).replace(/^00:/, ''), [startTime]);

  const handleStartFromClick = useCallback(() => {
    if (player.current) {
      setVisible(false);
      const video: any = player.current.getVideoNode();

      video.currentTime = startTime;
    }
  }, [startTime, player]);
  const handleStartFromBeginingClick = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (visible) {
      intervalId = setInterval(() => {
        setStartIn((prevStartIn) => {
          const newStartIn = prevStartIn - 1;

          if (newStartIn <= 0) {
            handleStartFromClick();
          }

          return newStartIn;
        });
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [visible, handleStartFromClick]);

  if (!startTime || !visible) {
    return null;
  }

  return (
    <div className="flex justify-center absolute w-full z-50 bottom-32">
      <Button onClick={handleStartFromClick}>
        Смотреть с {startFrom} через {startIn}
      </Button>
      <Button autoFocus onClick={handleStartFromBeginingClick}>
        Смотреть с начала
      </Button>
    </div>
  );
};

export default StartFrom;
