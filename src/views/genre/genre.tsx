import { useLocation, useParams } from 'react-router-dom';

import { ItemsParams } from 'api';
import Seo from 'components/seo';
import Text from 'components/text';
import FilterItems from 'containers/filterItems';
import ItemsListInfinite from 'containers/itemsListInfinite';
import useApiInfinite from 'hooks/useApiInfinite';
import useSessionState from 'hooks/useSessionState';
import { RouteParams } from 'routes';

const GENDER_TYPES = {
  '23': 'Мультфильмы',
  '25': 'Аниме',
} as const;

type GenderTypes = keyof typeof GENDER_TYPES;

const getGenreByType = (genreType?: GenderTypes) => {
  return (genreType ? GENDER_TYPES[genreType] : genreType) || '';
};

const GenreView: React.FC = () => {
  const { genreType } = useParams<RouteParams>();
  const location = useLocation<{ params?: ItemsParams; title?: string }>();
  const { params, title = getGenreByType(genreType as GenderTypes) } = location.state || {};
  const storageKey = `genre-${genreType}`;
  const [filterParams, setFilterParams] = useSessionState<ItemsParams | null>(`${storageKey}:filter:params`, null);

  const queryResult = useApiInfinite('items', [
    {
      ...params,
      ...filterParams,
      genre: genreType,
    },
  ]);

  return (
    <>
      <Seo title={title} />
      <ItemsListInfinite
        title={
          <>
            <Text>{title}</Text>
            <FilterItems type="movie" storageKey={storageKey} defaultGenre={genreType} onFilter={setFilterParams} />
          </>
        }
        queryResult={queryResult}
      />
    </>
  );
};

export default GenreView;
