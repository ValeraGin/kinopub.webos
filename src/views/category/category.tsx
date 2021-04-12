import { useParams } from 'react-router-dom';

import ItemsListInfinite from 'containers/itemsListInfinite';
import useApiInfinite from 'hooks/useApiInfinite';
import { RouteParams } from 'routes';

const CategoryView: React.FC = () => {
  const { categoryId } = useParams<RouteParams>();
  const queryResult = useApiInfinite('items', {
    type: categoryId,
  });

  return (
    <>
      <ItemsListInfinite queryResult={queryResult} />
    </>
  );
};

export default CategoryView;
