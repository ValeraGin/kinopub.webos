import React from 'react';

import ChannelsList from 'components/channelsList';
import useApi from 'hooks/useApi';

const CollectionsView: React.FC = () => {
  const { data, isLoading } = useApi('channels');

  return (
    <>
      <ChannelsList channels={data?.channels} loading={isLoading} />
    </>
  );
};

export default CollectionsView;
