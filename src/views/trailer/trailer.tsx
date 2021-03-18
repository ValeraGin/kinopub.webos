import { useCallback, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { ItemDetails, Trailer } from 'api';

import Player, { PlayerProps } from '../../components/player';
import FillLayout from '../../layouts/fill';

import { mapSources } from '../../utils/video';

type Props = {};

const TrailerView: React.FC<Props> = () => {
  const history = useHistory();
  const location = useLocation<{ item: ItemDetails; trailer: Trailer }>();
  const { item, trailer } = location.state;

  const playerProps = useMemo<PlayerProps>(() => {
    return {
      title: item.title,
      description: 'Трейлер',
      poster: item.posters.wide || item.posters.big,
      sources: mapSources([trailer]),
    };
  }, [item, trailer]);

  const handleOnEnded = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <FillLayout>
      <Player {...playerProps} onEnded={handleOnEnded} />
    </FillLayout>
  );
};

export default TrailerView;
