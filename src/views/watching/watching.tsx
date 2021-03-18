import React from 'react';

import { Bool } from '../../api';
import ItemsList from '../../components/itemsList';
import useApi from '../../hooks/useApi';
import MainLayout from '../../layouts/main';

type Props = {};

const WatchingView: React.FC<Props> = () => {
  const { data, isLoading } = useApi('watchingSerials', Bool.True);

  return (
    <MainLayout>
      <ItemsList items={data?.items} loading={isLoading} />
    </MainLayout>
  );
};

export default WatchingView;
