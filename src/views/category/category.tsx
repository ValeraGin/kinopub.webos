import { useLocation, useParams } from 'react-router-dom';

import { ItemsParams } from 'api';
import Seo from 'components/seo';
import ItemsListInfinite from 'containers/itemsListInfinite';
import useApiInfinite from 'hooks/useApiInfinite';
import useSearchParams from 'hooks/useSearchParams';
import { RouteParams } from 'routes';

const CATEGORY_TYPES = {
  movie: 'Фильмы',
  serial: 'Сериалы',
  concert: 'Концерты',
  documovie: 'Документальные фильмы',
  docuserial: 'Документальные сериалы',
  tvshow: 'ТВ Шоу',
} as const;

type CategoryTypes = keyof typeof CATEGORY_TYPES;

const getCategoryByType = (categoryType?: CategoryTypes) => {
  return (categoryType ? CATEGORY_TYPES[categoryType] : categoryType) || '';
};

const CategoryView: React.FC = () => {
  const { categoryType } = useParams<RouteParams>();
  const searchParams = useSearchParams();
  const location = useLocation<{ params?: ItemsParams; title?: string }>();
  const { params, title = getCategoryByType(categoryType as CategoryTypes) } = location.state || {};

  const queryResult = useApiInfinite('items', [
    {
      ...searchParams,
      ...params,
      type: categoryType,
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
