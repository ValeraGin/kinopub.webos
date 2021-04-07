import { Item } from 'api';
import ItemsList from 'components/itemsList';
import Lazy from 'components/lazy';
import Scrollable from 'components/scrollable';
import Text from 'components/text';
import useApi from 'hooks/useApi';

const ItemsSection: React.FC<{ title: string; items?: Item[]; loading?: boolean }> = ({ title, items, loading }) => {
  return (
    <>
      <Text>{title}</Text>
      <ItemsList items={items} loading={loading} scrollable={false} />
    </>
  );
};

const PopularMovies: React.FC = () => {
  const { data, isLoading } = useApi('itemsPopular', 'movie', 0, 10);

  return <ItemsSection title="Популярные фильмы" items={data?.items} loading={isLoading} />;
};

const NewMovies: React.FC = () => {
  const { data, isLoading } = useApi('items', { type: 'movie', sort: 'created-' }, 0, 10);

  return <ItemsSection title="Новые фильмы" items={data?.items} loading={isLoading} />;
};

const PopularSerials: React.FC = () => {
  const { data, isLoading } = useApi('items', { type: 'serial', sort: 'watchers-' }, 0, 10);

  return <ItemsSection title="Популярные сериалы" items={data?.items} loading={isLoading} />;
};

const NewSerials: React.FC = () => {
  const { data, isLoading } = useApi('items', { type: 'serial', sort: 'created-' }, 0, 10);

  return <ItemsSection title="Новые сериалы" items={data?.items} loading={isLoading} />;
};

const NewConcerts: React.FC = () => {
  const { data, isLoading } = useApi('items', { type: 'concert', sort: 'created-' }, 0, 10);

  return <ItemsSection title="Новые концерты" items={data?.items} loading={isLoading} />;
};

const NewDocuMovies: React.FC = () => {
  const { data, isLoading } = useApi('items', { type: 'documovie', sort: 'created-' }, 0, 10);

  return <ItemsSection title="Новые документальные фильмы" items={data?.items} loading={isLoading} />;
};

const NewDocuSerials: React.FC = () => {
  const { data, isLoading } = useApi('items', { type: 'docuserial', sort: 'created-' }, 0, 10);

  return <ItemsSection title="Новые документальные сериалы" items={data?.items} loading={isLoading} />;
};

const NewTVShows: React.FC = () => {
  const { data, isLoading } = useApi('items', { type: 'tvshow', sort: 'created-' }, 0, 10);

  return <ItemsSection title="Новые ТВ шоу" items={data?.items} loading={isLoading} />;
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
