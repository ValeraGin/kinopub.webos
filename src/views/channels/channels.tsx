import React from 'react';

import ChannelsList from 'components/channelsList';
import Seo from 'components/seo';
import useApi from 'hooks/useApi';

const CollectionsView: React.FC = () => {
  const { data, isLoading } = useApi('channels');

  return (
    <>
      <Seo title="Каналы" />
      <ChannelsList channels={data?.channels} loading={isLoading} />
    </>
  );
};

export default CollectionsView;
