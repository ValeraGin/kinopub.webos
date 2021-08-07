import React, { useMemo } from 'react';
import sumBy from 'lodash/sumBy';

import { Bool } from 'api';
import ItemsList from 'components/itemsList';
import Seo from 'components/seo';
import useApi from 'hooks/useApi';

const WatchingView: React.FC = () => {
  const { data, isLoading } = useApi('watchingSerials', [Bool.True]);
  const newEpisodes = useMemo(() => sumBy(data?.items, (item) => +(item.new || 0)), [data?.items]);
  const title = newEpisodes ? `Новые эпизоды (${newEpisodes})` : 'Новые эпизоды';

  return (
    <>
      <Seo title={title} />
      <ItemsList title={title} items={data?.items} loading={isLoading} />
    </>
  );
};

export default WatchingView;
