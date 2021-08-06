import React from 'react';

import { Bool } from 'api';
import ItemsList from 'components/itemsList';
import Seo from 'components/seo';
import useApi from 'hooks/useApi';

const WatchingView: React.FC = () => {
  const { data, isLoading } = useApi('watchingSerials', [Bool.True]);
  const title = 'Я смотрю';

  return (
    <>
      <Seo title={title} />
      <ItemsList title={title} items={data?.items} loading={isLoading} />
    </>
  );
};

export default WatchingView;
