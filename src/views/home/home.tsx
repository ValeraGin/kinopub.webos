import { useMemo } from 'react';

import { ItemsParams } from 'api';
import ItemsList from 'components/itemsList';
import Lazy from 'components/lazy';
import Link from 'components/link';
import Scrollable from 'components/scrollable';
import useApi from 'hooks/useApi';
import { PATHS, generatePath } from 'routes';

const ItemsSection: React.FC<{ title: string; params: ItemsParams }> = ({ title, params }) => {
  const { data, isLoading } = useApi('items', [params, 0, 12]);
  const href = useMemo(() => generatePath(PATHS.Category, { categoryId: params.type }), [params]);

  return (
    <div className="pb-2">
      <Link href={href} state={{ params, title }} className="mb-2">
        {title}
      </Link>

      <ItemsList items={data?.items} loading={isLoading} scrollable={false} />
    </div>
  );
};

const now = new Date();
const lastMonth = now.setMonth(now.getMonth() - 1) / 1000;

const PopularMovies: React.FC = () => {
  return <ItemsSection title="Популярные фильмы" params={{ type: 'movie', sort: 'views-', conditions: [`created>${lastMonth}`] }} />;
};

const NewMovies: React.FC = () => {
  return <ItemsSection title="Новые фильмы" params={{ type: 'movie', sort: 'created-' }} />;
};

const PopularSerials: React.FC = () => {
  return <ItemsSection title="Популярные сериалы" params={{ type: 'serial', sort: 'watchers-' }} />;
};

const NewSerials: React.FC = () => {
  return <ItemsSection title="Новые сериалы" params={{ type: 'serial', sort: 'created-' }} />;
};

const NewConcerts: React.FC = () => {
  return <ItemsSection title="Новые концерты" params={{ type: 'concert', sort: 'created-' }} />;
};

const NewDocuMovies: React.FC = () => {
  return <ItemsSection title="Новые документальные фильмы" params={{ type: 'documovie', sort: 'created-' }} />;
};

const NewDocuSerials: React.FC = () => {
  return <ItemsSection title="Новые документальные сериалы" params={{ type: 'docuserial', sort: 'created-' }} />;
};

const NewTVShows: React.FC = () => {
  return <ItemsSection title="Новые ТВ шоу" params={{ type: 'tvshow', sort: 'created-' }} />;
};

const HomeView: React.FC = () => {
  return (
    <>
      <Scrollable>
        <Lazy height="50rem">
          <PopularMovies />
        </Lazy>
        <Lazy height="50rem">
          <NewMovies />
        </Lazy>

        <Lazy height="50rem">
          <PopularSerials />
        </Lazy>
        <Lazy height="50rem">
          <NewSerials />
        </Lazy>

        <Lazy height="50rem">
          <NewConcerts />
        </Lazy>
        <Lazy height="50rem">
          <NewDocuMovies />
        </Lazy>
        <Lazy height="50rem">
          <NewDocuSerials />
        </Lazy>
        <Lazy height="50rem">
          <NewTVShows />
        </Lazy>
      </Scrollable>
    </>
  );
};

export default HomeView;
