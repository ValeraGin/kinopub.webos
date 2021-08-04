import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';

import { Collection } from 'api';
import ImageItem from 'components/imageItem';
import { PATHS, generatePath } from 'routes';

type Props = {
  collection?: Collection;
  className?: string;
};

const CollectionItem: React.FC<Props> = ({ collection, className }) => {
  const history = useHistory();
  const handleOnClick = useCallback(() => {
    if (collection?.id) {
      history.push(
        generatePath(PATHS.Collection, {
          collectionId: collection.id,
        }),
      );
    }
  }, [collection?.id, history]);

  return (
    <ImageItem onClick={handleOnClick} source={collection?.posters.medium} caption={collection?.title} className={cx('h-72', className)} />
  );
};

export default CollectionItem;
