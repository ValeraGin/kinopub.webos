import React from 'react';
import map from 'lodash/map';

import { Collection } from '../../api';
import CollectionItem from '../collectionItem';
import Scrollable from '../scrollable';

type Props = {
  collections?: Collection[];
  loading?: boolean;
};

const CollectionsList: React.FC<Props> = ({ collections, loading }) => {
  return (
    <Scrollable>
      {map(collections, (collection) => (
        <CollectionItem key={collection.id} collection={collection} />
      ))}
      {loading && map([...new Array(15)], (_, idx) => <CollectionItem key={idx} />)}
    </Scrollable>
  );
};

export default CollectionsList;
