import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import map from 'lodash/map';

import Link from 'components/link';
import Seo from 'components/seo';
import ItemsListInfinite from 'containers/itemsListInfinite';
import useApiInfinite from 'hooks/useApiInfinite';
import { PATHS, RouteParams, generatePath } from 'routes';

const RELEASES_MAP = {
  itemsPopular: 'Популярные',
  itemsFresh: 'Свежие',
  itemsHot: 'Горячие',
} as const;

type Releases = keyof typeof RELEASES_MAP;

const getReleaseById = (releaseId?: string) => {
  return releaseId
    ? // @ts-expect-error
      RELEASES_MAP[releaseId]
    : RELEASES_MAP.itemsPopular;
};

const ReleasesView: React.FC = () => {
  const { releaseId = 'itemsPopular' } = useParams<RouteParams>();
  const queryResult = useApiInfinite(releaseId as Releases, ['1']);
  const total = useMemo(() => queryResult.data?.pages?.[0]?.pagination?.total_items, [queryResult.data?.pages]);
  const seoTitle = getReleaseById(releaseId);
  const title = total ? `${seoTitle} (${total})` : seoTitle;

  return (
    <>
      <Seo title={seoTitle} />
      <div className="flex">
        {map(RELEASES_MAP, (releaseName, releaseKey) => (
          <Link
            key={releaseKey}
            className="mr-2"
            active={releaseId === releaseKey}
            href={generatePath(PATHS.Releases, { releaseId: releaseKey })}
          >
            {releaseName}
          </Link>
        ))}
      </div>
      <ItemsListInfinite title={title} queryResult={queryResult} />
    </>
  );
};

export default ReleasesView;
