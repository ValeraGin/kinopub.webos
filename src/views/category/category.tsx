import { useLocation, useParams } from 'react-router-dom';

import { ItemType, ItemsParams } from 'api';
import Seo from 'components/seo';
import Text from 'components/text';
import FilterItems from 'containers/filterItems';
import ItemsListInfinite from 'containers/itemsListInfinite';
import useApiInfinite from 'hooks/useApiInfinite';
import useSearchParams from 'hooks/useSearchParams';
import useSessionState from 'hooks/useSessionState';

const CATEGORY_TYPES: Record<ItemType, string> = {
  movie: 'Фильмы',
  serial: 'Сериалы',
  concert: 'Концерты',
  documovie: 'Документальные фильмы',
  docuserial: 'Документальные сериалы',
  tvshow: 'ТВ Шоу',
};

const getCategoryByType = (categoryType?: ItemType) => {
  return (categoryType ? CATEGORY_TYPES[categoryType] : categoryType) || '';
};

const CategoryView: React.FC = () => {
  const { categoryType } = useParams<{ categoryType: ItemType }>();
  const searchParams = useSearchParams();
  const location = useLocation<{ params?: ItemsParams; title?: string }>();
  const { params, title = getCategoryByType(categoryType) } = location.state || {};
  const [filterParams, setFilterParams] = useSessionState<ItemsParams | null>(`${categoryType}:filter:params`, null);

  const queryResult = useApiInfinite('items', [
    {
      ...searchParams,
      ...params,
      ...filterParams,
      type: categoryType,
    },
  ]);

  return (
    <>
      <Seo title={title} />
      <ItemsListInfinite
        title={
          <>
            <Text>{title}</Text>
            <FilterItems type={categoryType} storageKey={categoryType} onFilter={setFilterParams} />
          </>
        }
        queryResult={queryResult}
      />
    </>
  );
};

export default CategoryView;
