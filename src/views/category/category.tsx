import { useLocation, useParams } from 'react-router-dom';

import { ItemsParams } from 'api';
import ItemsListInfinite from 'containers/itemsListInfinite';
import useApiInfinite from 'hooks/useApiInfinite';
import { RouteParams } from 'routes';

const CategoryView: React.FC = () => {
  const { categoryId } = useParams<RouteParams>();
  const location = useLocation<{ params?: ItemsParams; title?: string }>();
  const { params, title } = location.state || {};

  const queryResult = useApiInfinite('items', [
    {
      ...params,
      type: categoryId,
    },
  ]);

  return <ItemsListInfinite title={title} queryResult={queryResult} />;
};

export default CategoryView;
