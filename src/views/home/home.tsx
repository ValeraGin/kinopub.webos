import { useMemo } from 'react';
import dayjs from 'dayjs';

import { ItemsParams } from 'api';
import ItemsList from 'components/itemsList';
import Link from 'components/link';
import Scrollable from 'components/scrollable';
import Seo from 'components/seo';
import useApi from 'hooks/useApi';
import { PATHS, generatePath } from 'routes';

const ItemsSection: React.FC<{ title: string; params: ItemsParams }> = ({ title, params }) => {
  const { data, isLoading } = useApi('items', [params, 0, 10]);
  const href = useMemo(() => generatePath(PATHS.Category, { categoryType: params.type }), [params]);

  return (
    <div className="pb-2">
      <ItemsList
        title={
          <Link href={href} state={{ params, title }} className="w-full">
            {title}
          </Link>
        }
        titleClassName="ml-0"
        items={data?.items}
        loading={isLoading}
        scrollable={false}
      />
    </div>
  );
};

const lastMonth = dayjs().add(-1, 'month').unix();

const PopularMovies: React.FC = () => {
  return <ItemsSection title="Популярные фильмы" params={{ type: 'movie', sort: 'views-', conditions: [`created>=${lastMonth}`] }} />;
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
      <Seo title="Главная" />
      <Scrollable>
        <PopularMovies />

        <NewMovies />

        <PopularSerials />

        <NewSerials />

        <NewConcerts />

        <NewDocuMovies />

        <NewDocuSerials />

        <NewTVShows />
      </Scrollable>
    </>
  );
};

export default HomeView;
