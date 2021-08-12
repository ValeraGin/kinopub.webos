import React, { useMemo } from 'react';
import { generatePath, useParams } from 'react-router-dom';
import capitalize from 'lodash/capitalize';
import map from 'lodash/map';
import sumBy from 'lodash/sumBy';

import { Bool } from 'api';
import ItemsList from 'components/itemsList';
import Link from 'components/link';
import Seo from 'components/seo';
import useApi from 'hooks/useApi';
import { PATHS, RouteParams } from 'routes';

const WATCHING_TYPES_MAP = {
  serials: 'Сериалы',
  movies: 'Фильмы',
} as const;

type WatchingTypes = keyof typeof WATCHING_TYPES_MAP;

const WatchingView: React.FC = () => {
  const { watchingType = 'serials' } = useParams<RouteParams>();
  const { data, isLoading } = useApi(`watching${capitalize(watchingType) as Capitalize<WatchingTypes>}`, [Bool.True]);
  const total = useMemo(() => sumBy(data?.items, (item) => +(item.new || 0)), [data?.items]);
  const seoTitle = watchingType === 'serials' ? 'Новые эпизоды' : 'Недосмотренные фильмы';
  const title = total ? `${seoTitle} (${total})` : seoTitle;

  return (
    <>
      <Seo title={seoTitle} />
      <div className="flex">
        {map(WATCHING_TYPES_MAP, (watchingTypeName, watchingTypeKey) => (
          <Link
            key={watchingTypeKey}
            className="mr-2"
            replace
            active={watchingType === watchingTypeKey}
            href={generatePath(PATHS.Watching, { watchingType: watchingTypeKey })}
          >
            {watchingTypeName}
          </Link>
        ))}
      </div>
      <ItemsList title={title} items={data?.items} loading={isLoading} />
    </>
  );
};

export default WatchingView;
