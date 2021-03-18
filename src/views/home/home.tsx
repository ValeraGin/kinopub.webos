import ItemsList from '../../components/itemsList';
import Scrollable from '../../components/scrollable';
import Text from '../../components/text';
import useApi from '../../hooks/useApi';
import MainLayout from '../../layouts/main';

type Props = {};

const HomeView: React.FC<Props> = () => {
  const { data: popularMovies, isLoading: popularMoviesLoading } = useApi('itemsPopular', 'movie', 0, 12);
  const { data: newMovies, isLoading: newMoviesLoading } = useApi('items', { type: 'movie', sort: 'created-' }, 0, 12);

  const { data: popularSerials, isLoading: popularSerialsLoading } = useApi('items', { type: 'serial', sort: 'watchers-' }, 0, 12);
  const { data: newSerials, isLoading: newSerialsLoading } = useApi('items', { type: 'serial', sort: 'created-' }, 0, 12);

  const { data: newConcerts, isLoading: newConcertsLoading } = useApi('items', { type: 'concert', sort: 'created-' }, 0, 12);
  const { data: newDocuMovies, isLoading: newDocuMoviesLoading } = useApi('items', { type: 'documovie', sort: 'created-' }, 0, 12);
  const { data: newDocuSerials, isLoading: newDocuSerialsLoading } = useApi('items', { type: 'docuserial', sort: 'created-' }, 0, 12);
  const { data: newTVShows, isLoading: newTVShowsLoading } = useApi('items', { type: 'tvshow', sort: 'created-' }, 0, 12);

  return (
    <MainLayout>
      <Scrollable>
        <Text>Популярные фильмы</Text>
        <ItemsList items={popularMovies?.items} loading={popularMoviesLoading} scrollable={false} />
        <Text>Новые фильмы</Text>
        <ItemsList items={newMovies?.items} loading={newMoviesLoading} scrollable={false} />

        <Text>Популярные сериалы</Text>
        <ItemsList items={popularSerials?.items} loading={popularSerialsLoading} scrollable={false} />
        <Text>Новые сериалы</Text>
        <ItemsList items={newSerials?.items} loading={newSerialsLoading} scrollable={false} />

        <Text>Новые концерты</Text>
        <ItemsList items={newConcerts?.items} loading={newConcertsLoading} scrollable={false} />

        <Text>Новые документальные фильмы</Text>
        <ItemsList items={newDocuMovies?.items} loading={newDocuMoviesLoading} scrollable={false} />

        <Text>Новые документальные сериалы</Text>
        <ItemsList items={newDocuSerials?.items} loading={newDocuSerialsLoading} scrollable={false} />

        <Text>Новые ТВ шоу</Text>
        <ItemsList items={newTVShows?.items} loading={newTVShowsLoading} scrollable={false} />
      </Scrollable>
    </MainLayout>
  );
};

export default HomeView;
