import { useLocation, useParams } from 'react-router-dom';

import { ItemsParams } from 'api';
import Seo from 'components/seo';
import ItemsListInfinite from 'containers/itemsListInfinite';
import useApiInfinite from 'hooks/useApiInfinite';
import { RouteParams } from 'routes';

const GENDER_ID_MAP = {
  23: 'Мультфильмы',
  25: 'Аниме',
} as const;

const getGenreById = (genreId?: string) => {
  return (
    (genreId
      ? // @ts-expect-error
        GENDER_ID_MAP[genreId]
      : genreId) || ''
  );
};

const GenreView: React.FC = () => {
  const { genreId } = useParams<RouteParams>();
  const location = useLocation<{ params?: ItemsParams; title?: string }>();
  const { params, title = getGenreById(genreId) } = location.state || {};

  const queryResult = useApiInfinite('items', [
    {
      ...params,
      genre: genreId,
    },
  ]);

  return (
    <>
      <Seo title={title} />
      <ItemsListInfinite title={title} queryResult={queryResult} />
    </>
  );
};

export default GenreView;
