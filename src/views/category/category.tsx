import { useLocation, useParams } from 'react-router-dom';

import { ItemsParams } from 'api';
import Seo from 'components/seo';
import ItemsListInfinite from 'containers/itemsListInfinite';
import useApiInfinite from 'hooks/useApiInfinite';
import useSearchParams from 'hooks/useSearchParams';
import { RouteParams } from 'routes';

const CATEGORY_ID_MAP = {
  movie: 'Фильмы',
  serial: 'Сериалы',
  concert: 'Концерты',
  documovie: 'Документальные фильмы',
  docuserial: 'Документальные сериалы',
  tvshow: 'ТВ Шоу',
} as const;

const getCategoryById = (categoryId?: string) => {
  return (
    (categoryId
      ? // @ts-expect-error
        CATEGORY_ID_MAP[categoryId]
      : categoryId) || ''
  );
};

const CategoryView: React.FC = () => {
  const { categoryId } = useParams<RouteParams>();
  const searchParams = useSearchParams();
  const location = useLocation<{ params?: ItemsParams; title?: string }>();
  const { params, title = getCategoryById(categoryId) } = location.state || {};

  const queryResult = useApiInfinite('items', [
    {
      ...searchParams,
      ...params,
      type: categoryId,
    },
  ]);

  return (
    <>
      <Seo title={title} />
      <ItemsListInfinite title={title} queryResult={queryResult} />
    </>
  );
};

export default CategoryView;
