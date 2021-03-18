import React from 'react';

import ChannelsList from '../../components/channelsList';
import useApi from '../../hooks/useApi';
import MainLayout from '../../layouts/main';

type Props = {};

const CollectionsView: React.FC<Props> = () => {
  const { data, isLoading } = useApi('channels');

  return (
    <MainLayout>
      <ChannelsList channels={data?.channels} loading={isLoading} />
    </MainLayout>
  );
};

export default CollectionsView;
