import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import capitalize from 'lodash/capitalize';
import map from 'lodash/map';

import Link from 'components/link';
import Seo from 'components/seo';
import ItemsListInfinite from 'containers/itemsListInfinite';
import useApiInfinite from 'hooks/useApiInfinite';
import { PATHS, RouteParams, generatePath } from 'routes';

const RELEASE_TYPES_MAP = {
  popular: 'Популярные',
  fresh: 'Свежие',
  hot: 'Горячие',
} as const;

type ReleaseTypes = keyof typeof RELEASE_TYPES_MAP;

const getReleaseById = (releaseId?: string) => {
  return releaseId
    ? // @ts-expect-error
      RELEASE_TYPES_MAP[releaseId]
    : RELEASE_TYPES_MAP.fresh;
};

const ReleasesView: React.FC = () => {
  const { releaseType = 'popular' } = useParams<RouteParams>();
  const queryResult = useApiInfinite(`items${capitalize(releaseType) as Capitalize<ReleaseTypes>}`, ['1']);
  const total = useMemo(() => queryResult.data?.pages?.[0]?.pagination?.total_items, [queryResult.data?.pages]);
  const seoTitle = getReleaseById(releaseType);
  const title = total ? `${seoTitle} (${total})` : seoTitle;

  return (
    <>
      <Seo title={seoTitle} />
      <div className="flex">
        {map(RELEASE_TYPES_MAP, (releaseName, releaseKey) => (
          <Link
            key={releaseKey}
            className="mr-2"
            replace
            active={releaseType === releaseKey}
            href={generatePath(PATHS.Releases, { releaseType: releaseKey })}
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
