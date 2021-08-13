import { useLocation, useParams } from 'react-router-dom';

import { ItemsParams } from 'api';
import Seo from 'components/seo';
import ItemsListInfinite from 'containers/itemsListInfinite';
import useApiInfinite from 'hooks/useApiInfinite';
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

  const queryResult = useApiInfinite('items', [
    {
      ...params,
      genre: genreType,
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
