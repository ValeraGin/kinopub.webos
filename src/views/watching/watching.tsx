import React from 'react';

import { Bool } from 'api';
import ItemsList from 'components/itemsList';
import useApi from 'hooks/useApi';

const WatchingView: React.FC = () => {
  const { data, isLoading } = useApi('watchingSerials', Bool.True);

  return (
    <>
      <ItemsList items={data?.items} loading={isLoading} />
    </>
  );
};

export default WatchingView;
