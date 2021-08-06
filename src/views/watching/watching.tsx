import React from 'react';

import { Bool } from 'api';
import ItemsList from 'components/itemsList';
import Seo from 'components/seo';
import useApi from 'hooks/useApi';

const WatchingView: React.FC = () => {
  const { data, isLoading } = useApi('watchingSerials', [Bool.True]);

  return (
    <>
      <Seo title="Я смотрю" />
      <ItemsList items={data?.items} loading={isLoading} />
    </>
  );
};

export default WatchingView;
